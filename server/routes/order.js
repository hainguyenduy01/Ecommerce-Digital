const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifToken');
const ctrls = require('../controllers/order');

router.get('/', verifyAccessToken, ctrls.getUserOrder);
router.get('/admin', verifyAccessToken, isAdmin, ctrls.getOrders);
router.post('/', verifyAccessToken, ctrls.createOrder);
router.put('/status/:oid', verifyAccessToken, isAdmin, ctrls.updateStatus);

module.exports = router;
