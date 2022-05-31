const app = require("express")();
const httpServer = require("http").Server(app);
const socketIOServer = require("socket.io")(httpServer);
const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

// Whenever someone connects this gets executed
socketIOServer.on("connection", (socket) => {
  console.log("A user connected!");
  console.log("Number of active clients:", socketIOServer.engine.clientsCount);

  socket.on("new user", (data) => {
    socket.userId = data;
    console.log(`data: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("Received message:", msg);
    socketIOServer.emit("chat message", msg);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
