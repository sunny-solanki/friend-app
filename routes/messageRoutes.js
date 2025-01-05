const express = require("express");
const Message = require("../models/ChatModel");
const { protect } = require("../middleware/authmiddleware");

const messageRouter = express.Router();

messageRouter.post("/", protect, async (req, res) => {
    try {
        const { content, groupId } = req.body;
        const message = await Message.create({
            content,
            sender: req.user._id,
            group: groupId,
        });
        const populatedMessage = await Message.findById(message._id).populate(
            "sender",
            "username email"
        );
        res.json(populatedMessage)
        }
     catch (error) {
        res.status(400).json({message: error.Message});
    }
});

messageRouter.get("/:groupId", protect, async (req, res) => {
    try {
        const messages = await Message.find({ group: req.params.groupId })
            .populate("sender", "username email")
            .sort({ createdAt: 1});
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.Message });
    }
});

module.exports = messageRouter;