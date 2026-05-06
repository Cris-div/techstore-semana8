const router = require('express').Router();
const { createRole, getRoles } = require('../controllers/role.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

router.post('/', verifyToken, checkRole('Admin'), createRole);

router.get('/', verifyToken, getRoles);

module.exports = router;