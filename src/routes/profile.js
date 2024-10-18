const express = require("express");

const profileRouter = express.Router();


const {userAuth} = require("../middlewares/auth");

const {validateEditProfileData, verifyPassword} = require("../Utils/validations");

const validator = require("validator");
const bcrypt = require("bcrypt");
 

//Getting the details of the Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {

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

//updating user profile data
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        const loggedinUser = req.user;
        console.log("logged in user ", loggedinUser);
    
        const isUpdateAllowed = validateEditProfileData(req);

        if(!isUpdateAllowed) {
            throw new Error("Update is not allowed");

        }  

        console.log("request body ", req.body );

        console.log("keys of req.body ", Object.keys(req.body));
        Object.keys(req.body).forEach((key) => {
            loggedinUser[key] = req.body[key];
        })


        console.log("updated data ", loggedinUser);

        await loggedinUser.save();

        let userData = await loggedinUser.getProfileData();

       res.json({
        message: `${loggedinUser.firstName}, your profile updated successfully`,
        data: userData
       })

    } catch(err) {
        res.status(400).send("Error :" + err.message);
    }
   

    



})

//updating the user password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {

    console.log("executing password changing method");

    const {oldPassword, newPassword} = req.body;

    console.log("old password", oldPassword, newPassword);

    try {
        
        const isPasswordValid = await verifyPassword(req); //verify old password is valid

        if(!isPasswordValid) {
            throw new Error("Password is not valid");
        } else {
            //password is valid, update with the new password
            if(validator.isStrongPassword(newPassword)) {
                //generate hash of a new password

                const newPasswordHash = await bcrypt.hash(newPassword, 10);
                req.user['password'] = newPasswordHash;

                await req.user.save(); // save new password to the database;

                res.cookie("token",null,{expires: new Date(Date.now())}); //remove token after changing the password

                res.json({
                    message: "Password updated successfully, please login"
                })
                
            } else {
                throw new Error("Please enter a strong new password");
            }

        }
    } catch(err) {
        res.status(400).send("Error: "+ err.message);
    }
    
})
module.exports = profileRouter;

