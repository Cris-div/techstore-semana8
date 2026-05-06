const db = require('../models/db');

const getUserRoles = (userId, callback) => {

    const sql = `
        SELECT r.nombre
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) return callback(err, null);

        const roles = results.map(r => r.nombre);

        callback(null, roles);
    });
};


const checkRole = (roleName) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ msg: 'No autenticado' });
        }

        getUserRoles(req.user.id, (err, roles) => {

            if (err) return res.status(500).json({ msg: 'Error interno' });

            if (roles.length === 0) {
                return res.status(403).json({ msg: 'Usuario sin roles' });
            }

            if (!roles.includes(roleName)) {
                return res.status(403).json({ msg: 'Sin permisos' });
            }

            next();
        });
    };
};

module.exports = { checkRole, getUserRoles };