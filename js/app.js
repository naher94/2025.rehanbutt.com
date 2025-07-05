// $(document).foundation();

// For flip clock footer items
const footer = document.querySelector('footer');
const flipCardWidth = document.querySelector('.static-number').getBoundingClientRect().width;
footer.style.setProperty('--flip-card-width', `${flipCardWidth}px`);