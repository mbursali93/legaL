import { Server, Socket } from "socket.io";
import CardLogic from "../game/cardLogics";
import Deck from "../game/decks";

const deck = new Deck(1).createDeck(1)
const game = new CardLogic(deck)

const rooms = ["room1"]

class SimpleServer {
  private io: Server;
  private gameStarted: boolean = false;
  

  constructor(port:number, options: object) {
    this.io = new Server(port, options);

    this.io.on("connection", (socket: Socket) => {
      console.log(`${socket.id} connected`)
      let room:any;
      let roomUsers:any[] = [];
      let player1;
      let player2;
      let readyPlayers:any[] = []
      let roomReady: any;
      
     socket.on("kirmasti-join", (roomId:string)=> {
      
      socket.join("room1")
      console.log(`${socket.id} joined`)
       
     room = this.io.sockets.adapter.rooms.get(roomId);
    roomUsers = room ? [...room] : [];
     
      // where game starts

     if(roomUsers.length === 2 && !this.gameStarted) {
        this.gameStarted = true;
         player1 = game.dealCards(1)
         player2 = game.dealCards(1)
        console.log("game starts")
        this.io.to("room1").emit("kirmasti-dealCards", [player1, player2])
        
        
      }
     })

     // players bet

     socket.on("kirmasti-bet", (data)=> {
      
        if(roomUsers.includes(socket.id)) socket.join("room1ready")
        roomReady = this.io.sockets.adapter.rooms.get("room1ready")
        readyPlayers = roomReady ? [...roomReady] : []
        console.log(readyPlayers)
        console.log(socket.id + " is ready")

      if(readyPlayers.length === 2 ) {
          console.log("everyone is ready")
      }
      
      
      
    })
    });
  }
}

export default SimpleServer
