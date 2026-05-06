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

module.exports = { createRole, getRoles };