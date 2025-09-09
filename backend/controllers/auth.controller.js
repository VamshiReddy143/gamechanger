const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Joi = require("joi");

const userValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Name should be a string",
            "string.empty": "Name cannot be empty",
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must be at most 30 characters long",
            "any.required": "Name is required"
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Email must be valid",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        }),
    role: Joi.string()
        .valid('coach', 'user')
        .default('user')
        .messages({
            "string.valid": "Role must be either 'coach' or 'user'",
            "string.base": "Role must be a string"
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        })
});

const otpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required()
});

// Single token generator function
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

const generateResetToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate random 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Cookie options
const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
});

const cookieOptions = getCookieOptions();

const REGISTER = async (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }

    const { name, email, password, role } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password, 12);

        const tempUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: role && ['coach', 'user'].includes(role) ? role : 'user',
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration OTP Verification',
            html: `
                <h2>Verify Your Email</h2>
                <p>Your OTP for registration is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "OTP sent to your email",
            success: true,
            email: email
        });

    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

const VERIFY_OTP = async (req, res, next) => {
    const { error } = otpSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }

    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true;
        await user.save();

        const token = generateToken(user._id, user.role);

        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token // Also send token in response for client storage
        });

    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

const RESEND_OTP = async (req, res, next) => {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }

    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration OTP Verification',
            html: `
                <h2>Verify Your Email</h2>
                <p>Your new OTP is: <strong>${otp}</strong></p>
                <p>Expires in 10 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        });
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

const LOGIN = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id, user.role);

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token
        });

    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

const LOGOUT = async (req, res, next) => {
    try {
        res.clearCookie('token', cookieOptions);
        
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

const ME = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            res.clearCookie('token', cookieOptions);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        err.statusCode = 500;
        next(err);
    }
};

const FORGOT_PASSWORD = async (req, res, next) => {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }

    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resetToken = generateResetToken(user._id);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link expires in 1 hour.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

const RESET_PASSWORD = async (req, res, next) => {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }

    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        res.clearCookie('token', cookieOptions);

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        err.statusCode = 500;
        next(err);
    }
};

// Remove REFRESH_TOKEN function entirely

module.exports = { 
    REGISTER, 
    LOGIN, 
    LOGOUT, 
    ME, 
    FORGOT_PASSWORD, 
    RESET_PASSWORD, 
    VERIFY_OTP, 
    RESEND_OTP 
    // REMOVED: REFRESH_TOKEN
};