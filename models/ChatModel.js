const mongoose = require("mongoose");
const bcrypt = require('bcrypt.js');

const messageSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Group",
    },
  },
    {
      timestamps: true, 
    }
  );

  const Message = mongoose.model("Message", messageSchema);
  module.exports = Message;  
  