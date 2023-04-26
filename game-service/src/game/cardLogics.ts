import Deck from "./decks";

class CardLogic {
    
    readonly deck: object[]
    protected current: object[] | []
    constructor(deck:object[]) {
        this.deck = deck
        this.current = this.deck.slice()

    }

    suffle():void {
        this.current = this.deck;
    }

    //for testing
    showDeck():object[] {
        return this.current;
    }

    pickCard():object {
        let random = Math.floor(Math.random() * this.current.length)
        const card = this.current.splice(random, 1)
        return card[0];
    }

    dealCards(card:number):object[] {
        let cards = []
        for(let i = 0; i < card; i++) {
            let card = this.pickCard()
            cards.push(card)
        }
        return cards;
    }

}

export default CardLogic;