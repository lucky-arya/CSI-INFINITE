// About Page - Load Team Data Dynamically
document.addEventListener('DOMContentLoaded', function() {
  loadTeamData();
});

async function loadTeamData() {
  try {
    const response = await fetch('team-data.json');
    const data = await response.json();
    
    // Load Founder Section
    loadFounder(data.founder);
    
    // Load Team Members
    loadTeamMembers(data.team);
    
    // Load Mentors and Speakers
    loadMentors(data.mentors);
    
  } catch (error) {
    console.error('Error loading team data:', error);
  }
}

function loadFounder(founder) {
  const founderSection = document.getElementById('founder-section');
  
  const founderHTML = `
    <div class="ceo-profile-inner">
      <div class="ceo-image">
        <span class="role-badge">${founder.role}</span>
        <img src="${founder.image}" alt="${founder.name}" loading="lazy" />
      </div>
      <div class="ceo-content">
        <h3>${founder.name}</h3>
        <p class="ceo-bio">${founder.bio}</p>
        <div class="social-links">
          <a href="${founder.social.linkedin}" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  `;
  
  founderSection.innerHTML = founderHTML;
}

function loadTeamMembers(team) {
  const teamList = document.getElementById('team-members-list');
  let teamHTML = '';
  
  team.forEach((member, index) => {
    teamHTML += `
      <div class="director-item">
        <div class="director-photo">
          <span class="role-tag">${member.role}</span>
          <img src="${member.image}" alt="${member.name}" loading="lazy" />
        </div>
        <div class="director-details">
          <h3>${member.name}</h3>
          <p>${member.bio}</p>
          <div class="social-links" style="margin-top: 16px;">
            <a href="${member.social.linkedin}" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  });
  
  teamList.innerHTML = teamHTML;
}

function loadMentors(mentors) {
  const mentorsList = document.getElementById('mentors-list');
  let mentorsHTML = '';
  
  mentors.forEach((mentor, index) => {
    mentorsHTML += `
      <div class="director-item">
        <div class="director-photo">
          <span class="role-tag">${mentor.organization}</span>
          <img src="${mentor.image}" alt="${mentor.name}" loading="lazy" />
        </div>
        <div class="director-details">
          <h3>${mentor.name}</h3>
          <p>${mentor.bio}</p>
          <div class="social-links" style="margin-top: 16px;">
            <a href="${mentor.social.linkedin}" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  });
  
  mentorsList.innerHTML = mentorsHTML;
}
