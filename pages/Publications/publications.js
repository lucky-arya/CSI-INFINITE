// Publications Page JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('menu-open');
      }
    });
  }

  // Add scrolled class to header on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add stagger animation to publication items
  const publicationItems = document.querySelectorAll('.publication-item');
  publicationItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });
});

// Toggle Publication Details (Dropdown)
function togglePublication(button) {
  const publicationItem = button.closest('.publication-item');
  const publicationDetails = publicationItem.querySelector('.publication-details');
  const allPublicationItems = document.querySelectorAll('.publication-item');
  
  const isActive = publicationDetails.classList.contains('active');
  
  // Close all other publication items
  allPublicationItems.forEach(item => {
    const details = item.querySelector('.publication-details');
    const btn = item.querySelector('.read-more-btn');
    details.classList.remove('active');
    btn.classList.remove('active');
    btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
  });
  
  // If this item wasn't active, open it
  if (!isActive) {
    publicationDetails.classList.add('active');
    button.classList.add('active');
    button.innerHTML = 'Show Less <i class="fas fa-chevron-down"></i>';
    
    // Smooth scroll to the item after a brief delay
    setTimeout(() => {
      publicationItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
  }
}