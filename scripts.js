/* Declare consts for HTML elements */

const grid = document.querySelector('.grid');
const reSizeBtn = document.querySelector('#reSizeBtn');
const clearBtn = document.querySelector('#clearBtn');
const eraserBtn = document.querySelector('#eraserBtn');
const progressiveBtn = document.querySelector('#progressiveBtn');
const randomBtn = document.querySelector('#randomBtn');


/* Add event listeners to buttons */

reSizeBtn.addEventListener('click', promptUserForSize);
clearBtn.addEventListener('click', updateGrid);
eraserBtn.addEventListener('click', eraserMode);
progressiveBtn.addEventListener('click', progressiveMode);
randomBtn.addEventListener('click', randomMode);


/* Declare and initialize variables to be used in functions */

let size = 16;
let erase = false;
let progressive = false;
let random = false;
let rgbStart = [];
let rgbCurrent = [];
let rgbTarget = [];
let rgbTravel = [];


/* Render basic 16x16 grid */

updateGrid();  


/* Functions for basic features */

function promptUserForSize() {
  do {
    size = parseInt(prompt('Size of grid:'));
  } while (size > 100 || size < 1);

  if (size) {
    updateGrid();  
  }
}


function updateGrid() { 
  clearGrid();

  let newDiv;

  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let row = 0; row < size; row++) {
    for (let item = 0; item < size; item++) {
      newDiv = document.createElement('div');
      newDiv.classList.add('item')
      grid.appendChild(newDiv);
      // Add event handler to sketch on single click
      newDiv.addEventListener('mousedown', sketch); 
    }
  }

  window.addEventListener('mousedown', () => {
    // Add event handler to sketch on click + drag
    grid.addEventListener('mouseover', sketch); 
  });

  window.addEventListener('mouseup', () => {
    // Stop sketching when mouse released
    grid.removeEventListener('mouseover', sketch); 
  })

}


function clearGrid() {
  let items = document.querySelectorAll('.item');
  items.forEach(item => { item.remove(); })
}


function sketch(e) {
  switch (erase) {
    case true:
      eraseSketch(e);
      return;
  }
  
  switch (progressive) {
    case true:
      progressiveSketch(e);
      return;
  }

  switch (random) {
    case true:
      randomSketch(e);
      return;
  }

  if (e.target.classList.contains('progressive-etched')) {
    e.target.classList.remove('progressive-etched');
  } else if (e.target.classList.contains('random-etched')) {
    e.target.classList.remove('random-etched');
  }
  
  e.target.style.backgroundColor = 'rgb(0, 0, 0)';
}


function eraserMode() {
  eraserBtn.classList.toggle('clicked');

  if (erase === false) {
    erase = true;
  } else {
    erase = false;
  }

  // Prevent simultaneous activation of eraser mode and other modes
  progressiveBtn.classList.remove('clicked');
  progressive = false;
  randomBtn.classList.remove('clicked');
  random = false;
}


function eraseSketch(e) {
  e.target.style.backgroundColor = 'var(--sketch-background)';
}


/* Functions for progressive darkening feature */

function progressiveMode() {
  progressiveBtn.classList.toggle('clicked');

  if (progressive === false) {
    progressive = true;
  } else {
    progressive = false;
  }

  // Prevent simultaneous activation of progressive mode and other modes
  randomBtn.classList.remove('clicked');
  random = false;
  eraserBtn.classList.remove('clicked');
  erase = false;
}


function progressiveSketch(e) {  
  // Store current RGB value as array of integers
  rgbCurrent = rgbToArray(getComputedStyle(e.target).getPropertyValue('background-color').slice(4, -1));
  
  // If virgin square, calculate "travel" from current RGB value to target RGB value
  if (!e.target.classList.contains('progressive-etched')) {
    rgbStart = rgbCurrent;
    rgbTarget = rgbToArray('0, 0, 0');
    rgbTravel = computeTravel(rgbStart, rgbTarget);
    e.target.classList.add('progressive-etched');
  } 

  // Calculate what the next "stage" in the progressive RGB values should be
  for (let i = 0; i < 3; i++) {
    rgbCurrent[i] = Math.max(rgbCurrent[i] + (rgbTravel[i] / 10), 0);
  }

  // Change the element's RGB value
  e.target.style.backgroundColor = `rgb(${rgbCurrent[0]}, ${rgbCurrent[1]}, ${rgbCurrent[2]})`;
}


function rgbToArray(rgb) {
  // Parse background-color RGB string value into array of integers
  let rgbArray = rgb.split(',');

  // Trim and re-format array
  for (let i = 0; i < 3; i++) {
    rgbArray[i] = Number(rgbArray[i].trim());
  }

  return rgbArray;
}


function computeTravel(rgbCurrent, rgbTarget) {
  let travel = [];

  for (let i = 0; i < 3; i++) {
    travel[i] = rgbTarget[i] - rgbCurrent[i];
  }

  return travel;
}


/* Functions for random RGB drawing feature */

function randomMode() {
  randomBtn.classList.toggle('clicked');

  if (random === false) {
    random = true;
  } else {
    random = false;
  }

  // Prevent simultaneous activation of random mode and other modes
  progressiveBtn.classList.remove('clicked');
  progressive = false;
  eraserBtn.classList.remove('clicked');
  erase = false;
}


function randomSketch(e) {
  if (!e.target.classList.contains('random-etched')) {
    e.target.classList.add('random-etched');
  } 

  let randomR = Math.floor(Math.random() * 256);
  let randomG = Math.floor(Math.random() * 256);
  let randomB = Math.floor(Math.random() * 256);

  e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`;  
}