const router = require('express').Router();
const { register, login, verifyMFA } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-mfa', verifyMFA);

module.exports = router;