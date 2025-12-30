// Gallery Configuration
const IMAGES_PER_PAGE = 12;
let currentPage = 1;
let currentFilter = 'all';
let allImages = [];
let displayedImages = [];

// Image database - UPDATE THIS ARRAY WITH YOUR IMAGES
const imageDatabase = [
  // Events 2024
  { src: 'gallery/events-2024/img1.jpg', category: 'events-2024', caption: 'Event 2024' },
  { src: 'gallery/events-2024/img2.jpg', category: 'events-2024', caption: 'Event 2024' },
  { src: 'gallery/events-2024/img3.jpg', category: 'events-2024', caption: 'Event 2024' },
  
  // Events 2023
  { src: 'gallery/events-2023/img1.jpg', category: 'events-2023', caption: 'Event 2023' },
  { src: 'gallery/events-2023/img2.jpg', category: 'events-2023', caption: 'Event 2023' },
  
  // Workshops
  { src: 'gallery/workshops/img1.jpg', category: 'workshops', caption: 'Workshop Session' },
  { src: 'gallery/workshops/img2.jpg', category: 'workshops', caption: 'Workshop Session' },
  
  // Team Photos
  { src: 'gallery/team-photos/img1.jpg', category: 'team-photos', caption: 'Team Photo' },
  { src: 'gallery/team-photos/img2.jpg', category: 'team-photos', caption: 'Team Photo' },
  
  // Training Sessions
  { src: 'gallery/training-sessions/img1.jpg', category: 'training-sessions', caption: 'Training Session' },
  { src: 'gallery/training-sessions/img2.jpg', category: 'training-sessions', caption: 'Training Session' },
  
  // Miscellaneous
  { src: 'gallery/misc/img1.jpg', category: 'misc', caption: 'Miscellaneous' },
  { src: 'gallery/misc/img2.jpg', category: 'misc', caption: 'Miscellaneous' },
];

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
  allImages = [...imageDatabase];
  loadGallery();
  setupFilters();
  setupLightbox();
  setupMobileMenu();
});

// Load gallery images
function loadGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  // Filter images based on current filter
  const filteredImages = currentFilter === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === currentFilter);
  
  // Calculate images to display
  const startIndex = 0;
  const endIndex = currentPage * IMAGES_PER_PAGE;
  displayedImages = filteredImages.slice(startIndex, endIndex);
  
  // Clear loading state
  galleryGrid.innerHTML = '';
  
  // Render images
  displayedImages.forEach((image, index) => {
    const item = createGalleryItem(image, index);
    galleryGrid.appendChild(item);
  });
  
  // Show/hide load more button
  if (endIndex >= filteredImages.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-block';
  }
  
  // Setup load more functionality
  loadMoreBtn.onclick = () => {
    currentPage++;
    loadGallery();
  };
}

// Create gallery item
function createGalleryItem(image, index) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.style.animationDelay = `${index * 0.05}s`;
  item.dataset.category = image.category;
  
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.caption || 'Gallery Image';
  img.loading = 'lazy';
  
  // Error handling for missing images
  img.onerror = () => {
    img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
  };
  
  const overlay = document.createElement('div');
  overlay.className = 'gallery-item-overlay';
  
  const caption = document.createElement('div');
  caption.className = 'gallery-item-caption';
  caption.textContent = image.caption || 'CSI Gallery';
  
  overlay.appendChild(caption);
  item.appendChild(img);
  item.appendChild(overlay);
  
  // Click to open lightbox
  item.addEventListener('click', () => openLightbox(image.src, image.caption));
  
  return item;
}

// Setup filter buttons
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update filter and reset page
      currentFilter = btn.dataset.filter;
      currentPage = 1;
      
      // Reload gallery
      loadGallery();
    });
  });
}

// Lightbox functionality
let currentLightboxIndex = 0;

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(src, caption) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  // Find current image index in all images
  currentLightboxIndex = allImages.findIndex(img => img.src === src);
  
  lightboxImage.src = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  
  // Wrap around
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = allImages.length - 1;
  } else if (currentLightboxIndex >= allImages.length) {
    currentLightboxIndex = 0;
  }
  
  const image = allImages[currentLightboxIndex];
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  lightboxImage.src = image.src;
  lightboxCaption.textContent = image.caption || '';
}

// Mobile menu
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      body.classList.toggle('menu-open');
    });

    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        body.classList.remove('menu-open');
      });
    });
  }

  // Scroll header effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}