const grid = document.querySelector('.grid');
const reSizeBtn = document.querySelector('#reSizeBtn');
const eraserModeBtn = document.querySelector('#eraserModeBtn');

reSizeBtn.addEventListener('click', promptUserForSize);
eraserModeBtn.addEventListener('click', eraserMode);

let size = 16;
let erase = false;

updateGrid();  
addListeners();

function promptUserForSize() {
  do {
    size = parseInt(prompt('Size of grid:'));
  } while (size > 100 || size < 1);

  removeDivs();
  updateGrid();  
}


function updateGrid() { 
let newDiv;

grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let row = 0; row < size; row++) {
    for (let item = 0; item < size; item++) {
      newDiv = document.createElement('div');
      newDiv.classList.add('item')
      grid.appendChild(newDiv);
      newDiv.addEventListener('mousedown', sketch); // sketches on single click
    }
  }

grid.addEventListener('mousedown', () => {
  grid.addEventListener('mouseover', sketch); // sketches on click + drag
});

window.addEventListener('mouseup', () => {
  grid.removeEventListener('mouseover', sketch); // stops sketching when mouse released
})

}


function removeDivs() {
  let items = document.querySelectorAll('.item');
  let rows = document.querySelectorAll('.row');
  
  items.forEach((item) => {
    item.remove();
  })

  rows.forEach((row) => {
    row.remove();
  })
}


function eraserMode() {
  erase = true;
}


function sketch(e) {
  console.log(e.target);
  console.log(e.currentTarget);

  if (erase === false) {
    e.target.classList.add('etched');
  } else {
    e.target.classList.remove('etched');
  }
}