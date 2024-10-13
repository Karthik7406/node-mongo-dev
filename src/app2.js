const express = require("express");

const app = express(); // we are creating a express js application, creating a new web server

const {connectDB} = require("./config/database");

const User = require("./models/user");



app.post("/signup", async (req, res) => {

    const userobj = {
        firstName: "virat",
        lastName: 123,
        emailID: "virat@kohli.com",
        password:"virat@1234",
       
    };

    const user = new User(userobj);

    try {
        await user.save();
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








