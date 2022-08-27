import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";

console.clear();

let draw, squareSize, numRows, numCols;

function drawBlock(x, y) {
    const group = draw.group().addClass("draw-block");
  
    group.rect(squareSize, squareSize).fill("white").stroke("black").move(x, y);
}

function generateNewGrid() {
    document.querySelector(".container").innerHTML = "";
    drawGrid();
}

function generateLittleBlock(i, j) {
    const xPos = i * squareSize;
    const yPos = j * squareSize;
  
    drawBlock(xPos, yPos);
  }

async function drawGrid() {
    // Set Variables
    squareSize = 50;
    numRows = random(4, 8, true);
    numCols = random(4, 8, true);

    // Create parent SVG
    draw = SVG()
        .addTo(".container")
        .size("100%", "100%")
        .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

    // Create Grid
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
        generateLittleBlock(i, j);
        }
    }
}

async function init() {
    generateNewGrid();
    document.querySelector(".button").addEventListener("click", generateNewGrid);
}

init();
  
  