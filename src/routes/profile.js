const express = require("express");

const profileRouter = express.Router();


const {userAuth} = require("../middlewares/auth");


//Getting the details of the Profile
profileRouter.get("/profile", userAuth, async (req, res) => {

    try {
       
        const user = req.user;

        if(!user) {
            throw new Error("Invalid user");
        }
        res.send(user);
    } catch(err) {
        res.status(400).send("Error "+ err.message);
    }
   
});


module.exports = profileRouter;

