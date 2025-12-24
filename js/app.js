// For flip clock footer
const footer = document.querySelector('footer');
const flipCardWidth = document.querySelector('.static-number').getBoundingClientRect().width;
footer.style.setProperty('--flip-card-width', `${flipCardWidth}px`);


///////////////////////////////////////////// Start of Copy to Clipboard
function copyToClipboard(link,clickedItem) {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText){
		var copyBadge = document.createElement("span");
		copyBadge.classList.add("copied");
		copyBadge.setAttribute("id", "copy-confirmation");
		copyBadge.innerText = "Copied!";
		clickedItem.appendChild(copyBadge);

    copyBadge.style.visibility = 'visible';
    navigator.clipboard.writeText(link);  
    setTimeout(function(){copyBadge.style.visibility = 'hidden';}, 1500);
		setTimeout(function(){copyBadge.remove();}, 1600);
    return;
	}
  return Promise.reject('The Clipboard API is not available.');
}
///////////////////////////////////////////// End of Copy to Clipboard




// Add this near your images array:
const captions = [
  "A photo of a Tori gate with cherry blossoms outside of Fiji in Japan",
  "Caption for image 2",
  "A photo of Lumiere from Disneyland's Paint the Night Parade",
  "Caption for image 4",
  "Caption for image 5",
  "Caption for image 6"
  // Add more captions as needed, matching the number/order of your images
];

let currentImageIndex = 0;
let isAnimating = false;
// Get all thumbnails and images from the DOM
const gallery = document.getElementById("gallery");
const thumbnails = Array.from(gallery.querySelectorAll(".thumbnail"));
const images = thumbnails.map((thumb) => thumb.querySelector("img").src);
// DOM elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("counter");
const animationOverlay = document.getElementById("animationOverlay");
// Add click listeners to existing thumbnails
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", (e) => {
    if (!isAnimating) {
      openLightbox(index, thumbnail);
    }
  });
});
// Get thumbnail element for current image
function getCurrentThumbnail() {
  return thumbnails[currentImageIndex];
}
// Open lightbox with scaling animation from thumbnail
function openLightbox(index, thumbnailElement) {
  if (isAnimating) return;
  isAnimating = true;
  currentImageIndex = index;
  const thumbnailImg = thumbnailElement.querySelector("img");
  // Get thumbnail position and dimensions
  const thumbnailRect = thumbnailElement.getBoundingClientRect();
  // Create animating image element
  const animatingImg = document.createElement("img");
  animatingImg.src = images[index];
  animatingImg.className = "animating-image";
  // Set initial position and size to match thumbnail exactly
  animatingImg.style.left = thumbnailRect.left + "px";
  animatingImg.style.top = thumbnailRect.top + "px";
  animatingImg.style.width = thumbnailRect.width + "px";
  animatingImg.style.height = thumbnailRect.height + "px";
  animatingImg.style.objectFit = "cover";
  // Add to DOM
  document.body.appendChild(animatingImg);
  // Start background fade
  animationOverlay.classList.add("active");
  // Wait for image to load, then animate
  animatingImg.onload = () => {
    // Calculate final position and size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 80;
    const availableWidth = viewportWidth - padding;
    const availableHeight = viewportHeight - padding;
    const imageWidth = animatingImg.naturalWidth;
    const imageHeight = animatingImg.naturalHeight;
    const scaleX = availableWidth / imageWidth;
    const scaleY = availableHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    const finalWidth = imageWidth * scale;
    const finalHeight = imageHeight * scale;
    const finalLeft = (viewportWidth - finalWidth) / 2;
    const finalTop = (viewportHeight - finalHeight) / 2;
    // Trigger the animation
    requestAnimationFrame(() => {
      animatingImg.style.left = finalLeft + "px";
      animatingImg.style.top = finalTop + "px";
      animatingImg.style.width = finalWidth + "px";
      animatingImg.style.height = finalHeight + "px";
      animatingImg.style.objectFit = "contain";
      animatingImg.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.7)";
    });
    // Pre-load lightbox image
    lightboxImg.src = images[index];
    updateCounter();
    lightboxImg.style.width = finalWidth + "px";
    lightboxImg.style.height = finalHeight + "px";
    // When lightbox image is loaded, prepare for seamless transition
    lightboxImg.onload = () => {
      setTimeout(() => {
        // Show lightbox behind the animating image
        lightbox.style.opacity = "1";
        lightbox.style.visibility = "visible";
        document.body.style.overflow = "hidden";
        // Fade out the thumbnail
        thumbnailImg.style.opacity = "0.3";
        // Wait longer before starting the fade-out
        setTimeout(() => {
          // Very gradual fade out of animating image
          animatingImg.style.transition = "opacity 0.8s ease-out";
          animatingImg.style.opacity = "0";
          setTimeout(() => {
            // Clean up after fade completes
            lightbox.classList.add("active");
            if (animatingImg.parentNode) {
              document.body.removeChild(animatingImg);
            }
            isAnimating = false;
          }, 800); // Wait for fade-out to complete
        }, 200); // Extra delay before fade starts
      }, 450); // Start transition later in the scale animation
    };
  };
}
// Close lightbox with reverse scaling animation
function closeLightbox() {
  if (isAnimating) return;
  isAnimating = true;
  // Get current thumbnail and restore its opacity
  const currentThumbnail = getCurrentThumbnail();
  const currentThumbnailImg = currentThumbnail.querySelector("img");
  const thumbnailRect = currentThumbnail.getBoundingClientRect();
  // Get current lightbox image position and dimensions
  const lightboxRect = lightboxImg.getBoundingClientRect();
  // Create animating image element
  const animatingImg = document.createElement("img");
  animatingImg.src = images[currentImageIndex];
  animatingImg.className = "animating-image";
  // Set initial position and size to match current lightbox image
  // TODO sort out the shift that is happening on close i'm guessing its related to the calculation not considering the scrollbar
  animatingImg.style.left = lightboxRect.left + "px";
  animatingImg.style.top = lightboxRect.top + "px";
  animatingImg.style.width = lightboxRect.width + "px";
  animatingImg.style.height = lightboxRect.height + "px";
  animatingImg.style.objectFit = "contain";
  animatingImg.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.7)";
  // Add to DOM
  document.body.appendChild(animatingImg);
  // Hide lightbox immediately
  lightbox.classList.remove("active");
  lightbox.style.opacity = "0";
  lightbox.style.visibility = "hidden";
  document.body.style.overflow = "auto";
  // Animate to thumbnail position
  requestAnimationFrame(() => {
    animatingImg.style.left = thumbnailRect.left + "px";
    animatingImg.style.top = thumbnailRect.top + "px";
    animatingImg.style.width = thumbnailRect.width + "px";
    animatingImg.style.height = thumbnailRect.height + "px";
    animatingImg.style.objectFit = "cover";
    animatingImg.style.boxShadow = "none";
  });
  // After animation completes, clean up
  setTimeout(() => {
    // Start fading out background overlay
    animationOverlay.classList.remove("active");
    // Wait longer before fading out animating image
    setTimeout(() => {
      // Very gradual fade out with longer duration
      animatingImg.style.transition = "opacity 0.8s ease-out";
      animatingImg.style.opacity = "0";
      // Restore thumbnail opacity with delay - wait for fade to start
      setTimeout(() => {
        currentThumbnailImg.style.opacity = "1";
        // Clean up animating image after everything else is done
        setTimeout(() => {
          if (animatingImg.parentNode) {
            document.body.removeChild(animatingImg);
          }
          isAnimating = false;
        }, 600); // Wait longer for thumbnail to fully restore
      }, 400); // Wait longer for animating image to fade more
    }, 200); // Larger delay before starting fade
  }, 450); // Start cleanup even later in the animation
}
// Navigate to previous image
function prevImage() {
  if (isAnimating) return;
  currentImageIndex =
    currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
  switchToImage(currentImageIndex);
}
// Navigate to next image
function nextImage() {
  if (isAnimating) return;
  currentImageIndex =
    currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
  switchToImage(currentImageIndex);
}
// Switch to image without thumbnail animation
function switchToImage(index) {
  lightboxImg.src = images[index];
  updateCounter();
  // Recalculate size for new image
  lightboxImg.onload = () => {
    // Use the same calculation as the opening animation
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 80;
    const availableWidth = viewportWidth - padding;
    const availableHeight = viewportHeight - padding;
    const imageWidth = lightboxImg.naturalWidth;
    const imageHeight = lightboxImg.naturalHeight;
    const scaleX = availableWidth / imageWidth;
    const scaleY = availableHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    const finalWidth = imageWidth * scale;
    const finalHeight = imageHeight * scale;
    lightboxImg.style.width = finalWidth + "px";
    lightboxImg.style.height = finalHeight + "px";
  };
}
// Update counter display to show caption and set alt text
function updateCounter() {
  const caption = captions[currentImageIndex] || "";
  counter.textContent = caption;
  lightboxImg.alt = caption;
}
// Event listeners
closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
// Close lightbox when clicking outside the image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox && !isAnimating) {
    closeLightbox();
  }
});
// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active") || isAnimating) return;
  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      prevImage();
      break;
    case "ArrowRight":
      nextImage();
      break;
  }
});
