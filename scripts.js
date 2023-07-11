function createDivs() {
  let container = document.querySelector('.container');
  let rowDiv;
  let itemDiv;
  
  for (let row = 0; row < 16; row++) {
    rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    container.appendChild(rowDiv);

    for (let item = 0; item < 16; item++) {
      itemDiv = document.createElement('div');
      itemDiv.classList.add('item')
      rowDiv.appendChild(itemDiv);  
    }
    
  }
}

