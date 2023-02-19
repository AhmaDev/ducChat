var connection = require("./config/db.config");

exports.saveMessageToDataBase = (message, roomName) => {
  connection.query(
    `INSERT INTO message (messageContent,userName,createdBy,messageTypeId,ipAddress, roomName, isAdmin) VALUES (?,?,?,?,?,?,?)`,
    [
      message.message.text,
      message.userInfo.userName,
      message.userInfo.idUser,
      1,
      "10.0.0.1",
      roomName,
      message.message.isAdmin,
    ],
    (err, res) => {
      console.log(err);
    },
  );
};
