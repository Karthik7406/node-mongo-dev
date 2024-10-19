const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        status: {
            type: String,
            enum: {
                values: ["ignore", "interested", "rejected", "accepted"],
                message: '{VALUE} is not supported'
            },
            required: true
        }
    },
    {
        timestamps: true
    }
);

//compound index
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function(next) {

    console.log("executing pre method");
    const connection = this;

    if(this.fromUserId.equals(this.toUserId)) {
        throw new Error("cannot send connection to yourself");
    }

    next();
})
const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequest;

