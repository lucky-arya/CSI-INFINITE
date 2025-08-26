// Function to handle the navigation menu toggle
document.addEventListener("DOMContentLoaded", () => {
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
        const img = document.createElement("img");
        img.src = `https://flagcdn.com/w40/${country.code}.png`;
        img.alt = `${country.name} Flag`;
        img.loading = "lazy";
        track.appendChild(img);
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
fetch("activities.json")
  .then((res) => res.json())
  .then((data) => {
    const linkedinContainer = document.getElementById("linkedin-posts");
    const eventsContainer = document.getElementById("events");

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "activity-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="activity-image">
        <div class="activity-content">
          <h4 class="activity-title">${item.title}</h4>
          <p class="activity-description">${item.description}</p>
          <a href="${item.link}" target="_blank" class="activity-link">
            ${item.type === "event" ? "Join Now →" : "Read More →"}
          </a>
        </div>
      `;

      if (item.type === "post") {
        linkedinContainer.appendChild(card);
      } else if (item.type === "event") {
        eventsContainer.appendChild(card);
      }
    });
  })
  .catch((err) => console.error("Error loading activities:", err));

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
