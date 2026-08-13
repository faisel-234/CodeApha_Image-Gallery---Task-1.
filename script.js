// Image Gallery — CodeAlpha Internship Project

const galleryItems = document.querySelectorAll('.gallery-item');
const filterButtons = document.querySelectorAll('.filter-btn');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
const lightboxCounter = document.getElementById('lightboxCounter');
const closeBtn = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('lightboxPrev');
const nextBtn = document.getElementById('lightboxNext');

let currentImages = [];   // the set of gallery items the lightbox is currently browsing
let currentIndex = 0;
let lastFocusedElement = null;

init();

function init() {
  markMissingImages();

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => filterGallery(btn.dataset.filter));
  });

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      openLightbox(visibleItems, visibleItems.indexOf(item));
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPreviousImage);
  nextBtn.addEventListener('click', showNextImage);

  // Clicking the dark backdrop (outside the image) also closes the lightbox
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', handleKeydown);
}

// If an image path doesn't exist yet, show a styled placeholder instead of a broken icon
function markMissingImages() {
  galleryItems.forEach((item) => {
    const img = item.querySelector('.gallery-img');
    img.addEventListener('error', () => item.classList.add('img-missing'));
  });
}

function filterGallery(category) {
  galleryItems.forEach((item) => {
    const matches = category === 'all' || item.dataset.category === category;
    item.classList.toggle('hidden', !matches);
  });

  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === category;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

function getVisibleItems() {
  return Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
}

function openLightbox(items, index) {
  currentImages = items;
  currentIndex = index;
  lastFocusedElement = document.activeElement;

  updateLightboxImage();

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  if (lastFocusedElement) lastFocusedElement.focus();
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightboxImage();
}

function showPreviousImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const activeItem = currentImages[currentIndex];
  const img = activeItem.querySelector('.gallery-img');
  const isMissing = activeItem.classList.contains('img-missing');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxImg.hidden = isMissing;
  lightboxPlaceholder.hidden = !isMissing;

  lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

function handleKeydown(event) {
  if (!lightbox.classList.contains('is-open')) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPreviousImage();
  if (event.key === 'ArrowRight') showNextImage();
}
