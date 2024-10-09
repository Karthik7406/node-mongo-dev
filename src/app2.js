const express = require("express");

const app = express(); // we are creating a express js application, creating a new web server


//middleware for all /admin requests and all request types
//should be written at top

const {adminAuth} = require("./middlewares/auth");

// app.use("/admin", (req, res, next) => {

//     console.log("validating the auth of the user");

//     const token = "xyz";
//     const isAdminAuthorised = token === "xyz";

//     if(!isAdminAuthorised) {
//         res.status(401).send("user is not authorised");
//     } else {
//         next();
//     }
// })

app.use("/admin", adminAuth);

app.get("/admin/getUserdetails", (req, res) => {
    res.send("all user details sent");
})

app.get("/admin/deleteUser", (req, res) => {
    res.send("user delete successfully");
})

const {userAuth} = require("./middlewares/auth");

app.get("/user/login", (req, res) => {
    res.send("User loggedin successfully");
});


app.get("/user/data",userAuth, (req, res) => {
    console.log("executing user data handler");
    res.send("user data sent successfully");
} )



























/*
app.get("/admin/getAllData", (req, res) => {

    const token = "xyzabcd";
    const isAdminAuthorised = token === "xyz";

    if(isAdminAuthorised) {
        res.send("All data sent");
    } else {
        res.status(401).send("you are not authorised");
    }
})


app.get("/admin/deleteUser",(req, res) => {
    const token = "xyzabcd";
    const isAdminAuthorised = token === "xyz";

    if(isAdminAuthorised) {
        res.send("Deleted a user");
    } else {
        res.status(401).send("Unauthorised request");
    }
})


*/


app.listen(7777, () => {
    // this callback will only be called if the server is started successfully
    console.log("Server is successfully listening on port 7777");
});
// we will create a server in port 7777





