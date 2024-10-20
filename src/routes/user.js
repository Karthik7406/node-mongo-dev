const express = require("express");

const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

//find all the pending connection requests for the loggedin User
userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    const loggedinUser = req.user;
    console.log("loggedin user ", loggedinUser);

    const connectionRequests = await connectionRequest.find(
        {
            toUserId: loggedinUser._id,
            status:"interested"
        }
    ).populate("fromUserId", ["firstName", "lastName", "about", "skills"]);

    res.json({
        message: "data fetched successfully",
      connectionRequests
    })
})

const SAFE_USER_FIELDS = ["firstName", "lastName", "about", "skills"];

userRouter.get("/user/connections", userAuth, async (req, res) => {

    const loggedinUser = req.user;
    try {
        const connectedUsers = await connectionRequest.find(
            {
                $or:[
                    {fromUserId: loggedinUser._id, status: "accepted"},
                    {toUserId: loggedinUser._id, status: "accepted"}
                ]
            }
        )
        .populate("fromUserId", SAFE_USER_FIELDS)
        .populate("toUserId", SAFE_USER_FIELDS)

        let data = connectedUsers.map(row => {
            if(row.fromUserId._id.toString() === loggedinUser._id.toString()) {
                console.log("inside if condition");
                return row.toUserId;
            } else {
                console.log("inside else condition");
                return row.fromUserId;
            }
           
        })
    
        res.json(data);
    } catch(err) {
        res.status(400).send("Error " + err.message);
    }
   
})

module.exports = userRouter;