// Careers Page JavaScript

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

  // Add stagger animation to job items
  const jobItems = document.querySelectorAll('.job-item');
  jobItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });
});

// Toggle Job Details (Dropdown)
function toggleJob(button) {
  const jobItem = button.closest('.job-item');
  const jobDetails = jobItem.querySelector('.job-details');
  const allJobItems = document.querySelectorAll('.job-item');
  
  const isActive = jobDetails.classList.contains('active');
  
  // Close all other job items
  allJobItems.forEach(item => {
    const details = item.querySelector('.job-details');
    const btn = item.querySelector('.view-details-btn');
    details.classList.remove('active');
    btn.classList.remove('active');
    btn.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
  });
  
  // If this item wasn't active, open it
  if (!isActive) {
    jobDetails.classList.add('active');
    button.classList.add('active');
    button.innerHTML = 'Hide Details <i class="fas fa-chevron-down"></i>';
    
    // Smooth scroll to the item after a brief delay
    setTimeout(() => {
      jobItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
  }
}