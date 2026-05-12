const db = require('../models/db');

const createRole = (req, res) => {
    db.query(
        "INSERT INTO roles (nombre) VALUES (?)",
        [req.body.nombre],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ msg: 'Rol creado' });
        }
    );
};

const getRoles = (req, res) => {
    db.query("SELECT * FROM roles", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

const updateRole = (req, res) => {

    db.query(
        "UPDATE roles SET nombre = ? WHERE id = ?",
        [req.body.nombre, req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({ msg: 'Rol actualizado' });
        }
    );
};

const deleteRole = (req, res) => {

    // verificar si tiene usuarios
    db.query(
        "SELECT * FROM user_roles WHERE role_id = ?",
        [req.params.id],
        (err, results) => {

            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.status(400).json({
                    msg: 'No se puede eliminar, tiene usuarios'
                });
            }

            db.query(
                "DELETE FROM roles WHERE id = ?",
                [req.params.id],
                (err) => {

                    if (err) return res.status(500).json(err);

                    res.json({ msg: 'Rol eliminado' });
                }
            );
        }
    );
};

module.exports = { createRole, getRoles, updateRole, deleteRole };