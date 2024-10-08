const express = require("express");

const app = express(); // we are creating a express js application, creating a new web server

app.use("/", (req, res) => {
    res.send("Namaste!");
});
 
app.use("/test", (req, res) => {
    // this function is called as request handler
    res.send("Hello from the server!!!");
});

app.use("/hello", (req,res) => {
    res.send("hello hello hello!!");
});


app.listen(7777, () => {
    // this callback will only be called if the server is started successfully
    console.log("Server is successfully listening on port 7777");
});// we will create a server in port 3000





