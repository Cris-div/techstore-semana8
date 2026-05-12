const router = require('express').Router();
const { createRole, getRoles, updateRole, deleteRole} = require('../controllers/role.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

router.post('/', verifyToken, checkRole('Admin'), createRole);

router.get('/', verifyToken, getRoles);
router.put('/:id',verifyToken,checkRole('Admin'),updateRole);
router.delete('/:id',verifyToken,checkRole('Admin'),deleteRole);
module.exports = router;