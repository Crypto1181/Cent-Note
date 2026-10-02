const express = require ("express")
const dotenv = require ("dotenv")
const app = express()
dotenv.config()

const mongoose = require("mongoose")
const UserRoute = require("./routes/user.route")
const TransactionRoute = require("./routes/transaction.route")


app.use(express.json())
app.use("/api/v1", UserRoute)
app.use("/api/v1/transactions", TransactionRoute)

let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(process.env.DB_URI);
        isConnected = true;
        console.log("DB connected successfully");
    } catch (err) {
        console.log(err, "cannot connect to DB");
    }
};

if (require.main === module) {
    connectDB();
}if (require.main === module) {
    let PORT = process.env.PORT

app.listen(PORT, (err) =>{
    if (err) {
    console.log("Cannot start server");
            
    } else {
        console.log(`Server started on PORT ${PORT}`);
        
    }
})
}


module.exports = async (req, res) =>{
    await connectDB()

    return app(req, res)
}