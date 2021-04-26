import { Server } from "socket.io";

// Since NextJS is mostly incompatible with WS,
// Deploy to Herouku or non-serverless environment 

const ioHandler = (req, res) => {
  // if server not started, start it up
  if (!res.socket.server.io) {
    console.log("Starting socket.io");

    // create the websocket server
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      //when msg submitted, broadcast it
      socket.on("message-submitted", (msg) => {
        // echo msg back to user
        socket.emit("message", msg);
        // broadcast msg to everyone else
        socket.broadcast.emit("message", msg);
      });
    });
    // make the socket available externally
    res.socket.server.io = io;
  } else {
    console.log("server already running");
  }

  res.end();
}

export default ioHandler;