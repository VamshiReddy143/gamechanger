const  mongoose =require( "mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['coach', 'user'], 
        default: 'user',
        required: true 
    },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String }
});


UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

module.exports =  mongoose.model("User", UserSchema);