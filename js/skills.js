const boxes = document.querySelectorAll('.skill');
async function animateBox(box) {
  // Move left
  box.style.transform = 'translateX(calc(calc(1.25em + var(--skill-padding))* -1))';
  await new Promise(r => setTimeout(r, 3000));
  // Slide back
  box.style.transform = 'translateX(0)';
  await new Promise(r => setTimeout(r, 500));
  // Wait before next
  await new Promise(r => setTimeout(r, 3000));
}
async function loop() {
  while (true) {
    for (const box of boxes) {
      await animateBox(box);
    }
  }
}
loop();

const el = document.querySelector('.skill.skill__0');

if (el) {
  const computedHeight = getComputedStyle(el).height;
  document.documentElement.style.setProperty('--skill-height-ref', computedHeight);
}
