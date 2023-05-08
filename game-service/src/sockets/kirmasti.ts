import { Server, Socket } from "socket.io";
import { Mutex } from "async-mutex"
import Deck from "../game/decks";
import CardLogic from "../game/cardLogics";

const room = { id: "room-id", smallBet: 10, bigBet: 20, maxPlayer:4 }

const joinMutex = new Mutex()
const betMutex = new Mutex()

class KirmastiServer {
  private io: Server;
  private game: CardLogic;
  private deck: object[];
  private roomPlayers: any[]; // could use number or can be cancelled
  private dealFlag: boolean
  private dealedPlayers: any[];

  constructor(port: number) {
    this.io = new Server(port, { cors: { } })
    this.deck = new Deck(1, 11, 12, 13).createDeck(1)
    this.game = new CardLogic(this.deck)
    this.roomPlayers = []
    this.dealFlag = false;
    this.dealedPlayers = []

    this.io.on("connection", (socket: Socket)=> {
      try {
        console.log(socket.id)

        // Join table
        
        socket.on("kirmasti-join", (data) => {
          joinMutex.runExclusive(() => {
            socket.join("room-id");
            console.log(data);
            console.log("someone joined");
            this.roomPlayers.push({ id: socket.id, hasBet: false, cards: [] });
            console.log(this.roomPlayers);
          });
        });

        

          socket.on("kirmasti-deal", ()=> {
            if(this.roomPlayers.length > 1 && !this.dealFlag) {
              console.log(`${socket.id} is ready`)
              
                this.dealedPlayers.push({ id: socket.id, hasBet: false, cards: [] })

                // cards dealing for each player
                // money bet
            
              setTimeout(()=> {
                if(!this.dealFlag) {
                  for(let i = 0; i < this.roomPlayers.length; i++) {
                    this.dealedPlayers[i].cards = this.game.dealCards(2)
                    
                  }
                  if(this.dealedPlayers.length === 1) return this.io.to("room-id").emit("kirmasti-setWinner") // handle later
                  this.io.to("room-id").emit("kirmasti-getCards", this.dealedPlayers)
                  this.dealFlag = true;
                }
              }, 10000)
            }
          })

          socket.on("kirmasti-bet", (decision)=> {
            betMutex.runExclusive(()=> {
              if(this.dealFlag && this.dealedPlayers.length > 1) {
                let playerIndex = this.dealedPlayers.findIndex(p=> p.id === socket.id)
                this.dealedPlayers[playerIndex].hasBet = true
              }
            })

          })

          //end of the event

      } catch {

      }
    })
  }
}

export default KirmastiServer;