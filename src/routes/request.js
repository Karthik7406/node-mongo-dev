const express = require("express");
const connectionRouter = express.Router();


const {userAuth} = require("../middlewares/auth");

const User = require("../models/user");

const ConnectionRequest = require("../models/connectionRequest");

//send connection request
connectionRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user._id; //user is already logged in

        const toUserId = req.params.toUserId;
        const status = req.params.status;
    
        const allowed_status = ["interested","ignore"];
    
        if(!allowed_status.includes(status)) {
            return res.status(400).json({message: "invalid status "});
        }

        //check if connectionr request already present in the database

        const existingConnection = await ConnectionRequest.findOne(
            {
                $or:[
                    {fromUserId, toUserId},
                    {fromUserId: toUserId, toUserId: fromUserId}
                ]
            }
        );

        if(existingConnection) {
            return res.status(400).json({message: "connection request already exists"});
        }
        
        //user sends requests to self

        if(fromUserId == toUserId) {
            return res.status(400).json({message: "Cannot send request to yourself"});
        }
        
        //validate toUserId
        const toUser = await User.findById(toUserId);
        
        if(!toUser) {
            throw new Error("User doesnot exists");
        }
        
        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await connectionRequest.save();

        res.json({
                message: "Connection sent successfully",
                data
                });


    } catch(err) {
        res.status(400).send("ERROR: "+ err.message);
    }

   
})

//accepting the connection request

connectionRouter.post("/request/review/:status/:requestID", userAuth, async (req, res) => {

    const {status, requestID} = req.params;
    const loggedInUser = req.user;

    const allowed_status = [ "accepted", "rejected"];

    if(!allowed_status.includes(status)) {
        return res.status(400).json({message: "status not allowed"});
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserId: loggedInUser._id,
        status: "interested"
    });

    if(!connectionRequest) {
        return res.status(404).json({message: "connection request doesnot exist"});
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({message: `connection request ${status}`, data});

})


module.exports = connectionRouter;