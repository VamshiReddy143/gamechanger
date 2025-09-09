const  express =require ("express");
const  { FORGOT_PASSWORD, LOGIN, LOGOUT, REGISTER, RESET_PASSWORD, VERIFY_OTP, RESEND_OTP, ME } = require( "../controllers/auth.controller");

const router = express.Router();

router.post("/register", REGISTER);
router.post("/login", LOGIN);
router.post("/verify-otp", VERIFY_OTP);
router.post("/resend-otp", RESEND_OTP);
router.post("/forgot-password", FORGOT_PASSWORD);
router.post("/reset-password/:token", RESET_PASSWORD);
router.post("/logout", LOGOUT);
router.get("/me",ME)


module.exports = router





