const db = require('../models/db');

const assignRole = (req, res) => {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
        return res.status(400).json({ msg: 'Faltan datos' });
    }

    // ✅ Verificar si usuario existe
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json(err);

        if (user.length === 0) {
            return res.status(404).json({ msg: 'Usuario no existe' });
        }

        // ✅ Verificar si rol existe
        db.query("SELECT * FROM roles WHERE id = ?", [roleId], (err, role) => {
            if (err) return res.status(500).json(err);

            if (role.length === 0) {
                return res.status(404).json({ msg: 'Rol no existe' });
            }

            // ✅ Evitar duplicados
            db.query(
                "SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?",
                [userId, roleId],
                (err, existing) => {
                    if (err) return res.status(500).json(err);

                    if (existing.length > 0) {
                        return res.status(400).json({ msg: 'Rol ya asignado' });
                    }

                    // ✅ Insertar
                    const sql = `
                        INSERT INTO user_roles (user_id, role_id)
                        VALUES (?, ?)
                    `;

                    db.query(sql, [userId, roleId], (err) => {
                        if (err) return res.status(500).json(err);

                        res.json({ msg: 'Rol asignado correctamente' });
                    });
                }
            );
        });
    });
};

module.exports = { assignRole };