// Gallery Configuration
const IMAGES_PER_PAGE = 12;
let currentPage = 1;
let currentFilter = 'all';
let galleryData = {};
let allImages = [];
let displayedImages = [];

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
  loadGalleryData();
  setupFilters();
  setupLightbox();
  setupMobileMenu();
});

// Load gallery data from JSON
async function loadGalleryData() {
  const galleryGrid = document.getElementById('galleryGrid');
  
  try {
    const response = await fetch('gallery-data.json');
    if (!response.ok) throw new Error('Failed to load gallery data');
    
    galleryData = await response.json();
    
    // Flatten all images into a single array with category info
    allImages = [];
    Object.keys(galleryData).forEach(category => {
      galleryData[category].forEach(item => {
        allImages.push({
          ...item,
          category: category
        });
      });
    });
    
    // Load the gallery
    loadGallery();
  } catch (error) {
    console.error('Error loading gallery data:', error);
    galleryGrid.innerHTML = `
      <div class="loading-state">
        <p style="color: #dc3545;">Failed to load gallery. Please refresh the page.</p>
      </div>
    `;
  }
}

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
  
  if (displayedImages.length === 0) {
    galleryGrid.innerHTML = `
      <div class="loading-state">
        <p>No images found in this category.</p>
      </div>
    `;
    loadMoreBtn.style.display = 'none';
    return;
  }
  
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
  img.src = image.image;
  img.alt = image.title || 'Gallery Image';
  img.loading = 'lazy';
  
  // Error handling for missing images
  img.onerror = () => {
    img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
  };
  
  const overlay = document.createElement('div');
  overlay.className = 'gallery-item-overlay';
  
  const caption = document.createElement('div');
  caption.className = 'gallery-item-caption';
  caption.textContent = image.title || 'CSI Gallery';
  
  overlay.appendChild(caption);
  item.appendChild(img);
  item.appendChild(overlay);
  
  // Click to open lightbox
  item.addEventListener('click', () => openLightbox(image.image, image.title));
  
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
      
      // Scroll to gallery grid smoothly
      document.querySelector('.gallery-grid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    });
  });
}

// Lightbox functionality
let currentLightboxIndex = 0;
let currentLightboxImages = [];

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
  
  // Get current filtered images for navigation
  currentLightboxImages = currentFilter === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === currentFilter);
  
  // Find current image index
  currentLightboxIndex = currentLightboxImages.findIndex(img => img.image === src);
  
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
    currentLightboxIndex = currentLightboxImages.length - 1;
  } else if (currentLightboxIndex >= currentLightboxImages.length) {
    currentLightboxIndex = 0;
  }
  
  const image = currentLightboxImages[currentLightboxIndex];
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  lightboxImage.src = image.image;
  lightboxCaption.textContent = image.title || '';
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