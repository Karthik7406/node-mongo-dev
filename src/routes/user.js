const express = require("express");

const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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


userRouter.get("/feed", userAuth, async (req, res) => {

    try {
        
    const loggedinUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50: limit;

    let skip = (page-1)*limit

    //find all connection requests send r received by the user
    const connectionRequests = await connectionRequest.find({
        $or: [
            {fromUserId: loggedinUser._id},
            {toUserId: loggedinUser._id}
        ]
    })
    .populate("fromUserId","firstName lastName")
    .populate("toUserId", "firstName lastName")

    const alreadyConnectedUsers = new Set();

    connectionRequests.map((user) => {
        alreadyConnectedUsers.add(user.fromUserId._id.toString());
        alreadyConnectedUsers.add(user.toUserId._id.toString());
    })

    console.log("connected users ", alreadyConnectedUsers);

    const usersToDisplay = await User.find({
        $and: [
            {_id: {$nin: Array.from(alreadyConnectedUsers)}},
            {_id: {$ne: loggedinUser._id}}
        ]
    })
    .skip(skip)
    .limit(limit)
    //console.log("connection request ", connectionRequests);

    res.json(usersToDisplay);
    } catch(err) {
        res.status(400).json({message: "Eror "+ err.message})
    }


})

module.exports = userRouter;