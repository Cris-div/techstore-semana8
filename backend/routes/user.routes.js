const router = require('express').Router();
const { assignRole } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/assign-role', verifyToken, assignRole);

module.exports = router;