const express = require("express");
const app = express(); // we are creating a express js application, creating a new web server

const {connectDB} = require("./config/database");

const User = require("./models/user");
const {ValidateSignUpData} = require("./Utils/validations");

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

const {userAuth} = require("./middlewares/auth");

app.use(express.json())
app.use(cookieParser());



app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {

    try {
    //getting user emailID and password
    const {emailID, password} = req.body;

    const user = await User.findOne({emailID});

    if(!user) {
        throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid) {

        const token = jwt.sign({_id: user._id}, "DEVTINDER$790");
        res.cookie("token ", token);    
        res.send("login successful");
    } else {
        
        throw new Error("Invalid Credentials");
    }

} catch(err) {
    res.status(400).send("Error "+ err.message);
}

})


//Getting the details of the Profile
app.get("/profile", userAuth, async (req, res) => {

    try {
       
        const user = req.user;

        if(!user) {
            throw new Error("Invalid user");
        }
        res.send(user);
    } catch(err) {
        res.status(400).send("Error "+ err.message);
    }
   
})



connectDB()
    .then(() => {
        console.log("Connected to the database");


        // we will create a server in port 7777
        //server will be started only after connecting to the database
        app.listen(7777, () => {
            // this callback will only be called if the server is started successfully
            console.log("Server is successfully listening on port 7777");
        });

    })
    .catch((err)=> {
        console.log("error connecting to the database");

    } )








