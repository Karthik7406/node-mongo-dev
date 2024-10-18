const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const {ValidateSignUpData} = require("../Utils/validations");


const authRouter = express.Router();


//signup API
authRouter.post("/signup", async (req, res) => {

    try {
        // Validation of data
        ValidateSignUpData(req);

        //Encrypt the password
        const {firstName, lastName, emailID, password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName,
            lastName,
            emailID,
            password: passwordHash
        });

        await user.save();
        res.send("User saved successfully to the database");
    } catch(err) {
        res.status(400).send("Error "+ err.message);
    }

})

//Login API
authRouter.post("/login", async (req, res) => {

    try {
    //getting user emailID and password
    const {emailID, password} = req.body;

    const user = await User.findOne({emailID});

    if(!user) {
        throw new Error("Invalid Credentials");
    }

    //const isPasswordValid = await bcrypt.compare(password, user.password);
    
    //using Schema method to validate the user
    const isPasswordValid = await user.validateUser(password);

    if(isPasswordValid) {

        //const token = jwt.sign({_id: user._id}, "DEVTINDER$790", {expiresIn: "1d"});
        // const options =  {
        //     expires: new Date(Date.now() + 5000)
        //  };

        //using schema methods
        const token = await user.getJWT();

        res.cookie("token ", token);    
        res.send("login successful");
    } else {
        
        throw new Error("Invalid Credentials");
    }

} catch(err) {
    res.status(400).send("Error "+ err.message);
}

})

//logout API
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });

    res.send("logged out successfully");
})


module.exports = authRouter;