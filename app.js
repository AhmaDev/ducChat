const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const { saveMessageToDataBase } = require("./messages");
const connection = require("./config/db.config");
require("dotenv").config();

const io = new Server(server);

app.use(cors());

app.get("/", (req, res) => {
  res.send({
    title: "DUC Chat System",
    version: "1.0.0",
  });
});

app.get("/messages/:id", (req, res) => {
  connection.query(
    `SELECT * FROM message WHERE roomName = ? ORDER BY idMessage DESC LIMIT 20`,
    [req.params.id],
    (err, result) => {
      res.send(result.reverse());
    },
  );
});

io.on("connection", (socket) => {
  var room = socket.handshake.query;
  console.log("CONNECTED", socket.id);
  socket.join(`ROOM_${room.sectionId}_${room.level}_${room.class}`);
  socket.on("send", (data) => {
    let roomName = `ROOM_${data.sectionId}_${data.level}_${data.class}`;
    saveMessageToDataBase(data, roomName);
    io.to(roomName).emit("recieveMessage", data.message);
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening on *:" + process.env.PORT);
});
