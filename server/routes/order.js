const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifToken');
const ctrls = require('../controllers/order');

router.post('/', verifyAccessToken, ctrls.createOrder);

module.exports = router;
