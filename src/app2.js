const express = require("express");

const app = express(); // we are creating a express js application, creating a new web server

const {connectDB} = require("./config/database");

const User = require("./models/user");

app.use(express.json())


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
app.patch("/user", async (req, res) => {

    //const userId = req.body?.userId;
    const emailID = req.body?.emailID;
    
    

    try {

        const user = await User.findOne({emailID: emailID});
        let userId = user._id;
        const response = await User.findByIdAndUpdate(userId, req.body, {
            new:true,
            lean:true,
            select: {
                _id:0,
                firstName:1,
                lastName:1,
                emailID:1,
                password:1
            }

        });
        console.log("response after updating ", response);

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

    const user = new User(req.body);

    try {
        const response = await user.save();
        console.log("response in creating => ", response);
        res.send("User created successfully");
    } catch(err) {
        res.status(400).send("Error in saving the user" + err.message);
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








