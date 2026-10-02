const TransactionModel = require("../models/transaction.model");
const UserModel = require("../models/user.model");

const addTransaction = async (req, res) => {
    try {
        const { title, amount, type, category } = req.body;
        const userId = req.user.id;

        if (!title || !amount || !type || !category) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const transaction = await TransactionModel.create({
            user: userId,
            title,
            amount: Number(amount),
            type,
            category
        });

        const user = await UserModel.findById(userId);
        if (type === 'income') {
            user.balance += Number(amount);
        } else if (type === 'expense') {
            user.balance -= Number(amount);
        }
        await user.save();

        res.status(201).send({
            message: "Transaction added successfully",
            data: { transaction, newBalance: user.balance }
        });
    } catch (error) {
        res.status(400).send({ message: "Could not add transaction" });
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query;

        let query = { user: userId };

        // Optional filtering by month and year (e.g. ?month=9&year=2026)
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const transactions = await TransactionModel.find(query).sort({ createdAt: -1 });

        res.status(200).send({
            message: "Transactions fetched successfully",
            data: transactions
        });
    } catch (error) {
        res.status(400).send({ message: "Could not fetch transactions" });
    }
};

const resetTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        await TransactionModel.deleteMany({ user: userId });

        const user = await UserModel.findById(userId);
        user.balance = 0;
        await user.save();

        res.status(200).send({
            message: "All transactions and balance reset successfully",
            data: { newBalance: 0 }
        });
    } catch (error) {
        res.status(400).send({ message: "Could not reset transactions" });
    }
};

module.exports = {
    addTransaction,
    getTransactionHistory,
    resetTransactions
};
