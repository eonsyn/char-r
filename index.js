const http = require("http");
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const socketIO = require("socket.io");

const app = express();
const port = 2000|| process.env.PORT;
const server = http.createServer(app);

const users = [{}];

app.get("/", (req, res) => {
  res.send("hello this is working test ");
});
app.use(cors());
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("joined", ({ username }) => {
    users[socket.id] = username;
    console.log(username, "is connected");

    socket.broadcast.emit("joineduser", {
      user: users[socket.id],
      message: "has joined",
    });
    socket.emit("welcome", { user: "Admin", message: "welcome to the chat." });
  });

  socket.on("message", (message) => {
    const id = socket.id;

    io.emit("sendMessage", { user: users[socket.id], message, id });
  });

  socket.on("disconnect", (reason, details) => {
    console.log(users[socket.id], "left the chat");
    socket.broadcast.emit("leave", {
      user: users[socket.id],
      message: "left",
    });
  });
});

server.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
