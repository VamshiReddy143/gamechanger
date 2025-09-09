const  express =require ("express");
const  { FORGOT_PASSWORD, LOGIN, LOGOUT, REFRESH_TOKEN, REGISTER, RESET_PASSWORD, VERIFY_OTP, RESEND_OTP, ME } = require( "../controllers/auth.controller");

const router = express.Router();

router.post("/register", REGISTER);
router.post("/login", LOGIN);
router.post("/verify-otp", VERIFY_OTP);
router.post("/resend-otp", RESEND_OTP);
router.post("/forgot-password", FORGOT_PASSWORD);
router.post("/reset-password/:token", RESET_PASSWORD);
router.post("/refresh-token", REFRESH_TOKEN);
router.post("/logout", LOGOUT);
router.get("/me",ME)
// Add these test endpoints to your auth routes
router.get('/test-cookies', (req, res) => {
  res.json({
    cookiesPresent: !!req.cookies.accessToken,
    cookies: req.cookies
  });
});

router.post('/test-cookie', (req, res) => {
  res.cookie('testCookie', 'testValue', {
    httpOnly: true,
    sameSite: 'lax',
    domain: 'localhost'
  });
  res.send('Cookie set');
});

module.exports = router





