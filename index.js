const app = require("express")();
const httpServer = require("http").Server(app);
const socketIOServer = require("socket.io")(httpServer);
const port = process.env.PORT || 3000;
const { Trie } = require("@datastructures-js/trie");

const badwordDictionary = new Trie();

const setupBadWords = () => {
  badwordDictionary.insert("hi");
};

setupBadWords();

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// Whenever someone connects this gets executed
socketIOServer.on("connection", (socket) => {
  let nickname = "user" + getRandomInt(1, 10000);

  console.log("A user connected!");
  console.log("Number of active clients:", socketIOServer.engine.clientsCount);
  socketIOServer.emit("new user", nickname);
  socketIOServer.emit("chat message", `${nickname} joined the chat`);

  socket.on("change nickname", (newNickname) => {
    console.log(
      `User ${nickname} requested nickname change to: ${newNickname}`
    );
    socketIOServer.emit("change nickname", nickname, newNickname);
    socketIOServer.emit(
      "chat message",
      `${nickname} changed their name to ${newNickname}`
    );
    nickname = newNickname;
  });

  socket.on("disconnect", () => {
    console.log(`${nickname} left the chat`);
    socketIOServer.emit("chat message", `${nickname} left the chat`);
    socketIOServer.emit("user disconnected", nickname);
  });

  socket.on("chat message", (msg) => {
    console.log("Received message:", msg);

    let finalMsg = "";
    let splitStr = msg.split(" ");
    console.log(`splitStr: ${splitStr}`);

    for (let i = 0; i < splitStr.length; i++) {
      let s = splitStr[i];
      console.log(`str = ${s}`);

      if (badwordDictionary.has(s)) {
        console.log(`Woah we found a bad word! It was ${s}. Changing message`);
        finalMsg += " ***";
      } else {
        finalMsg += ` ${s}`;
      }

      console.log(`finalMsg: ${finalMsg}`);
    }

    socketIOServer.emit("chat message", `${nickname}: ${finalMsg}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
