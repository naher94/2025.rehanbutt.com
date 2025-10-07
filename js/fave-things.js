// const elements = document.getElementsByClassName('fave-circle');

// // Convert HTMLCollection to array for easier manipulation
// const elementsArray = Array.from(elements);

// // Function to add 'hovered' class to all elements in elementsArray
// function addHoverClass() {
//   elementsArray.forEach(function (element) {
//     element.classList.add('hovered');
//   });
// }

// // Function to remove 'hovered' class from all elements in elementsArray
// function removeHoverClass() {
//   elementsArray.forEach(function (element) {
//     element.classList.remove('hovered');
//   });
// }

// // Adding event listeners to each element in elementsArray
// elementsArray.forEach(function (element) {
//   // Adding event listener for hover
//   element.addEventListener('mouseover', addHoverClass);

//   // Adding event listener for mouseout
//   element.addEventListener('mouseout', removeHoverClass);
// });

//---------------------------

// let previousChild = null; // Track the previously selected child element
// elementsArray.forEach((element, index) => {
//   element.addEventListener('touchstart', (event) => {
//     const isHighlighted = element.classList.contains('highlight');

//     // Remove 'highlight' from all elements
//     elementsArray.forEach((el) => el.classList.remove('highlight'));

//     // Adjust the index to match the class name which starts from 1, not 0
//     const adjustedIndex = index + 1;  // This ensures the class name starts from 1

//     // Find the child element with the corresponding class based on the adjusted index
//     const child = document.querySelector(`.fave-description-${adjustedIndex}`);

//     // Remove 'show-hide' class from the previous child (if there is one)
//     if (previousChild && previousChild !== child) {
//       previousChild.classList.remove('show-hide');
//     }

//     // Add/remove 'highlight' class to the selected element
//     if (!isHighlighted) {
//       element.classList.add('highlight');

//       // Add 'show-hide' class to the corresponding child element
//       if (child) {
//         child.classList.add('show-hide');
//       }

//       // Update the previous child to the current one
//       previousChild = child;
//     } else {
//       // Remove the 'highlight' class from the element
//       element.classList.remove('highlight');

//       // Remove 'show-hide' class from the corresponding child element
//       if (child) {
//         child.classList.remove('show-hide');
//       }

//       // Reset previous child to null if no element is highlighted
//       previousChild = null;
//     }
//   });
// });



