// Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initServiceToggles();
  initSmoothScroll();
  initScrollEffects();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });
  }
}

// Service Description Toggle with Animation
function initServiceToggles() {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  
  readMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
      const serviceItem = this.closest('.service-item');
      const description = serviceItem.querySelector('.service-description');
      
      if (description.style.display === 'block') {
        description.style.display = 'none';
        this.textContent = 'Read More';
        this.setAttribute('aria-expanded', 'false');
      } else {
        description.style.display = 'block';
        this.textContent = 'Read Less';
        this.setAttribute('aria-expanded', 'true');
        
        // Smooth scroll to keep the content visible
        setTimeout(() => {
          serviceItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#' && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Scroll Effects - Header Background
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Trigger on load
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
}

// Helper function for toggling descriptions (backward compatibility)
function toggleDescription(id) {
  const el = document.getElementById(id);
  const button = event.target;
  
  if (el.style.display === 'block') {
    el.style.display = 'none';
    button.textContent = 'Read More';
  } else {
    el.style.display = 'block';
    button.textContent = 'Read Less';
  }
}

// Animation on Scroll for Service Items
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe service items for animation
document.addEventListener('DOMContentLoaded', function() {
  const serviceItems = document.querySelectorAll('.service-item');
  
  serviceItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
});
