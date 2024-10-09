const express = require("express");

const app = express(); // we are creating a express js application, creating a new web server




app.use("/", (req, res, next) => {

    console.log("Handling route /");
    next();
})


app.get(
    "/users", 
    (req, res, next) => {
        console.log("Handling route /users");
        next();
    },
    (req, res, next) => {
        console.log("1st handler");
        //res.send("1st route handler");
        next();
    },

    (req, res, next) => {
        console.log("2nd route handler");
        res.send("2nd route handler");
    }

)

/*

app.use(
    "/user", [
    (req, res, next) => {
        console.log("handler 1");
       
        next()
        console.log("executing after handler");
        //res.send("Response1")
    },
    (req, res, next) => {
        console.log("handler 2");
        //res.send("Response 2")
        next();
    }]
)


*/



// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user!!");
//     next();
// });
// app.get("/user2", (req, res) => {
//     console.log("handling user2 api call");
// })
// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user 2!!");
// //    res.send("2nd route handler");
//    next();
// })


app.listen(7777, () => {
    // this callback will only be called if the server is started successfully
    console.log("Server is successfully listening on port 7777");
});// we will create a server in port 3000





