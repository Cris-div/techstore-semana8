const db = require('../models/db');
const { getUserRoles } = require('../middlewares/rbac.middleware');


// 🟢 OBTENER PRODUCTOS
const getProducts = (req, res) => {

    getUserRoles(req.user.id, (err, roles) => {

        if (err) return res.status(500).json(err);

        // Admin y Auditor ven todo
        if (roles.includes('Admin') || roles.includes('Auditor')) {

            db.query("SELECT * FROM products", (err, results) => {
                if (err) return res.status(500).json(err);
                res.json(results);
            });

        } else {
            // otros solo su tienda
            db.query(
                "SELECT * FROM products WHERE tienda = ?",
                [req.user.tienda],
                (err, results) => {
                    if (err) return res.status(500).json(err);
                    res.json(results);
                }
            );
        }
    });
};


// 🟢 CREAR PRODUCTO (MEJORADO)
const createProduct = (req, res) => {

    getUserRoles(req.user.id, (err, roles) => {

        if (err) return res.status(500).json(err);

        const { nombre, precio, stock, categoria, es_premium } = req.body;

        const tienda = req.user.tienda; // 🔥 SIEMPRE DESDE TOKEN

        // ❌ restricciones
        if (roles.includes('Auditor')) {
            return res.status(403).json({ msg: 'Auditor no puede crear' });
        }

        if (roles.includes('Empleado') && es_premium) {
            return res.status(403).json({ msg: 'Empleado no puede crear premium' });
        }

        // ✅ validaciones
        if (!nombre || !precio || !stock) {
            return res.status(400).json({ msg: 'Campos obligatorios' });
        }

        if (precio <= 0 || stock < 0) {
            return res.status(400).json({ msg: 'Datos inválidos' });
        }

        const sql = `
            INSERT INTO products (nombre, precio, stock, categoria, tienda, es_premium, creado_por)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            nombre,
            precio,
            stock,
            categoria,
            tienda,
            es_premium,
            req.user.id
        ], (err, result) => {

            if (err) return res.status(500).json(err);

            console.log(`Usuario ${req.user.id} creó producto`);

            res.json({
                msg: 'Producto creado',
                product: {
                    id: result.insertId,
                    nombre,
                    precio,
                    stock,
                    categoria,
                    tienda,
                    es_premium
                }
            });
        });
    });
};


// 🟢 ACTUALIZAR PRODUCTO
const updateProduct = (req, res) => {

    getUserRoles(req.user.id, (err, roles) => {

        if (err) return res.status(500).json(err);

        db.query(
            "SELECT * FROM products WHERE id = ?",
            [req.params.id],
            (err, results) => {

                if (err) return res.status(500).json(err);

                if (results.length === 0) {
                    return res.status(404).json({ msg: 'No existe' });
                }

                const product = results[0];

                if (!roles.includes('Admin') && product.tienda !== req.user.tienda) {
                    return res.status(403).json({ msg: 'No permitido' });
                }

                if (roles.includes('Empleado')) {
                    if (!('stock' in req.body) || Object.keys(req.body).length > 1) {
                        return res.status(403).json({ msg: 'Empleado solo stock' });
                    }
                }

                if (roles.includes('Gerente') && 'categoria' in req.body) {
                    return res.status(403).json({ msg: 'Gerente no cambia categoría' });
                }

                const fields = Object.keys(req.body)
                    .map(key => `${key} = ?`)
                    .join(', ');

                const values = Object.values(req.body);

                const sqlUpdate = `UPDATE products SET ${fields} WHERE id = ?`;

                db.query(sqlUpdate, [...values, req.params.id], (err) => {
                    if (err) return res.status(500).json(err);

                    console.log(`Usuario ${req.user.id} actualizó producto`);

                    res.json({ msg: 'Producto actualizado' });
                });

            }
        );
    });
};


// 🟢 ELIMINAR PRODUCTO
const deleteProduct = (req, res) => {

    getUserRoles(req.user.id, (err, roles) => {

        if (err) return res.status(500).json(err);

        db.query(
            "SELECT * FROM products WHERE id = ?",
            [req.params.id],
            (err, results) => {

                if (err) return res.status(500).json(err);

                if (results.length === 0) {
                    return res.status(404).json({ msg: 'No existe' });
                }

                const product = results[0];

                if (roles.includes('Empleado') || roles.includes('Auditor')) {
                    return res.status(403).json({ msg: 'No permitido' });
                }

                if (roles.includes('Gerente') && product.es_premium) {
                    return res.status(403).json({ msg: 'No puede eliminar premium' });
                }

                db.query(
                    "DELETE FROM products WHERE id = ?",
                    [req.params.id],
                    (err) => {
                        if (err) return res.status(500).json(err);

                        console.log(`Usuario ${req.user.id} eliminó producto`);

                        res.json({ msg: 'Eliminado' });
                    }
                );
            }
        );
    });
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};