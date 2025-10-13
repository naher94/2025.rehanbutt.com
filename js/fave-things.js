// const grid = document.querySelector('.fave-grid');
// const cols = 10;
// const rows = 6;

// const occupied = new Set();

// // Only consider .grid-cell elements for marking occupied cells
// [...grid.querySelectorAll('.grid-cell')].forEach((cell) => {
//   const style = getComputedStyle(cell);

//   const startRow = parseInt(style.gridRowStart) || 1;
//   const startCol = parseInt(style.gridColumnStart) || 1;

//   // Determine row/col spans
//   let rowSpan = 1;
//   let colSpan = 1;

//   // Handle span syntax if present
//   if (style.gridRowEnd.includes('span')) {
//     rowSpan = parseInt(style.gridRowEnd.replace('span ', ''));
//   } else {
//     rowSpan = parseInt(style.gridRowEnd) - startRow || 1;
//   }

//   if (style.gridColumnEnd.includes('span')) {
//     colSpan = parseInt(style.gridColumnEnd.replace('span ', ''));
//   } else {
//     colSpan = parseInt(style.gridColumnEnd) - startCol || 1;
//   }

//   // Mark all cells covered by this element
//   for (let r = startRow; r < startRow + rowSpan; r++) {
//     for (let c = startCol; c < startCol + colSpan; c++) {
//       occupied.add(`${r}-${c}`);
//     }
//   }
// });

// // Fill empty cells with .grid-cell.seat-filler
// for (let r = 1; r <= rows; r++) {
//   for (let c = 1; c <= cols; c++) {
//     const key = `${r}-${c}`;
//     if (!occupied.has(key)) {
//       const newCell = document.createElement('div');
//       newCell.className = 'grid-cell seat-filler';
//       newCell.style.gridRowStart = r;
//       newCell.style.gridColumnStart = c;
//       grid.appendChild(newCell);
//       occupied.add(key);
//     }
//   }
// }

// TODO delete above and see if the last column is the right width, seems to be a localized issue to Safari
// TODO figure out why this does not run in Chrome or Firefox

// Signal script load early and provide a safe stub so console calls won't throw
try {
  console.log('fave-things.js loaded');
} catch (e) {
  // ignore console errors in very restricted environments
}

// early stub to avoid ReferenceError when calling from console if the script
// fails before the real function is assigned. The real function will overwrite this.
if (!window.fillFaveGrid) {
  window.fillFaveGrid = function() {
    console.warn('fillFaveGrid: script not fully initialized yet or no .fave-grid present');
  };
}

function fillFaveGrid(selector = '.fave-grid') {
  const grid = document.querySelector(selector);

  if (!grid) {
    // No grid on this page — bail out early to avoid getComputedStyle(null) runtime errors
    console.log('fave-things: no .fave-grid element found; skipping filler script.');
    return;
  }

  const style = getComputedStyle(grid);

  // Helper to count actual tracks in a grid-template string (ignores named lines)
  function countTracks(template) {
    const trackRegex = /(\d+\.?\d*(fr|px|%|em|rem|vh|vw))/g;
    const matches = template.match(trackRegex);
    return matches ? matches.length : 0;
  }

  // Dynamically get number of rows and columns
  const rows = countTracks(style.gridTemplateRows);
  const cols = countTracks(style.gridTemplateColumns);

  console.log('Rows:', rows, 'Cols:', cols);

  const occupied = new Set();

  // Mark cells already occupied by .grid-cell elements
  [...grid.querySelectorAll('.grid-cell')].forEach((cell) => {
    const cellStyle = getComputedStyle(cell);

    const startRow = parseInt(cellStyle.gridRowStart) || 1;
    const startCol = parseInt(cellStyle.gridColumnStart) || 1;

    let rowSpan = 1;
    let colSpan = 1;

    if (cellStyle.gridRowEnd.includes('span')) {
      rowSpan = parseInt(cellStyle.gridRowEnd.replace('span ', ''));
    } else {
      rowSpan = parseInt(cellStyle.gridRowEnd) - startRow || 1;
    }

    if (cellStyle.gridColumnEnd.includes('span')) {
      colSpan = parseInt(cellStyle.gridColumnEnd.replace('span ', ''));
    } else {
      colSpan = parseInt(cellStyle.gridColumnEnd) - startCol || 1;
    }

    for (let r = startRow; r < startRow + rowSpan; r++) {
      for (let c = startCol; c < startCol + colSpan; c++) {
        occupied.add(`${r}-${c}`);
      }
    }
  });

  // Fill empty cells **within the defined grid** and set explicit row/col ends
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const key = `${r}-${c}`;
      if (!occupied.has(key)) {
        const newCell = document.createElement('div');
        newCell.className = 'grid-cell seat-filler';
        newCell.style.gridRowStart = r;
        newCell.style.gridRowEnd = r + 1;       // explicit row end
        newCell.style.gridColumnStart = c;
        newCell.style.gridColumnEnd = c + 1;    // explicit col end
        grid.appendChild(newCell);
        occupied.add(key);
      }
    }
  }
}

// Expose to console and external callers
window.fillFaveGrid = fillFaveGrid;

// Auto-run safely when DOM is ready (script is typically included at the end of the page)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => fillFaveGrid());
} else {
  fillFaveGrid();
}


