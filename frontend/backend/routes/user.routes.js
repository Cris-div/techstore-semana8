const router = require('express').Router();
const { assignRole } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const { checkRole } = require('../middlewares/rbac.middleware');

router.post('/assign-role',verifyToken,checkRole('Admin'),assignRole);

module.exports = router;