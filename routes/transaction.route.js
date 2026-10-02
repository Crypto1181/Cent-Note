const express = require("express");
const { addTransaction, getTransactionHistory, resetTransactions } = require("../controllers/transaction.controller");
const { verify } = require("../controllers/user.controller");

const router = express.Router();

router.post("/add", verify, addTransaction);
router.get("/history", verify, getTransactionHistory);
router.delete("/reset", verify, resetTransactions);

module.exports = router;
