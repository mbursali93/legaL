import { Server } from "socket.io";
 import cors from "cors"
import { SocketServer } from "./sockets/socket";

new SocketServer(3001, {
    cors: {
        
    }
})



