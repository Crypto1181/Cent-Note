const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true }
}, { timestamps: true, strict: 'throw' });

const TransactionModel = mongoose.model('transaction', TransactionSchema);

module.exports = TransactionModel;
