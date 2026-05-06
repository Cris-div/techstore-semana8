const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET, MFA_EXPIRATION } = require('../config/config');

let mfaCodes = [];

// 🟢 REGISTER
const register = async (req, res) => {
    const { email, password, nombre, tienda } = req.body;

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regex.test(password)) {
        return res.status(400).json({ msg: 'Contraseña insegura' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (email, password, nombre, tienda)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [email, hashed, nombre, tienda], (err) => {

        // 🔥 FIX EMAIL DUPLICADO
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ msg: 'Email ya registrado' });
            }
            return res.status(500).json(err);
        }

        res.json({ msg: 'Usuario registrado' });
    });
};

// 🟢 LOGIN
const login = (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'No existe' });
        }

        const user = results[0];

        if (user.intentos >= 5) {
            return res.status(403).json({ msg: 'Cuenta bloqueada' });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            db.query(
                "UPDATE users SET intentos = intentos + 1 WHERE id = ?",
                [user.id]
            );
            return res.status(401).json({ msg: 'Incorrecto' });
        }

        // reset intentos
        db.query(
            "UPDATE users SET intentos = 0 WHERE id = ?",
            [user.id]
        );

        const code = Math.floor(100000 + Math.random() * 900000);

        // 🔥 LIMPIAR CÓDIGOS VIEJOS
        mfaCodes = mfaCodes.filter(c => c.userId !== user.id);

        // 🔥 GUARDAR NUEVO
        mfaCodes.push({
            userId: user.id,
            code,
            expires: Date.now() + MFA_EXPIRATION,
            attempts: 0
        });

        console.log("MFA CODE:", code);

        res.json({ msg: 'Código MFA enviado' });
    });
};

// 🟢 VERIFY MFA
const verifyMFA = (req, res) => {
    const { email, code } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'No existe' });
        }

        const user = results[0];

        const mfa = mfaCodes
            .filter(c => c.userId === user.id)
            .sort((a, b) => b.expires - a.expires)[0];

        if (!mfa) return res.status(400).json({ msg: 'No hay MFA' });

        // 🔥 SI EXPIRÓ, LO ELIMINAMOS
        if (Date.now() > mfa.expires) {
            mfaCodes = mfaCodes.filter(c => c.userId !== user.id);
            return res.status(400).json({ msg: 'Código expirado' });
        }

        if (mfa.attempts >= 3) {
            return res.status(403).json({ msg: 'Demasiados intentos MFA' });
        }

        if (mfa.code != code) {
            mfa.attempts++;
            return res.status(401).json({ msg: 'Código incorrecto' });
        }

        const token = jwt.sign(
            { id: user.id, tienda: user.tienda },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 🔥 ELIMINAR MFA DESPUÉS DE USARLO
        mfaCodes = mfaCodes.filter(c => c.userId !== user.id);

        res.json({ token });
    });
};

module.exports = { register, login, verifyMFA };