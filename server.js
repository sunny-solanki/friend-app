const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socket = require("socket.io");
const userRouter = require("./routes/userRoutes");
const socketIo = require("./socket");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socket(server, { 
      cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      }
    });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  })

  socketIo(io);

app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5004;

server.listen(PORT, console.log("Server running on port", PORT));




