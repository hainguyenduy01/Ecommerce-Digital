const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
	products: [
		{
			product: { type: mongoose.Types.ObjectID, ref: 'Product' },
			count: Number,
			color: String,
		},
	],
	status: {
		type: String,
		default: 'Đang xử lý',
		enum: ['Đang xử lý', 'Đã xác nhận', 'Đã hủy'],
	},
	paymentIntent: {},
	orderBy: {
		type: mongoose.Types.ObjectID,
		ref: 'User',
	},
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);
