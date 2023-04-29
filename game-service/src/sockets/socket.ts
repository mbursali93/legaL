// sockets/index.ts

import { Server, Socket } from "socket.io";


export class SocketServer {
  private io: Server;

  constructor(port:number, options: object) {
    this.io = new Server(port, options);

    this.io.on("connection", (socket: Socket) => {
      console.log(`User ${socket.id} connected`);

      socket.on("test", () => {
        console.log(`test`);
      });

      socket.on("test1", (message: any) => {
        console.log(`Received message: test`);

        this.io.emit("message", message);
      });
    });
  }
}
