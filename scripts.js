const container = document.querySelector('.container');

const button = document.querySelector('#buttonForSize');
button.addEventListener('click', promptUserForSize);
let size;

createDivs();  
addListeners();

function promptUserForSize() {
  do {
    size = parseInt(prompt('Size of grid:'));
  } while (size > 100 || size < 1);
  
  removeDivs();
  createDivs();  
  addListeners();
}


function createDivs() {
  let rowDiv;
  let itemDiv;

  if (size === undefined) {
    size = 16;
  }
  
  for (let row = 0; row < size; row++) {
    rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    container.appendChild(rowDiv);

    for (let item = 0; item < size; item++) {
      itemDiv = document.createElement('div');
      itemDiv.classList.add('item')
      rowDiv.appendChild(itemDiv);  
    }
  }
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


function addListeners() {
  const divs = document.querySelectorAll('div.item');

  divs.forEach((item) => {
    item.addEventListener('mouseover', hoverEffectOn);
    // item.addEventListener('mouseout', hoverEffectOff);
  })  
}


function hoverEffectOn(e) {
  e.target.classList.add('hover');
}


function hoverEffectOff(e) {
  e.target.classList.remove('hover');
}
