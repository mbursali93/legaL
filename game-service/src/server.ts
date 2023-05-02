import { Server } from "socket.io";
 import cors from "cors"
import SimpleServer from "./sockets/simpleTest";

new SimpleServer(3001, {
    cors: {
        
    }
})

console.log("server is running")


