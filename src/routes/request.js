const express = require("express");
const connectionRouter = express.Router();


const {userAuth} = require("../middlewares/auth");

//send connection request
connectionRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {

    const user = req.user;
    res.send(`${user.firstName} send a connection request`);
})


module.exports = connectionRouter;