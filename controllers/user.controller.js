const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model");

const app = express()




const registerUser = async (req, res) => {
    const {firstname, lastname, email, password} = req.body
    try {
        const saltround = await bcrypt.genSalt(10)
        const hashPassword= await bcrypt.hash(password, saltround)

        const user = await UserModel.create({firstname, lastname, email, password: hashPassword});

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "2h", algorithm: "HS256"})


        res.status(201).send({
            message: 'User Created Successfully',
            data: {
                firstname,
                lastname,
                email,
                token,
                balance:user.balance
            }

        })
    } catch (error) {
        
        if (error.code === 11000) {
            res.status(400).send({
                message: "Email or tag already exist"
            })
        } else {
            res.status(400).send({
                message: "User cannot be created at this time"
            })
        }
    }
}

const loginUser = async (req, res) => {
    
    try {
        const {email, password} = req.body
        const isUser = await UserModel.findOne({ email }).select("+password")
        
        if(!isUser) {
            res.status(400).send({
                message: "Account does not exist"

            })

            return;
        }

        const isMatchUser = await bcrypt.compare(password, isUser.password)

        if(!isMatchUser) {
            res.status(400).send({
                message: "Invalid Details"
            })
            return;
        }

        const token = jwt.sign({id: isUser._id, role: isUser.role}, process.env.JWT_SECRET, {expiresIn: "2h", algorithm: "HS256"})

        res.status(200).send({
            message: "Login Successful",
            data: {
                firstname: isUser.firstname,
                lastname: isUser.lastname,
                email: isUser.email,
                token,
                balance: isUser.balance
            }
        })
    } catch (error) {
        res.status(400).send({
            message: "Invalid Details"
        })
        
    }
}


const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            message: "User profile fetched successfully",
            data: user
        });
    } catch (err) {
        res.status(400).send({
            message: "Cannot fetch profile at this time"
        });
    }
}

const verify = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1] ? req.headers["authorization"].split(" ")[1] : req.headers["authorization"].split(" ")[0];

        const user = await jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send({
                    message: "User unauthorized"
                })
                return;
            }

            req.user = decoded
            console.log(decoded);

            next()
        });
    } catch (error) {
        console.log(error);

        res.status(401).send({
            message: "User unauthorized"
        })
        return;

    }
}
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname } = req.body;
        
        let updateData = { firstname, lastname };
        
        if (req.file && req.file.path) {
            updateData.profileImage = req.file.path;
        }
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        
        res.status(200).send({
            message: "Profile updated successfully",
            data: {
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage,
                balance: updatedUser.balance
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    verify,
    updateProfile
}