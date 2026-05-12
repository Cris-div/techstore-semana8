const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

router.get('/', verifyToken, getProducts);

router.post('/', verifyToken, createProduct);

router.put('/:id', verifyToken, updateProduct);

router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;