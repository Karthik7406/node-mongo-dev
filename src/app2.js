const express = require("express");
const app = express(); // we are creating a express js application, creating a new web server

const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json())
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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








