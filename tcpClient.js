const net = require("net");
const client = new net.Socket();
const port = 3000;
const host = "localhost";

client.connect(port, host, function () {
  console.log("Connected");
  client.write("Hello From Client " + client.address().address);
});

client.on("data", function (data) {
  console.log("Server Says : " + data);
});

client.on("close", function () {
  console.log("Connection closed");
});
