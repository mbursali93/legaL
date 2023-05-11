import { Server, Socket } from "socket.io";
import { Mutex } from "async-mutex"
import Deck from "../game/decks";
import CardLogic from "../game/cardLogics";

const room = { id: "room-id", smallBet: 10, bigBet: 20, maxPlayer:4 }
interface ICard { value: string, suit: string, point: number}

const joinMutex = new Mutex()
const betMutex = new Mutex()

class KirmastiServer {
  private io: Server;
  private game: CardLogic;
  private deck: object[];
  private roomPlayers: any[]; // could use number or can be cancelled
  private dealFlag: boolean;
  private betFlag: boolean;
  private dealedPlayers: any[];
  private winnerPlayers: any[]

  constructor(port: number) {
    this.io = new Server(port, { cors: { } })
    this.deck = new Deck(1, 11, 12, 13).createDeck(1)
    this.game = new CardLogic(this.deck)
    this.roomPlayers = []
    this.dealFlag = false;
    this.betFlag = false;
    this.dealedPlayers = []
    this.winnerPlayers = []

    this.io.on("connection", (socket: Socket)=> {
      try {
        
        // Join table
        
        socket.on("kirmasti-join", (data) => {
          joinMutex.runExclusive(() => {
            socket.join("room-id");
           
            this.roomPlayers.push({ id: socket.id, hasBet: false, cards: [] });
            
          });
        });

        

          socket.on("kirmasti-deal", ()=> {
            if(this.roomPlayers.length > 1 && !this.dealFlag) {
              console.log(`${socket.id} is ready`)
              
                this.dealedPlayers.push({ id: socket.id, hasBet: false, cards: [] })

            
              setTimeout(()=> {
                if(!this.dealFlag) {
                  for(let i = 0; i < this.roomPlayers.length; i++) {
                    this.dealedPlayers[i].cards = this.game.dealCards(2)
                    
                    
                  }
                  // if(this.dealedPlayers.length === 1) return this.io.to("room-id").emit("kirmasti-setWinner") // handle later
                  
                  this.io.to("room-id").emit("kirmasti-getCards", this.dealedPlayers)
                  this.dealFlag = true;
                  this.betFlag = false;
                }
              }, 10000)
            }
          })

          socket.on("kirmasti-bet", (decision)=> {
            betMutex.runExclusive(()=> {
              if(this.dealFlag && this.dealedPlayers.length > 1) {
                let playerIndex = this.dealedPlayers.findIndex(p=> p.id === socket.id)
                this.dealedPlayers[playerIndex].hasBet = true
                console.log(`${socket.id} has bet`)
              }

              setTimeout(()=> {
                if(!this.betFlag) {
                  const middleCard:any = this.game.pickCard()
                  console.log(middleCard)
                  
                  for(const player of this.dealedPlayers) {
                    if(player.hasBet) {
                      let playerSortedCards = player.cards.sort((a:ICard, b:ICard)=> a.point - b.point)
                    
                      if(middleCard.point > playerSortedCards[0].point && middleCard.point < playerSortedCards[1].point) {
                        this.winnerPlayers.push(player)
                       
                      }
                    }
                  }
                }

                if(this.winnerPlayers.length !== 0) {
                  // handle winners
                  console.log(this.winnerPlayers)

                } else {
                  console.log("no winners yet")
                }


                //Reset game 
                
                this.betFlag = true;
                this.dealFlag = false;
                this.dealedPlayers = []
                this.game.suffle() 
              }, 10000)

            })
          })

          //end of the event

      } catch {

      }
    })
  }
}

export default KirmastiServer;