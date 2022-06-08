const net = require("net");
const client = new net.Socket();
const port = 3000;
const host = "localhost";
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.connect(port, host, function () {
  console.log("Connected");
  client.write("Hello From Client " + client.address().address);
});

client.on("data", function (data) {
  console.log("<" + data.toString());
});

client.on("close", function () {
  console.log("Connection closed");
});
