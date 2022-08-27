import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import gsap from "https://cdn.skypack.dev/gsap@3.9.1";

console.clear();

let draw, squareSize, numRows, numCols, colors, colorPalette;

function drawCircle(x, y, foreground, background) {
    const group = draw.group().addClass("draw-circle");
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    group.circle(squareSize).fill(foreground).move(x, y);
  }
  

function getTwoColors(colors) {
    let colorList = [...colors];
    const colorIndex = random(0, colorList.length - 1, true);
    const background = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    const foreground = random(colorList);
    return { foreground, background };
  }

function drawBlock(x, y, background) {
    const group = draw.group().addClass("draw-block");
  
    group.rect(squareSize, squareSize).fill(background).move(x, y);
}

function generateNewGrid() {
    document.querySelector(".container").innerHTML = "";
    drawGrid();
}

function generateLittleBlock(i, j) {
    const { foreground, background } = getTwoColors(colorPalette);
    const blockStyleOptions = [drawCircle];
    const blockStyle = random(blockStyleOptions);
    const xPos = i * squareSize;
    const yPos = j * squareSize;
  
    blockStyle(xPos, yPos, foreground, background);
  }

async function drawGrid() {
    colorPalette = random(colors);
    squareSize = 50;
    numRows = random(4, 8, true);
    numCols = random(4, 8, true);

    const bg = tinycolor
        .mix(colorPalette[0], colorPalette[1], 50)
        .desaturate(10)
        .toString();

    // Make Lighter version
    const bgInner = tinycolor(bg).lighten(10).toString();
    // And darker version
    const bgOuter = tinycolor(bg).darken(10).toString();

    // Set to CSS Custom Properties
    gsap.to(".container", {
        "--bg-inner": bgInner,
        "--bg-outer": bgOuter,
        duration: 0.5
    });

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
    // Get color palettes
    colors = await fetch(
        "https://unpkg.com/nice-color-palettes@3.0.0/100.json"
    ).then((response) => response.json());
    generateNewGrid();
    document.querySelector(".button").addEventListener("click", generateNewGrid);
}

init();
  
  