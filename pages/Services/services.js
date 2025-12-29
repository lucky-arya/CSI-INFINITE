// Services Page JavaScript

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

  // Add stagger animation to service items
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });
});

// Toggle Service Details (Dropdown)
function toggleService(button) {
  const serviceItem = button.closest('.service-item');
  const serviceDetails = serviceItem.querySelector('.service-details');
  const allServiceItems = document.querySelectorAll('.service-item');
  
  // Check if this item is currently active
  const isActive = serviceDetails.classList.contains('active');
  
  // Close all other service items
  allServiceItems.forEach(item => {
    const details = item.querySelector('.service-details');
    const btn = item.querySelector('.read-more-btn');
    details.classList.remove('active');
    btn.classList.remove('active');
    btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
  });
  
  // If this item wasn't active, open it
  if (!isActive) {
    serviceDetails.classList.add('active');
    button.classList.add('active');
    button.innerHTML = 'Show Less <i class="fas fa-chevron-down"></i>';
    
    // Smooth scroll to the item after a brief delay
    setTimeout(() => {
      serviceItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
  }
}

// Allow clicking anywhere on the service header to toggle
document.addEventListener('DOMContentLoaded', function() {
  const serviceHeaders = document.querySelectorAll('.service-header');
  
  serviceHeaders.forEach(header => {
    header.addEventListener('click', function(e) {
      // Prevent double-triggering if button is clicked
      if (e.target.closest('.read-more-btn')) {
        return;
      }
      
      const button = this.querySelector('.read-more-btn');
      if (button) {
        toggleService(button);
      }
    });
  });
});