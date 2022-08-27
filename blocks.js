import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import gsap from "https://cdn.skypack.dev/gsap@3.9.1";

console.clear();

let draw, squareSize, numRows, numCols, colors, colorPalette;

function drawOppositeCircles(x, y, foreground, background) {
    const group = draw.group().addClass("opposite-circles");
  
    const circleGroup = draw.group();
  
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x, y);

    const offset = random([
        // top left + bottom right
        [0, 0, squareSize, squareSize],
        // top right + bottom left
        [0, squareSize, squareSize, 0],
      ]);    
  
    circleGroup
      .circle(squareSize)
      .fill(foreground)
      .center(x + offset[0], y + offset[1]); 
  
    circleGroup
      .circle(squareSize)
      .fill(foreground)
      .center(x + offset[2], y + offset[3]);

    circleGroup.maskWith(mask);
    group.add(circleGroup);
  }

function drawCircle(x, y, foreground, background) {
    const group = draw.group().addClass("draw-circle");
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    group.circle(squareSize).fill(foreground).move(x, y);
    // 30% of the time add an inner circle
    if (Math.random() < 0.3) {
        group
        .circle(squareSize / 2)
        .fill(background)
        .move(x + squareSize / 4, y + squareSize / 4);
    }
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
    const blockStyleOptions = [drawCircle, drawOppositeCircles];
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
  
  