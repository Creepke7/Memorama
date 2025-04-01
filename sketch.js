let cardImages = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 10;
const rows = 4;
const cols = 5;
let cardSize;

function preload() {
    fetchPokemonImages();
}

function setup() {
    createCanvas(500, 400);
    cardSize = width / cols;
}

function draw() {
    background(220);
    drawCards();
}

async function fetchPokemonImages() {
    let ids = new Set();
    while (ids.size < totalPairs) {
        ids.add(floor(random(1, 151))); 
    }
    
    let urls = [...ids].map(id => `https://pokeapi.co/api/v2/pokemon/${id}`);
    let responses = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
    
    cardImages = responses.map(pokemon => pokemon.sprites.front_default);
    createCards();
}

function createCards() {
    let tempCards = [];
    cardImages.forEach((img, index) => {
        tempCards.push(new Card(index, img));
        tempCards.push(new Card(index, img));
    });
    
    shuffle(tempCards, true);
    cards = tempCards;
}

function drawCards() {
    for (let i = 0; i < cards.length; i++) {
        let x = (i % cols) * cardSize;
        let y = floor(i / cols) * cardSize;
        cards[i].show(x, y, cardSize);
    }
}

function mousePressed() {
    for (let i = 0; i < cards.length; i++) {
        let x = (i % cols) * cardSize;
        let y = floor(i / cols) * cardSize;
        
        if (mouseX > x && mouseX < x + cardSize && mouseY > y && mouseY < y + cardSize) {
            if (!cards[i].flipped && flippedCards.length < 2) {
                cards[i].flipped = true;
                flippedCards.push(cards[i]);
                
                if (flippedCards.length === 2) {
                    setTimeout(checkMatch, 1000);
                }
            }
        }
    }
}

function checkMatch() {
    if (flippedCards[0].id === flippedCards[1].id) {
        matchedPairs++;
    } else {
        flippedCards.forEach(card => card.flipped = false);
    }
    flippedCards = [];
    
    if (matchedPairs === totalPairs) {
        alert("¡Ganaste!");
    }
}

class Card {
    constructor(id, img) {
        this.id = id;
        this.img = loadImage(img);
        this.flipped = false;
    }
    
    show(x, y, size) {
        stroke(0);
        fill(255);
        rect(x, y, size, size, 10);
        
        if (this.flipped) {
            image(this.img, x, y, size, size);
        }
    }
}
