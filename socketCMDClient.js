const io = require("socket.io-client");
const socket = io("http://localhost:3000");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let alreadyConnected = false;

rl.question("What is your name?\n", (name) => {
  // Sending users name to server
  socket.emit("new user", name.trim());
  console.log("You joined the chat");
  process.stdout.write("> ");
});

socket.on("message", (text) => {
  // Erasing Last line
  // process.stdout.write("\r\x1b[K");
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(text);
  process.stdout.write("> ");
});

socket.on("connect", () => {
  if (alreadyConnected) {
    console.log("Server connection re-established.");
  }
});

socket.on("disconnect", () => {
  alreadyConnected = true;
  console.log("Server connection lost. Please wait.");
});

rl.prompt();

rl.on("line", (text) => {
  // Sending message to our server.
  socket.emit("message", text.trim());
  process.stdout.write("> ");
  rl.prompt();
});
