/* Declare consts for HTML elements */
const grid = document.querySelector('.grid');
const reSizeBtn = document.querySelector('#reSizeBtn');
const eraserBtn = document.querySelector('#eraserBtn');
const progressiveBtn = document.querySelector('#progressiveBtn')

/* Add event listeners to buttons */
reSizeBtn.addEventListener('click', promptUserForSize);
eraserBtn.addEventListener('click', eraserMode);
progressiveBtn.addEventListener('click', progressiveMode);

/* Declare and initialize variables to be used in functions */
let size = 16;
let erase = false;
let progressive = false;
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

  updateGrid();  
}


function updateGrid() { 
  // First, remove existing grid
  removeGrid();

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


function removeGrid() {
  let items = document.querySelectorAll('.item');

  items.forEach(item => { item.remove(); })
}


function eraserMode(e) {
  eraserBtn.classList.toggle('clicked');

  if (erase === false) {
    erase = true;
  } else {
    erase = false;
  }
}


function progressiveMode() {
  progressiveBtn.classList.toggle('clicked');

  if (progressive === false) {
    progressive = true;
  } else {
    progressive = false;
  }
}


function sketch(e) {
  if (erase === false) {
    if (progressive === false) {
      e.target.classList.add('etched');
    } else {
      // Store current RGB value as array of integers
      rgbCurrent = rgbToArray(getComputedStyle(e.target).getPropertyValue('background-color').slice(4, -1));

      /* 
       * If square has not yet been progressive etched, calculate the "travel"
       * from current RGB value to target RGB value
       */ 
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
    
  } else {
    // If "erase" mode engaged, remove the etch
    e.target.classList.remove('etched');
  }
}


/* Functions for progressive darkening feature */
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