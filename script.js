// Function to handle the navigation menu toggle and Hero Slider

document.addEventListener('DOMContentLoaded', function () {

  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLinksList = document.querySelectorAll(".nav-links a");
  const body = document.body;

  mobileMenuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    body.classList.toggle("menu-open");
  });

  // Close menu when a link is clicked
  navLinksList.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      body.classList.remove("menu-open");
    });
  });



  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const leftArrow = document.querySelector('.slider-arrow.left');
  const rightArrow = document.querySelector('.slider-arrow.right');
  const headline = document.querySelector('.headline');
  const subheadline = document.querySelector('.subheadline');
  const ctaGroup = document.querySelector('.cta-group');
  const rating = document.querySelector('.rating');
  let currentSlide = 0;
  let slideInterval;

  const headlines = [
    "Connect. Secure. Inspire.",
    "Protecting Digital India.",
    "Your Cyber Shield.",
    "Innovate. Secure. Thrive."
  ];

  const charSpeed = 100;
  const imageTransitionDuration = 1200;
  const pauseBeforeNextSlide = 3000; // 3 seconds between slides

  function resetContent() {
    headline.textContent = '';
    subheadline.classList.remove('show');
    ctaGroup.classList.remove('show');
    rating.classList.remove('show');

    headline.style.animation = 'none';
    void headline.offsetWidth;
  }

  function animateContent(index) {
    setTimeout(() => {
      const text = headlines[index];
      const typingDuration = text.length * charSpeed;

      headline.textContent = text;
      headline.style.animation = `typing ${typingDuration / 1000}s steps(${text.length}) forwards, blink-caret .75s step-end infinite`;

      const delay = typingDuration;
      setTimeout(() => {
        subheadline.classList.add('show');
      }, delay);
      setTimeout(() => {
        ctaGroup.classList.add('show');
      }, delay + 300);
      setTimeout(() => {
        rating.classList.add('show');
      }, delay + 500);
    }, 200);
  }

  function showSlide(index) {
    resetContent();

    // Keep current slide as background during transition
    if (slides[currentSlide]) {
      slides[currentSlide].classList.remove('active');
      slides[currentSlide].classList.add('current-bg');
    }

    // Remove active class from all other slides
    slides.forEach((slide, i) => {
      if (i !== currentSlide && i !== index) {
        slide.classList.remove('active', 'current-bg');
      }
    });

    // Add active class to new slide (it will slide over the background)
    slides[index].classList.add('active');

    // After transition completes, clean up background class
    setTimeout(() => {
      slides.forEach(slide => {
        slide.classList.remove('current-bg');
      });
    }, 1000); // Match the CSS transition duration

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');

    animateContent(index);
    currentSlide = index;
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  }

  function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) prev = slides.length - 1;
    showSlide(prev);
  }

  function startSlideshow() {
    clearInterval(slideInterval);
    const currentTextLength = headlines[currentSlide].length;
    const totalAnimationTime = (currentTextLength * charSpeed) + imageTransitionDuration;
    
    // Auto slide every 5 seconds (5000ms) for better viewing experience
    slideInterval = setInterval(nextSlide, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', function () {
      clearInterval(slideInterval);
      showSlide(parseInt(this.getAttribute('data-index')));
      startSlideshow();
    });
  });

  leftArrow.addEventListener('click', function () {
    clearInterval(slideInterval);
    prevSlide();
    startSlideshow();
  });

  rightArrow.addEventListener('click', function () {
    clearInterval(slideInterval);
    nextSlide();
    startSlideshow();
  });

  const slider = document.querySelector('.hero-slider');
  slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });

  slider.addEventListener('mouseleave', () => {
    startSlideshow();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      clearInterval(slideInterval);
      prevSlide();
      startSlideshow();
    } else if (e.key === 'ArrowRight') {
      clearInterval(slideInterval);
      nextSlide();
      startSlideshow();
    }
  });

  // Initialize first slide to ensure no white background
  slides[0].classList.add('active');
  dots[0].classList.add('active');
  animateContent(0);
  
  startSlideshow();
});




// Add this CSS to your styles.css to prevent body scrolling when menu is open
/*
body.menu-open {
    overflow: hidden;
}
*/

// Existing scroll-based header effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Fade-in on scroll (IntersectionObserver)
// const faders = document.querySelectorAll(".fade-in");
// const appearOptions = {
//   threshold: 0.2,
// };
// const appearOnScroll = new IntersectionObserver((entries, observer) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add("visible");
//     }
//   });
// }, appearOptions);

// faders.forEach((fader) => {
//   appearOnScroll.observe(fader);
// });

const countries = [
  { code: "in", name: "India" },
  { code: "sg", name: "Singapore" },
  { code: "ng", name: "Nigeria" },
  { code: "gh", name: "Ghana" },
  { code: "ke", name: "Kenya" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "eg", name: "Egypt" },
  { code: "za", name: "South Africa" },
  { code: "ca", name: "Canada" },
  { code: "np", name: "Nepal" },
  { code: "bd", name: "Bangladesh" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "ma", name: "Morocco" },
  { code: "et", name: "Ethiopia" },
  { code: "au", name: "Australia" },
  { code: "cm", name: "Cameroon" },
  { code: "ug", name: "Uganda" },
  { code: "lk", name: "Sri Lanka" },
  { code: "ie", name: "Ireland" },
  { code: "rw", name: "Rwanda" },
  { code: "bj", name: "Benin" },
  { code: "zw", name: "Zimbabwe" },
  { code: "fr", name: "France" },
  { code: "ph", name: "Philippines" },
  { code: "id", name: "Indonesia" },
  { code: "de", name: "Germany" },
  { code: "nl", name: "Netherlands" },
  { code: "br", name: "Brazil" },
  { code: "qa", name: "Qatar" },
  { code: "tz", name: "Tanzania" },
  { code: "my", name: "Malaysia" },
  { code: "tr", name: "Turkey" },
  { code: "mw", name: "Malawi" },
  { code: "pe", name: "Peru" },
  { code: "tn", name: "Tunisia" },
  { code: "co", name: "Colombia" },
  { code: "bh", name: "Bahrain" },
  { code: "nz", name: "New Zealand" },
  { code: "do", name: "Dominican Republic" },
  { code: "bf", name: "Burkina Faso" },
  { code: "om", name: "Oman" },
  { code: "kw", name: "Kuwait" },
  { code: "tg", name: "Togo" },
  { code: "pl", name: "Poland" },
  { code: "es", name: "Spain" },
  { code: "it", name: "Italy" },
  { code: "jp", name: "Japan" },
  { code: "mx", name: "Mexico" },
  { code: "zm", name: "Zambia" },
  { code: "jo", name: "Jordan" },
  { code: "sl", name: "Sierra Leone" },
  { code: "kh", name: "Cambodia" },
  { code: "bw", name: "Botswana" },
  { code: "ao", name: "Angola" },
  { code: "fi", name: "Finland" },
  { code: "dz", name: "Algeria" },
  { code: "ec", name: "Ecuador" },
  { code: "kg", name: "Kyrgyzstan" },
  { code: "mz", name: "Mozambique" },
  { code: "kr", name: "South Korea" },
  { code: "pt", name: "Portugal" },
  { code: "ar", name: "Argentina" },
  { code: "af", name: "Afghanistan" },
  { code: "az", name: "Azerbaijan" },
  { code: "lr", name: "Liberia" },
  { code: "th", name: "Thailand" },
  { code: "no", name: "Norway" },
  { code: "ci", name: "Ivory Coast" },
  { code: "jm", name: "Jamaica" },
  { code: "ro", name: "Romania" },
  { code: "mk", name: "North Macedonia" },
  { code: "dk", name: "Denmark" },
  { code: "mm", name: "Myanmar" },
  { code: "cl", name: "Chile" },
  { code: "gt", name: "Guatemala" },
  { code: "at", name: "Austria" },
  { code: "iq", name: "Iraq" },
  { code: "be", name: "Belgium" },
  { code: "vn", name: "Vietnam" },
  { code: "ne", name: "Niger" },
  { code: "il", name: "Israel" },
  { code: "sz", name: "Eswatini" },
  { code: "ga", name: "Gabon" },
  { code: "sn", name: "Senegal" },
  { code: "se", name: "Sweden" },
  { code: "gr", name: "Greece" },
  { code: "sd", name: "Sudan" },
  { code: "rs", name: "Serbia" },
  { code: "ls", name: "Lesotho" },
  { code: "lu", name: "Luxembourg" },
  { code: "hu", name: "Hungary" },
  { code: "td", name: "Chad" },
  { code: "sv", name: "El Salvador" },
  { code: "ch", name: "Switzerland" },
  { code: "ve", name: "Venezuela" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "uz", name: "Uzbekistan" },
  { code: "sy", name: "Syria" },
  { code: "mu", name: "Mauritius" },
  { code: "na", name: "Namibia" },
  { code: "ml", name: "Mali" },
  { code: "lb", name: "Lebanon" },
  { code: "ss", name: "South Sudan" },
  { code: "mg", name: "Madagascar" },
  { code: "pa", name: "Panama" },
  { code: "lt", name: "Lithuania" },
  { code: "ht", name: "Haiti" },
  { code: "so", name: "Somalia" },
  { code: "ua", name: "Ukraine" },
  { code: "cr", name: "Costa Rica" },
  { code: "cn", name: "China" },
  { code: "ye", name: "Yemen" },
  { code: "gn", name: "Guinea" },
  { code: "cz", name: "Czech Republic" },
  { code: "al", name: "Albania" },
  { code: "pr", name: "Puerto Rico" },
  { code: "cd", name: "DR Congo" },
  { code: "py", name: "Paraguay" },
  { code: "je", name: "Jersey" },
  { code: "xk", name: "Kosovo" },
  { code: "gm", name: "Gambia" },
  { code: "hn", name: "Honduras" },
  { code: "ly", name: "Libya" },
  { code: "ps", name: "Palestine" },
  { code: "ru", name: "Russia" },
];

const carouselTracks = document.querySelectorAll(".carousel-track");

function createFlags() {
  carouselTracks.forEach((track) => {
    // Clear any existing content
    track.innerHTML = '';
    for (let i = 0; i < 2; i++) {
      // duplicate list for smooth loop
      countries.forEach((country) => {
        // Create wrapper div for flag and tooltip
        const flagItem = document.createElement("div");
        flagItem.className = "flag-item";
        
        // Create flag image
        const img = document.createElement("img");
        img.src = `https://flagcdn.com/w40/${country.code}.png`;
        img.alt = `${country.name} Flag`;
        img.loading = "lazy";
        
        // Create tooltip
        const tooltip = document.createElement("div");
        tooltip.className = "flag-tooltip";
        tooltip.textContent = country.name;
        
        // Append elements
        flagItem.appendChild(img);
        flagItem.appendChild(tooltip);
        track.appendChild(flagItem);
      });
    }
  });
}

createFlags();


// Count up animation
function animateCountUp(el, target) {
  const duration = 3000; // 3000ms = 3 seconds
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString() + "+";

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString() + "+";
    }
  };

  window.requestAnimationFrame(step);
}

// Observer for stat-item scroll animation
const statItems = document.querySelectorAll(".stat-item");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector(".stat-number");
        const target = +entry.target.getAttribute("data-target");
        animateCountUp(numEl, target);
        entry.target.classList.add("visible");
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
statItems.forEach((item) => statObserver.observe(item));

// Activity & Media Corner
// Load LinkedIn posts dynamically
async function loadLinkedInPosts() {
  const linkedinContainer = document.getElementById("linkedin-posts");
  const loadingState = document.getElementById("linkedin-loading");
  const errorState = document.getElementById("linkedin-error");
  
  // Show loading state
  loadingState.style.display = "block";
  errorState.style.display = "none";
  linkedinContainer.innerHTML = "";
  
  try {
    // Try PHP backend first
    let response = await fetch("linkedin-feed.php");
    let result;
    
    if (response.ok) {
      result = await response.json();
    } else {
      throw new Error("PHP backend not available");
    }
    
    if (result.success && result.data) {
      displayLinkedInPosts(result.data);
      loadingState.style.display = "none";
    } else {
      throw new Error(result.error || "Failed to load posts");
    }
  } catch (error) {
    console.error("Error loading LinkedIn posts from PHP, trying fallback:", error);
    
    // Fallback to mock JSON file
    try {
      const mockResponse = await fetch("linkedin-mock.json");
      if (mockResponse.ok) {
        const mockResult = await mockResponse.json();
        if (mockResult.success && mockResult.data) {
          displayLinkedInPosts(mockResult.data);
          loadingState.style.display = "none";
          return;
        }
      }
    } catch (mockError) {
      console.error("Error loading mock data:", mockError);
    }
    
    // If everything fails, show error
    loadingState.style.display = "none";
    errorState.style.display = "block";
  }
}

function displayLinkedInPosts(posts) {
  const linkedinContainer = document.getElementById("linkedin-posts");
  
  posts.forEach(post => {
    const postCard = document.createElement("div");
    postCard.className = "linkedin-post-card";
    postCard.innerHTML = `
      <i class="fab fa-linkedin linkedin-logo"></i>
      <div class="linkedin-post-header">
        <img src="${post.author.image}" alt="${post.author.name}" class="linkedin-author-image">
        <div class="linkedin-author-info">
          <h4>${post.author.name}</h4>
          <p class="linkedin-post-time">${post.createdTime}</p>
        </div>
      </div>
      <div class="linkedin-post-content">
        ${post.text}
      </div>
      ${post.media ? `
        <div class="linkedin-post-media">
          <img src="${post.media.url}" alt="${post.media.alt}" class="linkedin-post-image" loading="lazy">
        </div>
      ` : ''}
      <div class="linkedin-post-engagement">
        <div class="engagement-item">
          <i class="far fa-thumbs-up"></i>
          <span>${post.engagement.likes}</span>
        </div>
        <div class="engagement-item">
          <i class="far fa-comment"></i>
          <span>${post.engagement.comments}</span>
        </div>
        <div class="engagement-item">
          <i class="fas fa-share"></i>
          <span>${post.engagement.shares}</span>
        </div>
      </div>
    `;
    
    // Add click handler to open LinkedIn post
    postCard.addEventListener('click', () => {
      window.open(post.url, '_blank');
    });
    
    postCard.style.cursor = 'pointer';
    linkedinContainer.appendChild(postCard);
  });
}

// Load activities from JSON for events
fetch("activities.json")
  .then((res) => res.json())
  .then((data) => {
    const eventsContainer = document.getElementById("events");

    data.forEach((item) => {
      if (item.type === "event") {
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="activity-image">
          <div class="activity-content">
            <h4 class="activity-title">${item.title}</h4>
            <p class="activity-description">${item.description}</p>
            <a href="${item.link}" target="_blank" class="activity-link">
              Join Now →
            </a>
          </div>
        `;
        eventsContainer.appendChild(card);
      }
    });
  })
  .catch((err) => console.error("Error loading activities:", err));

// Initialize LinkedIn posts when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadLinkedInPosts();
  
  // Refresh LinkedIn posts every 5 minutes
  setInterval(loadLinkedInPosts, 5 * 60 * 1000);
});

const mediaData = {
  live: [
    {
      title: "Cyber Awareness Webinar",
      desc: "A deep dive into cybersecurity basics.",
      yt: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Advanced Threat Detection",
      desc: "Learn how to identify cyber threats effectively.",
      yt: "https://www.youtube.com/embed/ScMzIvxBSi4",
    },
    {
      title: "Cyber Awareness Webinar",
      desc: "A deep dive into cybersecurity basics.",
      yt: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Advanced Threat Detection",
      desc: "Learn how to identify cyber threats effectively.",
      yt: "https://www.youtube.com/embed/ScMzIvxBSi4",
    },
  ],
  podcasts: [
    {
      title: "Staying Safe Online",
      desc: "Tips for protecting your personal data.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
    {
      title: "Cybersecurity Myths",
      desc: "Debunking common security misconceptions.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
    {
      title: "Staying Safe Online",
      desc: "Tips for protecting your personal data.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
    {
      title: "Cybersecurity Myths",
      desc: "Debunking common security misconceptions.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
  ],
  article: [
    {
      title: "Hackathon 2025",
      desc: "Highlights from our latest event.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
    {
      title: "Team Meet",
      desc: "Our global community meet-up.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
    {
      title: "Hackathon 2025",
      desc: "Highlights from our latest event.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
    {
      title: "Team Meet",
      desc: "Our global community meet-up.",
      img: "https://via.placeholder.com/300x180",
      link: "#",
    },
  ],
};
const mediaGrid = document.getElementById("mediaGrid");
const tabs = document.querySelectorAll(".media-tab");

function loadMedia(type) {
  mediaGrid.innerHTML = "";
  setTimeout(() => {
    mediaData[type].forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("media-card");

      if (type === "live") {
        card.innerHTML = `
          <iframe src="${item.yt}" frameborder="0" allowfullscreen></iframe>
          <div class="media-content">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
          </div>
        `;
      } else {
        card.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div class="media-content">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <a href="${item.link}" class="media-btn">${type === "article" ? "Read More" : "Listen Now"}</a>
          </div>
        `;
      }
      mediaGrid.appendChild(card);
      setTimeout(() => card.classList.add("show"), index * 150);
    });
  }, 100);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelector(".media-tab.active").classList.remove("active");
    tab.classList.add("active");
    loadMedia(tab.dataset.type);
  });
});
loadMedia("live");

// Reviews Slider
const track = document.querySelector(".reviews-track");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let cards = document.querySelectorAll(".review-card");

// Clone cards for infinite loop illusion
const clonedCards = [];
cards.forEach((card) => {
  clonedCards.push(card.cloneNode(true));
});
clonedCards.forEach((card) => {
  track.appendChild(card);
  track.insertBefore(card.cloneNode(true), track.firstChild);
});

cards = document.querySelectorAll(".review-card"); // Update the list after cloning
let index = cards.length / 3;
let cardWidth = cards[0].offsetWidth + 20;

const updateTrackPosition = () => {
  cardWidth = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(${-index * cardWidth}px)`;
};
updateTrackPosition();

function moveSlider(direction) {
  index += direction;
  track.style.transition = "transform 0.4s ease";
  updateTrackPosition();

  track.addEventListener(
    "transitionend",
    () => {
      if (index <= 0) {
        index = cards.length / 3;
        track.style.transition = "none";
        updateTrackPosition();
      }
      if (index >= cards.length - cards.length / 3) {
        index = cards.length / 3 - 1;
        track.style.transition = "none";
        updateTrackPosition();
      }
    },
    { once: true },
  );
}

nextBtn.addEventListener("click", () => moveSlider(1));
prevBtn.addEventListener("click", () => moveSlider(-1));

setInterval(() => {
  moveSlider(1);
}, 4000);

window.addEventListener("resize", () => {
  updateTrackPosition();
});

// Help Section
const helpItems = document.querySelectorAll(".help-item");
const helpDescriptions = document.querySelectorAll(".help-description");

helpItems.forEach((item) => {
  item.addEventListener("click", () => {
    helpItems.forEach((i) => i.classList.remove("active"));
    helpDescriptions.forEach((desc) => desc.classList.remove("active"));

    item.classList.add("active");
    document.getElementById(item.dataset.help).classList.add("active");
  });
});

// Contact Form with Cloudflare Turnstile reCAPTCHA
let turnstileVerified = false;

// Turnstile callback function
window.onTurnstileSuccess = function(token) {
  turnstileVerified = true;
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('submitBtn').style.opacity = '1';
  document.getElementById('submitBtn').style.cursor = 'pointer';
};

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!turnstileVerified) {
        showMessage('Please complete the CAPTCHA verification.', 'error');
        return;
      }
      
      // Disable submit button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      submitBtn.style.opacity = '0.7';
      
      try {
        const formData = new FormData(contactForm);
        
        const response = await fetch('submit-contact.php', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.text();
        
        if (response.ok && result === 'Success') {
          showMessage('Thank you for your message! We will get back to you soon.', 'success');
          contactForm.reset();
          turnstileVerified = false;
          // Reset Turnstile widget
          if (window.turnstile) {
            window.turnstile.reset();
          }
        } else {
          showMessage(result || 'An error occurred while sending your message.', 'error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showMessage('An error occurred while sending your message. Please try again.', 'error');
      }
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      submitBtn.style.opacity = '1';
    });
  }
});

// Message display function
function showMessage(message, type) {
  // Remove existing message if any
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  
  // Add styles
  messageDiv.style.cssText = `
    padding: 15px;
    margin: 15px 0;
    border-radius: 5px;
    font-weight: 500;
    text-align: center;
    transition: all 0.3s ease;
    ${type === 'success' 
      ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
      : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
    }
  `;
  
  // Insert message after the form
  const contactForm = document.getElementById('contactForm');
  contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
  
  // Auto-remove success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.remove();
          }
        }, 300);
      }
    }, 5000);
  }
}
