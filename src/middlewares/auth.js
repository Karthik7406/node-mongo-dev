const jwt = require("jsonwebtoken");
const User = require("../models/user");


//this function will read the request and verify the user
const userAuth = async (req, res, next) => {

    try {

            const {token} = req.cookies;
            if(!token) {
                throw new Error("Token is invalid");
            }

            const decodedObj = jwt.verify(token, "DEVTINDER$790")
            const {_id} = decodedObj;
            const user = await User.findById(_id);

            if(!user) {
                throw new Error("Invalid user");
            }

            req.user = user; //attaching the user to the request 

            //user is valid, execute the next() request handler/middleware
            next();
    } catch(err) {
        res.status(400).send("Error "+ err.message);
    }
}


module.exports = {
    userAuth
}