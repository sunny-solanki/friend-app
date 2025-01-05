const express = require("express");
const Group = require("../models/GroupModel");
const {protect, isAdmin} = require("../middleware/authmiddleware");

const groupRouter = express.Router();

groupRouter.post("/", protect, isAdmin, async (req, res) => {
  try{
    const { name, description } = req.body;
    const group = await Group.create({ 
        name, 
        description,
        admin: req.user._id,
        members: [req_user._id],
    });
    const populatedGroup =   await Group.findById(group_id)
       .populate("admin", "username email")
       .populate("members", "username email");
    res.status(201).json({populatedGroup});
  } catch (err) {
    res.status(400).json(err);
  }
});

groupRouter.get("/", protect, async (req, res) => {
  try{
    const groups = await Group.find().populate("admin", "username email").populate("members", "username email");
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json(error);
  }
})

groupRouter.post("/:groupId/join", protect, async (req, res) => {
  try{
    const group = await Group.findById(req.params.groupId);
    console.log(group);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member", 
      });
    }
    group.members.push(req.user._id);
    await group.save();
    res.status(200).json({ message: "User added to group" });
  }
  catch(error) {
    res.status(400).json(error);
  }
});
module.exports = groupRouter;