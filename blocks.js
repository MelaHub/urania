import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import gsap from "https://cdn.skypack.dev/gsap@3.9.1";

console.clear();

let draw, squareSize, numRows, numCols, colors, colorPalette;

const selectedCharacters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    // O removed for looking like a circle
    "P",
    // Q removed for an annoying descender
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "&"
  ];

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


function drawQuarterCircle(x, y, foreground, background) {
    const group = draw.group().addClass("draw-quarter-circle");
    const circleGroup = draw.group();
    group.rect(squareSize, squareSize).fill(background).move(x, y);

    const offset = random([   
        [0, 0], // btm right
        [0, -squareSize], // top right
        [-squareSize, -squareSize], // top left
        [-squareSize, 0], // btm left
      ]);    
  

    const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x, y);
    circleGroup.circle(2 * squareSize).fill(foreground).move(x+ offset[0], y + offset[1]);
    circleGroup.maskWith(mask);
    group.add(circleGroup);
}

function drawCross(x, y, foreground, background) {
    const group = draw.group().addClass("draw-cross");
    const crossGroup = draw.group();
    group.rect(squareSize, squareSize).fill(background).move(x, y);
  
    crossGroup
      .rect(squareSize / 1.5, squareSize / 5)
      .fill(foreground)
      .center(x + squareSize / 2, y + squareSize / 2);
  
    crossGroup
      .rect(squareSize / 1.5, squareSize / 5)
      .fill(foreground)
      .center(x + squareSize / 2, y + squareSize / 2)
      .transform({ rotate: 90 });
  
    if (Math.random() < 0.4) {
      crossGroup.transform({ rotate: 45, origin: "center center" });
    }
  }


function drawDots(x, y, foreground, background) {
    const group = draw.group().addClass("dots");

    const sizeOptions = [2, 3, 4];
    const size = random(sizeOptions);

    const offset = squareSize * 0.1;
    const circleSize = squareSize * 0.1 ;
    const space = (squareSize - offset * 2 - circleSize) / (size - 1);

    group.rect(squareSize, squareSize).fill(background).move(x, y);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
        group
            .circle(circleSize)
            .fill(foreground)
            .move(x + offset + i * space, y + offset + j * space);
        }
    }
}

function drawLetterBlock(x, y, foreground, background) {
    const group = draw.group().addClass("draw-letter");
    const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x, y);
  
    // Draw Background
    group.rect(squareSize, squareSize).fill(background).move(x, y);
  
    // Draw Foreground
    const character = random(selectedCharacters);
    const text = group.plain(character);
    text.font({
      family: "Source Code Pro",
      size: squareSize * 1.2,
      weight: 800,
      anchor: "middle",
      fill: foreground,
      leading: 1
    });
    text.center(x + squareSize / 2, y + squareSize / 2);
    text.rotate(random([0, 90, 180, 270]));
    group.maskWith(mask);
  }
  
function getTwoColors(colors) {
    let colorList = [...colors];
    const colorIndex = random(0, colorList.length - 1, true);
    const background = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    const foreground = random(colorList);
    return { foreground, background };
  }

function generateLittleBlock(i, j) {
    const { foreground, background } = getTwoColors(colorPalette);
    const blockStyleOptions = [
        drawDots, 
        drawCross, 
        drawQuarterCircle, 
        drawCircle, 
        drawOppositeCircles,
        drawLetterBlock
    ];
    const blockStyle = random(blockStyleOptions);
    const xPos = i * squareSize;
    const yPos = j * squareSize;
  
    blockStyle(xPos, yPos, foreground, background);
  }

  function generateBigBlock() {
    const { foreground, background } = getTwoColors(colorPalette);
  
    const blockStyleOptions = [
      drawCross,
      drawCircle,
      drawQuarterCircle,
      drawOppositeCircles,
      drawLetterBlock,
      drawDots,
    ];
  
    let prevSquareSize = squareSize;
  
    const multiplier = random(Array.from({length:Math.min(numCols, numRows) / 2},(_,k)=>k+2));
    squareSize = multiplier * squareSize;
  
    const xPos = random(0, numRows - multiplier, true) * prevSquareSize;
    const yPos = random(0, numCols - multiplier, true) * prevSquareSize;
  
    const blockStyle = random(blockStyleOptions);
    blockStyle(xPos, yPos, foreground, background);
  
    squareSize = prevSquareSize;
  }

async function drawGrid() {
    colorPalette = random(colors);
    squareSize = 10;
    numRows = random(4, 20, true);
    numCols = random(4, 20, true);

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

    generateBigBlock();

    gsap.fromTo(
        ".container > svg",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );
}


function generateNewGrid() {
    // Fade out SVG
    gsap.to(".container > svg", {
      opacity: 0,
      scale: 0.8,
      duration: 0.25,
      onComplete: () => {
        // Remove previous SVG from DOM
        document.querySelector(".container").innerHTML = "";
        // Start new SVG creation
        drawGrid();
      }
    });
  }

async function init() {
    // Get color palettes
    colors = await fetch(
        "https://unpkg.com/nice-color-palettes@3.0.0/100.json"
    ).then((response) => response.json());
    generateNewGrid();
}

init();
  
  