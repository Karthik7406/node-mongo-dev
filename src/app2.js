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


// find a user from the database

app.get("/user", async (req, res) => {

    const userEmail = req.body?.emailID;
    console.log(userEmail);

    try {
        //const user = await User.find({emailID: userEmail});
        // const user = await User.findOne({emailID: userEmail});
        const user = await User.findOne();
        // if(user.length === 0) {
        //     res.status(404).send("User not found");
        // } else {
        //     res.send(user);
        // }

        if(!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
       
    } catch(err) {
        res.status(500).send("Something went wrong "+ err.message);
    }
})


app.delete("/user", async (req, res) => {
    const userId = req.body?.userId;

    try {
        //const response = await User.findByIdAndDelete({_id: userId});
        const response = await User.deleteMany({});
        console.log("Response ", response);
        if(!response) {
            res.status(404).send("User not found");
        } else {
            res.send("user deleted successfully");
        }
        
        
    } catch(err) {
        res.status(500).send("Error "+ err.message);
    }
})


app.get("/feed", async (req, res) => {
    console.log("calling feed api");

    try {
        const users = await User.find({});
        console.log("users", users);
        res.send(users);
    } catch(err) {
        res.status(500).send("Something went wrong "+ err.message);
    }
})

//updating the data of the user
// app.patch("/user", async (req, res) => {

//     //const userId = req.body?.userId;
//     const emailID = req.body?.emailID;
//     try {

//         const user = await User.findOne({emailID: emailID});
//         let userId = user._id;
//         const response = await User.findByIdAndUpdate(userId, req.body, {
//             new:true,
//             lean:true,
//             runValidators:true,
//             select: {
//                 _id:0,
//                 firstName:1,
//                 lastName:1,
//                 emailID:1,
//                 password:1
//             }

//         });
//         console.log("response after updating ", response);

//         if(!response) {
//             res.status(404).send("User not found");
//         } else {
//             res.send(response);
//         }
        
        
//     } catch(err) {
//         res.status(500).send("Something went wrong " + err.message);
//     }
// })


app.patch("/user/:userId", async (req, res) => {

    const userId = req.params?.userId;
    console.log("userId", userId);
    var data = req.body;


    try {

        // const user = await User.findOne({emailID: emailID});
        // let userId = user._id;

        const ALLOWED_UPDATES = ["userId","password","age","gender","photoUrl","about","skills"];

        //every key present in req.body should be allowed to update
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key)); 

        if(!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        let skills = req.body?.skills;
        if(skills) {
            //remove duplicate
            let unique_array = skills.reduce(function(acc, val) {
                if(!acc.includes(val)) {
                    acc.push(val);
                }
                return acc;
            }, []);

            if(unique_array.length > 10) {
                throw new Error("Skills cannot exceed 10");
            }

            data.skills = unique_array;
        }

        const response = await User.findByIdAndUpdate(userId, data, {
            new:true,
            runValidators:true,
        });
        
        if(!response) {
            res.status(404).send("User not found");
        } else {
            res.send(response);
        }
        
    } catch(err) {
        res.status(500).send("Something went wrong " + err.message);
    }
})


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








