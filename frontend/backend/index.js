const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/roles', require('./routes/role.routes'));
app.use('/products', require('./routes/product.routes'));

app.listen(3000, () => console.log("Servidor en 3000"));