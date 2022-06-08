const net = require("net");
const port = 3000;

// This is a TCP server
const server = net.createServer();

let clients = [];

// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
  console.log(
    `Server listening for connection requests on socket localhost:${port}`
  );
});

const sendDataToOtherClients = (client, data) => {
  clients
    .filter((c) => c !== client)
    .forEach((c) => {
      c.write(c.remoteAddress + ":" + c.remotePort + " said " + data + "\n");
    });
};

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on("connection", function (client) {
  console.log("CONNECTED: " + client.remoteAddress + ":" + client.remotePort);
  clients.push(client);
  sendDataToOtherClients(
    client,
    `A new client joined from ${client.remoteAddress} + : + ${client.remotePort}`
  );

  client.on("data", function (data) {
    console.log("DATA " + client.remoteAddress + ": " + data);
    sendDataToOtherClients(client, data);
  });

  // Add a 'close' event handler to this instance of socket
  client.on("close", function (data) {
    let index = clients.findIndex(function (o) {
      return (
        o.remoteAddress === client.remoteAddress &&
        o.remotePort === client.remotePort
      );
    });
    if (index !== -1) clients.splice(index, 1);
    console.log("CLOSED: " + client.remoteAddress + " " + client.remotePort);
  });
});
