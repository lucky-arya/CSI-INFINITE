document.addEventListener('DOMContentLoaded', () => {
  loadTeamData();
  loadCoreTeam();
});

async function loadTeamData() {
  try {
    const res = await fetch('team-data.json');
    if (!res.ok) throw new Error('Could not fetch team-data.json');
    const data = await res.json();

    // combine founder + team so the founder appears first in the simple grid
    const members = [];
    if (data.founder) members.push({
      name: data.founder.name,
      role: data.founder.role,
      image: data.founder.image,
      social: data.founder.social || {}
    });
    if (Array.isArray(data.team)) members.push(...data.team);

    renderTeamGrid(members);

    // Render speakers if present
    if (Array.isArray(data.speakers) && data.speakers.length > 0) {
      renderSpeakers(data.speakers);
      const speakersSection = document.getElementById('speakers-section');
      if (speakersSection) speakersSection.style.display = '';
    }
  } catch (err) {
    console.error('Error loading team data:', err);
    const grid = document.getElementById('team-grid');
    if (grid) grid.innerHTML = '<p style="color:#6c757d">Failed to load team members.</p>';
  }
}

function renderTeamGrid(members) {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  const cards = members.map(member => {
    const linkedin = member.social && member.social.linkedin ? member.social.linkedin : '';
    // Use a fallback image if path is missing (optional)
    const src = member.image || 'https://via.placeholder.com/320x320?text=CSI';

    // sanitize (basic) to avoid breaking markup; in a production app use proper sanitization
    const safeName = escapeHtml(member.name || '');
    const safeRole = escapeHtml(member.role || '');

    return `
      <div class="team-card" role="article">
        <img class="avatar" src="${src}" alt="${safeName}" loading="lazy" />
        <div class="member-name">${safeName}</div>
        <div class="member-role">${safeRole}</div>
        <div>
          ${linkedin ? `<a class="social-link" href="${linkedin}" target="_blank" rel="noopener" aria-label="${safeName} LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cards;
}

function renderSpeakers(speakers) {
  const grid = document.getElementById('speakers-grid');
  if (!grid) return;

  const cards = speakers.map(speaker => {
    const linkedin = speaker.social && speaker.social.linkedin ? speaker.social.linkedin : '';
    const src = speaker.image || 'https://via.placeholder.com/320x320?text=Speaker';
    const safeName = escapeHtml(speaker.name || '');
    // Ensure role displays "Speaker" (fallback)
    const safeRole = escapeHtml(speaker.role || 'Speaker');

    return `
      <div class="team-card" role="article">
        <img class="avatar" src="${src}" alt="${safeName}" loading="lazy" />
        <div class="member-name">${safeName}</div>
        <div class="member-role">${safeRole}</div>
        <div>
          ${linkedin ? `<a class="social-link" href="${linkedin}" target="_blank" rel="noopener" aria-label="${safeName} LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cards;
}

async function loadCoreTeam() {
  try {
    const res = await fetch('core-team.json');
    if (!res.ok) throw new Error('Could not fetch core-team.json');
    const data = await res.json();
    
    if (Array.isArray(data.members) && data.members.length > 0) {
      renderCoreTeam(data.members);
      const coreTeamSection = document.getElementById('core-team-section');
      if (coreTeamSection) coreTeamSection.style.display = 'block';
    }
  } catch (err) {
    console.error('Error loading core team data:', err);
    const grid = document.getElementById('core-team-grid');
    if (grid) grid.innerHTML = '<p style="color:#6c757d">Failed to load core team members.</p>';
  }
}

function renderCoreTeam(members) {
  const grid = document.getElementById('core-team-grid');
  if (!grid) return;

  const cards = members.map(member => {
    const linkedin = member.social && member.social.linkedin ? member.social.linkedin : '';
    const src = member.image || 'https://via.placeholder.com/320x320?text=Team';
    
    const safeName = escapeHtml(member.name || '');
    const safeRole = escapeHtml(member.role || '');
    const safeBio = escapeHtml(member.bio || '');

    return `
      <div class="team-card" role="article">
        <img class="avatar square-avatar" src="${src}" alt="${safeName}" loading="lazy" />
        <div class="member-name">${safeName}</div>
        <div class="member-role">${safeRole}</div>
        ${safeBio ? `<p class="member-bio">${safeBio}</p>` : ''}
        <div>
          ${linkedin ? `<a class="social-link" href="${linkedin}" target="_blank" rel="noopener" aria-label="${safeName} LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cards;
}

// simple HTML-escape helper
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}