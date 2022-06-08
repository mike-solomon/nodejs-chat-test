const socketIOServer = require("socket.io")();
const PORT = process.env.PORT || 3000;
const users = {};

socketIOServer.on("connection", (socket) => {
  console.log("New Connection: " + socket.id);

  let nickname = "Unidentified User";

  socket.on("new user", (name) => {
    users[socket.id] = name;
    nickname = name;

    socket.broadcast.emit("message", `${name} joined the chat.`);
  });

  socket.on("message", (text) => {
    socket.broadcast.emit("message", `${users[socket.id]}< ${text}`);
  });

  socket.on("disconnect", () => {
    console.log(`${nickname} left the chat`);
    socketIOServer.emit("message", `${nickname} left the chat`);
  });
});

socketIOServer.listen(PORT);
