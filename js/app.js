const sampleResumeData = {
  fn: 'Govind',
  ln: 'Dangi',
  title: 'Senior Software Engineer',
  email: 'govinddangi5811@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bhopal, India',
  linkedin: 'linkedin.com/in/govinddangi',
  github: 'github.com/govinddangi',
  summary: 'Results-driven Senior Software Engineer with over 5 years of experience in designing and developing scalable web applications. Proven track record of optimizing database queries and spearheading team initiatives to improve application performance by 35%. Dedicated to writing clean, maintainable code and collaborating with cross-functional teams to deliver high-quality software solutions.',
  techSkills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'HTML5/CSS3', 'PostgreSQL', 'Docker', 'AWS', 'RESTful APIs', 'Git'],
  softSkills: ['Team Leadership', 'Project Management', 'Agile Methodology', 'Problem Solving', 'Effective Communication'],
  exps: [
    {
      title: 'Senior Full Stack Engineer',
      company: 'TechSolutions India',
      start: 'Jun 2022',
      end: 'Present',
      loc: 'Bhopal, India',
      type: 'Full-time',
      desc: '• Spearheaded the development of a real-time analytics dashboard serving over 50,000 active users, resulting in a 25% increase in user engagement.\n• Optimized database query execution plans in PostgreSQL, reducing average API response latency by 120ms (30% speedup).\n• Led a team of 4 junior developers, implementing code review guidelines and modern CI/CD pipelines to cut release deployment times by half.'
    },
    {
      title: 'Software Developer',
      company: 'Innovate Digital Corp',
      start: 'Jan 2020',
      end: 'May 2022',
      loc: 'Remote',
      type: 'Full-time',
      desc: '• Engineered and deployed a responsive microservices-based billing engine using Node.js and AWS Lambda, managing $10k+ in daily transactions.\n• Collaborated with UX designers to refactor frontend web components, increasing PageSpeed scores from 65 to 92.\n• Refined search functionalities, using indexing strategies to improve search performance for over 1M records.'
    }
  ],
  edus: [
    {
      deg: 'B.Tech in Computer Science & Engineering',
      inst: 'PIEMR Indore',
      start: '2016',
      end: '2020',
      gpa: '8.4/10',
      course: 'Data Structures, Database Management Systems, Computer Networks, Software Engineering'
    }
  ],
  certs: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (2024)'
    },
    {
      name: 'React Advanced Certification',
      issuer: 'Meta (2022)'
    }
  ],
  projs: [
    {
      name: 'ResumeCraft AI Builder',
      tech: 'HTML5, CSS3, JavaScript, PDF.js',
      desc: 'Built a client-side offline-first ATS resume editor featuring live score parsing and custom rendering.',
      url: 'github.com/govinddangi/resumecraft',
      year: '2025'
    }
  ],
  langs: 'English (Professional), Hindi (Native)',
  hobbies: 'Competitive Programming, Tech Blogging, Playing Chess',
  achievements: '• Winner of Bhopal Hackathon 2023 out of 100+ competing teams.\n• Solved 500+ algorithmic challenges on LeetCode.',
  customEnabled: true,
  customTitle: 'Volunteering',
  customBody: '• Technical Mentor at CodeForGood, guiding 15+ underprivileged students in web programming basics.'
};

// Core Application State
let resumeData = {
  fn: '',
  ln: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  techSkills: [],
  softSkills: [],
  exps: [],
  edus: [],
  certs: [],
  projs: [],
  langs: '',
  hobbies: '',
  achievements: '',
  customEnabled: false,
  customTitle: '',
  customBody: ''
};

// Layout Design Styles State
let styleSettings = {
  template: 'classic',
  font: 'dm-sans',
  accentColor: '#6d5dfc',
  margins: 'normal',
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certs', 'extras', 'custom']
};

let currentStep = 1;
let expCounter = 0;
let eduCounter = 0;
let projCounter = 0;
let certCounter = 0;

// On Page Load
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved theme first
  const savedTheme = localStorage.getItem('rc_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleButtons(savedTheme);

  await AIConfig.load();
  loadDataFromLocalStorage();
  setupEventListeners();
  renderLandingPreviews();
  
  // Set default form values in HTML based on loaded settings
  document.getElementById('style-select-template').value = styleSettings.template;
  document.getElementById('style-select-font').value = styleSettings.font;
  document.getElementById('style-color-accent').value = styleSettings.accentColor;
  document.getElementById('style-select-margins').value = styleSettings.margins;
});

/**
 * Sync form inputs from local storage to actual DOM inputs
 */
function loadDataFromLocalStorage() {
  const savedData = localStorage.getItem('rc_resume_data');
  const savedStyles = localStorage.getItem('rc_style_settings');
  const emptyIntent = localStorage.getItem('rc_resume_empty_intent') === 'true';

  if (savedData) {
    try {
      resumeData = JSON.parse(savedData);
    } catch(e) { console.error('Failed to parse saved resume data', e); }
  }

  // If the resumeData is empty and the user has not explicitly cleared the form,
  // load the sample resume data automatically.
  const isEmpty = !resumeData.fn && !resumeData.ln && (!resumeData.exps || resumeData.exps.length === 0) && (!resumeData.edus || resumeData.edus.length === 0);
  if (isEmpty && !emptyIntent) {
    resumeData = JSON.parse(JSON.stringify(sampleResumeData));
  }
  if (savedStyles) {
    try {
      styleSettings = JSON.parse(savedStyles);
    } catch(e) { console.error('Failed to parse saved design styles', e); }
  }

  // Pre-fill primary fields
  document.getElementById('input-fn').value = resumeData.fn || '';
  document.getElementById('input-ln').value = resumeData.ln || '';
  document.getElementById('input-title').value = resumeData.title || '';
  document.getElementById('input-email').value = resumeData.email || '';
  document.getElementById('input-phone').value = resumeData.phone || '';
  document.getElementById('input-location').value = resumeData.location || '';
  document.getElementById('input-linkedin').value = resumeData.linkedin || '';
  document.getElementById('input-github').value = resumeData.github || '';
  document.getElementById('input-summary').value = resumeData.summary || '';
  document.getElementById('input-langs').value = resumeData.langs || '';
  document.getElementById('input-hobbies').value = resumeData.hobbies || '';
  document.getElementById('input-achievements').value = resumeData.achievements || '';
  
  // Custom section state
  document.getElementById('custom-section-toggle').checked = resumeData.customEnabled || false;
  document.getElementById('input-custom-title').value = resumeData.customTitle || '';
  document.getElementById('input-custom-body').value = resumeData.customBody || '';
  toggleCustomSection(false); // Update display state silently

  // Dynamic cards loading
  const expContainer = document.getElementById('experience-list');
  expContainer.innerHTML = '';
  expCounter = 0;
  if (resumeData.exps && resumeData.exps.length > 0) {
    resumeData.exps.forEach(exp => addExperienceCard(exp));
  } else {
    addExperienceCard(); // Add default empty card
  }

  const eduContainer = document.getElementById('education-list');
  eduContainer.innerHTML = '';
  eduCounter = 0;
  if (resumeData.edus && resumeData.edus.length > 0) {
    resumeData.edus.forEach(edu => addEducationCard(edu));
  } else {
    addEducationCard(); // Add default empty card
  }

  const projContainer = document.getElementById('projects-list');
  projContainer.innerHTML = '';
  projCounter = 0;
  if (resumeData.projs && resumeData.projs.length > 0) {
    resumeData.projs.forEach(proj => addProjectCard(proj));
  }

  const certContainer = document.getElementById('certs-list');
  certContainer.innerHTML = '';
  certCounter = 0;
  if (resumeData.certs && resumeData.certs.length > 0) {
    resumeData.certs.forEach(cert => addCertCard(cert));
  }

  // Tags loading
  renderSkillsTags('tech');
  renderSkillsTags('soft');

  // Initial resume rendering
  renderResumeCanvas();
  updateLiveATSScore();
}

/**
 * Configure DOM event hooks
 */
function setupEventListeners() {
  // Drag and drop JSON parsing setup
  const dropZone = document.getElementById('json-drop-zone');
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      processJSONFile(files[0]);
    }
  });

  // Checker Drag & Drop File Setup
  const checkerDropZone = document.getElementById('checker-file-drop-zone');
  if (checkerDropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      checkerDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        checkerDropZone.style.borderColor = 'var(--accent-color)';
        checkerDropZone.style.backgroundColor = 'var(--bg-card-hover)';
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      checkerDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        checkerDropZone.style.borderColor = 'var(--border-color)';
        checkerDropZone.style.backgroundColor = 'var(--bg-card)';
      }, false);
    });

    checkerDropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        processCheckerFile(files[0]);
      }
    });

    checkerDropZone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        document.getElementById('checker-file-input').click();
      }
    });
  }

  // Track descriptions to run real-time local verb optimizations
  document.getElementById('input-summary').addEventListener('blur', (e) => {
    runLocalOptimizations(e.target.value, 'Professional Summary');
  });
}

/**
 * Save current state variables to local storage
 */
function saveStateToLocalStorage() {
  localStorage.setItem('rc_resume_data', JSON.stringify(resumeData));
  localStorage.setItem('rc_style_settings', JSON.stringify(styleSettings));
}

/* ==========================================
   ROUTING AND STEPPER NAVIGATION
   ========================================== */
function showView(viewName) {
  const landing = document.getElementById('landing-page');
  const builder = document.getElementById('builder-app');
  const checker = document.getElementById('ats-checker-view');

  landing.classList.replace('view-active', 'view-hidden');
  builder.classList.replace('view-active', 'view-hidden');
  checker.classList.replace('view-active', 'view-hidden');

  if (viewName === 'landing') {
    landing.classList.replace('view-hidden', 'view-active');
  } else if (viewName === 'builder') {
    builder.classList.replace('view-hidden', 'view-active');
    renderResumeCanvas();
    updateLiveATSScore();
  } else if (viewName === 'checker') {
    checker.classList.replace('view-hidden', 'view-active');
  }
}

function startBuilder(preselectedTemplate) {
  if (preselectedTemplate) {
    styleSettings.template = preselectedTemplate;
    document.getElementById('style-select-template').value = preselectedTemplate;
    saveStateToLocalStorage();
    renderResumeCanvas();
  }
  
  showView('builder');
  navigateToStep(1);
}

function goLanding() {
  showView('landing');
}

function navigateToStep(stepNum) {
  currentStep = stepNum;
  
  // Hide all panels, show target step
  for (let i = 1; i <= 5; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    const btn = document.getElementById(`btn-step${i}`);
    
    panel.classList.remove('active');
    btn.classList.remove('active');
    
    if (i < currentStep) {
      btn.classList.add('done');
    } else {
      btn.classList.remove('done');
    }
  }

  document.getElementById(`step-panel-${stepNum}`).classList.add('active');
  document.getElementById(`btn-step${stepNum}`).classList.add('active');

  // Update nav buttons
  document.getElementById('form-nav-prev').style.visibility = stepNum === 1 ? 'hidden' : 'visible';
  document.getElementById('form-nav-next').textContent = stepNum === 5 ? 'Done ✓' : 'Continue →';
  document.getElementById('current-step-label').textContent = stepNum;
}

function changeStep(direction) {
  const target = currentStep + direction;
  if (target >= 1 && target <= 5) {
    navigateToStep(target);
  } else if (target === 6) {
    // Done: scroll to live preview sheet and notify
    const previewArea = document.querySelector('.live-preview-section');
    previewArea.scrollIntoView({ behavior: 'smooth' });
    showToast('Success', 'Form completed! Review your resume styling and click Download PDF.', 'success');
  }
}

/* ==========================================
   DYNAMIC FORM COMPILATION
   ========================================== */
function updateResumeState() {
  // Collect base fields
  resumeData.fn = document.getElementById('input-fn').value;
  resumeData.ln = document.getElementById('input-ln').value;
  resumeData.title = document.getElementById('input-title').value;
  resumeData.email = document.getElementById('input-email').value;
  resumeData.phone = document.getElementById('input-phone').value;
  resumeData.location = document.getElementById('input-location').value;
  resumeData.linkedin = document.getElementById('input-linkedin').value;
  resumeData.github = document.getElementById('input-github').value;
  resumeData.summary = document.getElementById('input-summary').value;
  resumeData.langs = document.getElementById('input-langs').value;
  resumeData.hobbies = document.getElementById('input-hobbies').value;
  resumeData.achievements = document.getElementById('input-achievements').value;
  
  // Custom section fields
  resumeData.customEnabled = document.getElementById('custom-section-toggle').checked;
  resumeData.customTitle = document.getElementById('input-custom-title').value;
  resumeData.customBody = document.getElementById('input-custom-body').value;

  // Compile Dynamic arrays
  resumeData.exps = [];
  document.querySelectorAll('#experience-list .dynamic-card').forEach(card => {
    resumeData.exps.push({
      title: card.querySelector('.exp-title').value,
      company: card.querySelector('.exp-company').value,
      start: card.querySelector('.exp-start').value,
      end: card.querySelector('.exp-end').value,
      loc: card.querySelector('.exp-loc').value,
      type: card.querySelector('.exp-type').value,
      desc: card.querySelector('.exp-desc').value
    });
  });

  resumeData.edus = [];
  document.querySelectorAll('#education-list .dynamic-card').forEach(card => {
    resumeData.edus.push({
      deg: card.querySelector('.edu-deg').value,
      inst: card.querySelector('.edu-inst').value,
      start: card.querySelector('.edu-start').value,
      end: card.querySelector('.edu-end').value,
      gpa: card.querySelector('.edu-gpa').value,
      course: card.querySelector('.edu-course').value
    });
  });

  resumeData.projs = [];
  document.querySelectorAll('#projects-list .dynamic-card').forEach(card => {
    resumeData.projs.push({
      name: card.querySelector('.proj-name').value,
      tech: card.querySelector('.proj-tech').value,
      desc: card.querySelector('.proj-desc').value,
      url: card.querySelector('.proj-url').value,
      year: card.querySelector('.proj-year').value
    });
  });

  resumeData.certs = [];
  document.querySelectorAll('#certs-list .dynamic-card').forEach(card => {
    resumeData.certs.push({
      name: card.querySelector('.cert-name').value,
      issuer: card.querySelector('.cert-issuer').value
    });
  });

  saveStateToLocalStorage();
  renderResumeCanvas();
  updateLiveATSScore();
}

/**
 * Update UI visual class tags on the Canvas element and re-render template HTML
 */
function renderResumeCanvas() {
  const canvas = document.getElementById('resume-canvas');
  
  // Apply design classes
  canvas.className = 'resume-paper';
  canvas.classList.add(`margin-${styleSettings.margins}`);
  canvas.classList.add(`font-${styleSettings.font}`);
  
  // Set global dynamic values
  canvas.style.setProperty('--accent-theme', styleSettings.accentColor);

  // Render Template markup
  canvas.innerHTML = ResumeTemplates.render(styleSettings.template, resumeData, styleSettings);
}

/* ==========================================
   DYNAMIC LIST BUILDERS (ADD/REMOVE INLINE)
   ========================================== */
function addExperienceCard(data = null) {
  expCounter++;
  const id = `exp-card-${expCounter}`;
  const html = `
    <div class="dynamic-card" id="${id}">
      <div class="card-actions-header">
        <h4>Experience #${expCounter}</h4>
        <button class="remove-card-btn" onclick="removeDynamicCard('${id}')">Remove</button>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Job Title *</label>
          <input type="text" class="exp-title" placeholder="e.g. Senior Developer" value="${data ? data.title : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>Company / Organization *</label>
          <input type="text" class="exp-company" placeholder="e.g. Google Inc." value="${data ? data.company : ''}" oninput="updateResumeState()">
        </div>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Start Date</label>
          <input type="text" class="exp-start" placeholder="e.g. Jun 2022" value="${data ? data.start : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>End Date</label>
          <input type="text" class="exp-end" placeholder="e.g. Present" value="${data ? data.end : ''}" oninput="updateResumeState()">
        </div>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Location</label>
          <input type="text" class="exp-loc" placeholder="e.g. Bhopal, India" value="${data ? data.loc : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>Job Type</label>
          <select class="exp-type" onchange="updateResumeState()">
            <option ${data && data.type === 'Full-time' ? 'selected' : ''}>Full-time</option>
            <option ${data && data.type === 'Part-time' ? 'selected' : ''}>Part-time</option>
            <option ${data && data.type === 'Contract' ? 'selected' : ''}>Contract</option>
            <option ${data && data.type === 'Internship' ? 'selected' : ''}>Internship</option>
            <option ${data && data.type === 'Freelance' ? 'selected' : ''}>Freelance</option>
          </select>
        </div>
      </div>
      <div class="input-group full-width" style="margin-top:0.75rem;">
        <label>Key Responsibilities & Achievements</label>
        <div class="summary-area-container">
          <textarea class="exp-desc" placeholder="• Led development of Core APIs serving 50k users\n• Optimized databases, improving search speeds by 30%..." oninput="updateResumeState()">${data ? data.desc : ''}</textarea>
          <button class="btn btn-sparkle" onclick="optimizeExperienceBullets('${id}')">✦ Enhance</button>
        </div>
      </div>
    </div>
  `;
  
  const container = document.getElementById('experience-list');
  container.insertAdjacentHTML('beforeend', html);
  
  // Attach blur event to track bullets local suggestions
  const card = document.getElementById(id);
  card.querySelector('.exp-desc').addEventListener('blur', (e) => {
    runLocalOptimizations(e.target.value, `Experience #${expCounter} Description`);
  });

  if (!data) updateResumeState();
}

function addEducationCard(data = null) {
  eduCounter++;
  const id = `edu-card-${eduCounter}`;
  const html = `
    <div class="dynamic-card" id="${id}">
      <div class="card-actions-header">
        <h4>Education #${eduCounter}</h4>
        <button class="remove-card-btn" onclick="removeDynamicCard('${id}')">Remove</button>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Degree / Field of Study *</label>
          <input type="text" class="edu-deg" placeholder="e.g. B.Tech Computer Science" value="${data ? data.deg : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>School / University *</label>
          <input type="text" class="edu-inst" placeholder="e.g. RGPV University" value="${data ? data.inst : ''}" oninput="updateResumeState()">
        </div>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Start Date / Year</label>
          <input type="text" class="edu-start" placeholder="e.g. 2020" value="${data ? data.start : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>End Year (or Expected)</label>
          <input type="text" class="edu-end" placeholder="e.g. 2024" value="${data ? data.end : ''}" oninput="updateResumeState()">
        </div>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>CGPA / GPA</label>
          <input type="text" class="edu-gpa" placeholder="e.g. 8.5/10 or 85%" value="${data ? data.gpa : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>Relevant Coursework</label>
          <input type="text" class="edu-course" placeholder="e.g. Data Structures, DBMS, OS" value="${data ? data.course : ''}" oninput="updateResumeState()">
        </div>
      </div>
    </div>
  `;
  document.getElementById('education-list').insertAdjacentHTML('beforeend', html);
  if (!data) updateResumeState();
}

function addProjectCard(data = null) {
  projCounter++;
  const id = `proj-card-${projCounter}`;
  const html = `
    <div class="dynamic-card" id="${id}">
      <div class="card-actions-header">
        <h4>Project #${projCounter}</h4>
        <button class="remove-card-btn" onclick="removeDynamicCard('${id}')">Remove</button>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Project Name</label>
          <input type="text" class="proj-name" placeholder="e.g. Resume Builder" value="${data ? data.name : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>Tech Stack</label>
          <input type="text" class="proj-tech" placeholder="e.g. React, Node.js, SQLite" value="${data ? data.tech : ''}" oninput="updateResumeState()">
        </div>
      </div>
      <div class="input-group full-width">
        <label>Description</label>
        <textarea class="proj-desc" placeholder="Write description or bullets about the project details..." oninput="updateResumeState()">${data ? data.desc : ''}</textarea>
      </div>
      <div class="form-grid" style="margin-top:0.75rem;">
        <div class="input-group">
          <label>Project Website / Code Link</label>
          <input type="text" class="proj-url" placeholder="e.g. github.com/username/project" value="${data ? data.url : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>Year</label>
          <input type="text" class="proj-year" placeholder="e.g. 2025" value="${data ? data.year : ''}" oninput="updateResumeState()">
        </div>
      </div>
    </div>
  `;
  document.getElementById('projects-list').insertAdjacentHTML('beforeend', html);
  if (!data) updateResumeState();
}

function addCertCard(data = null) {
  certCounter++;
  const id = `cert-card-${certCounter}`;
  const html = `
    <div class="dynamic-card" id="${id}">
      <div class="card-actions-header">
        <h4>Certification #${certCounter}</h4>
        <button class="remove-card-btn" onclick="removeDynamicCard('${id}')">Remove</button>
      </div>
      <div class="form-grid">
        <div class="input-group">
          <label>Certification Name</label>
          <input type="text" class="cert-name" placeholder="e.g. AWS Certified Solutions Architect" value="${data ? data.name : ''}" oninput="updateResumeState()">
        </div>
        <div class="input-group">
          <label>Issuer / Year</label>
          <input type="text" class="cert-issuer" placeholder="e.g. Amazon Web Services, 2024" value="${data ? data.issuer : ''}" oninput="updateResumeState()">
        </div>
      </div>
    </div>
  `;
  document.getElementById('certs-list').insertAdjacentHTML('beforeend', html);
  if (!data) updateResumeState();
}

function removeDynamicCard(id) {
  document.getElementById(id).remove();
  updateResumeState();
}

/* ==========================================
   SKILLS TAG INPUT HANDLERS
   ========================================== */
function handleSkillKey(event, type) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addSkillTag(type);
  }
}

function addSkillTag(type) {
  const input = document.getElementById(`${type}-skill-input`);
  const value = input.value.trim();
  if (!value) return;

  const targetArray = type === 'tech' ? resumeData.techSkills : resumeData.softSkills;
  
  // Split comma separated tags
  const tags = value.split(',').map(t => t.trim()).filter(Boolean);
  tags.forEach(tag => {
    if (!targetArray.includes(tag)) {
      targetArray.push(tag);
    }
  });

  input.value = '';
  renderSkillsTags(type);
  updateResumeState();
}

function removeSkillTag(type, value) {
  const targetArray = type === 'tech' ? resumeData.techSkills : resumeData.softSkills;
  const index = targetArray.indexOf(value);
  if (index > -1) {
    targetArray.splice(index, 1);
  }
  renderSkillsTags(type);
  updateResumeState();
}

function renderSkillsTags(type) {
  const container = document.getElementById(`${type}-tags-container`);
  const targetArray = type === 'tech' ? resumeData.techSkills : resumeData.softSkills;
  
  container.innerHTML = targetArray.map(tag => `
    <span class="skill-tag-pill">
      ${tag}
      <button onclick="removeSkillTag('${type}', '${tag.replace(/'/g, "\\'")}')">×</button>
    </span>
  `).join('');
}

/* ==========================================
   CUSTOM SECTION CONTROLS
   ========================================== */
function toggleCustomSection(shouldUpdateState = true) {
  const isChecked = document.getElementById('custom-section-toggle').checked;
  document.getElementById('custom-section-fields').style.display = isChecked ? 'block' : 'none';
  if (shouldUpdateState) updateResumeState();
}

/* ==========================================
   DESIGN CUSTOMIZER & PANEL CONTROLS
   ========================================== */
function onTemplateChanged() {
  styleSettings.template = document.getElementById('style-select-template').value;
  updateResumeState();
}

function onStyleSettingsChanged() {
  styleSettings.font = document.getElementById('style-select-font').value;
  styleSettings.accentColor = document.getElementById('style-color-accent').value;
  styleSettings.margins = document.getElementById('style-select-margins').value;
  updateResumeState();
}

/* ==========================================
   SECTION REORDERING LOGIC
   ========================================== */
function openReorderModal() {
  const listContainer = document.getElementById('reorder-list');
  listContainer.innerHTML = '';
  
  // Build names friendly labels mapping
  const labelsMap = {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certs: 'Certifications',
    extras: 'Additional Details',
    custom: 'Custom Section'
  };

  styleSettings.sectionOrder.forEach((sectionKey, index) => {
    if (sectionKey === 'custom' && !resumeData.customEnabled) return; // Skip if disabled
    
    const label = labelsMap[sectionKey] || sectionKey;
    const item = document.createElement('li');
    item.className = 'reorderable-item';
    item.innerHTML = `
      <span>${label}</span>
      <div class="reorder-item-actions">
        <button class="reorder-btn" onclick="moveSectionInOrder(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button class="reorder-btn" onclick="moveSectionInOrder(${index}, 1)" ${index === styleSettings.sectionOrder.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    `;
    listContainer.appendChild(item);
  });

  document.getElementById('reorder-modal').classList.add('active');
}

function closeReorderModal() {
  document.getElementById('reorder-modal').classList.remove('active');
}

function moveSectionInOrder(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < styleSettings.sectionOrder.length) {
    const temp = styleSettings.sectionOrder[index];
    styleSettings.sectionOrder[index] = styleSettings.sectionOrder[newIndex];
    styleSettings.sectionOrder[newIndex] = temp;
    
    // Refresh modal list
    openReorderModal();
  }
}

function saveSectionOrdering() {
  closeReorderModal();
  updateResumeState();
  showToast('Applied', 'Section rendering order updated.', 'success');
}

/* ==========================================
   AI API KEY CONFIGURATION MODALS
   ========================================== */


/* ==========================================
   AI TRIGGER OPERATIONS (ASYNCHRONOUS HELPER)
   ========================================== */
async function optimizeSummary() {
  const textInput = document.getElementById('input-summary');
  const originalVal = textInput.value;
  
  try {
    showToast('Optimizing', 'Enhancing professional summary...', 'info');
    const result = await AIEngine.optimizeSummary(originalVal);
    textInput.value = result;
    updateResumeState();
    showToast('Enhanced', 'Professional summary rewritten.', 'success');
  } catch (e) {
    alert(e.message);
  }
}

async function optimizeExperienceBullets(cardId) {
  const card = document.getElementById(cardId);
  const textarea = card.querySelector('.exp-desc');
  const jobTitle = card.querySelector('.exp-title').value;
  const originalVal = textarea.value;

  try {
    showToast('Optimizing', 'Enhancing work experience descriptions...', 'info');
    const result = await AIEngine.optimizeBullets(originalVal, jobTitle);
    textarea.value = result;
    updateResumeState();
    showToast('Enhanced', 'Bullet points enhanced with active verbs.', 'success');
  } catch (e) {
    alert(e.message);
  }
}

/* ==========================================
   LOCAL REWRITING INTEGRATED SCANNER HINTS
   ========================================== */
function runLocalOptimizations(text, sectionLabel) {
  // Run scan
  const tips = AIEngine.scanTextLocally(text);
  if (tips.length === 0) return;

  // Notify user with suggestions
  tips.forEach(tip => {
    // Determine title
    const header = tip.type === 'verb' ? `ATS Optimization: Verb Suggestion` : `ATS Optimization: Quantify Impact`;
    showToast(header, `<strong>In "${sectionLabel}":</strong> ${tip.message}`, 'warning', 10000);
  });
}

/* ==========================================
   BACKUP & RESTORE DATA OPERATION (JSON ENGINE)
   ========================================== */
function openImportModal() {
  document.getElementById('json-import-modal').classList.add('active');
}

function closeImportModal() {
  document.getElementById('json-import-modal').classList.remove('active');
}

function triggerFileInput() {
  document.getElementById('json-file-input').click();
}

function handleFileSelect(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processJSONFile(files[0]);
  }
}

function processJSONFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.fn && !parsed.exps) {
        throw new Error('JSON format is missing standard fields. Ensure it is a file exported from ResumeCraft.');
      }
      
      // Merge states
      if (parsed.resumeData) {
        resumeData = parsed.resumeData;
        styleSettings = parsed.styleSettings || styleSettings;
      } else {
        // Flat legacy import
        resumeData = { ...resumeData, ...parsed };
      }
      
      // Update form fields
      saveStateToLocalStorage();
      loadDataFromLocalStorage();
      closeImportModal();
      
      // Go to builder
      startBuilder();
      showToast('Loaded Successfully', 'Resume data and layout configurations loaded.', 'success');
    } catch(e) {
      alert(`Import error: ${e.message}`);
    }
  };
  reader.readAsText(file);
}

function exportJSON() {
  const wrapper = {
    resumeData,
    styleSettings
  };
  
  const blob = new Blob([JSON.stringify(wrapper, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${resumeData.fn || 'My'}_${resumeData.ln || 'Resume'}_data.json`;
  a.click();
}

/* ==========================================
   BROWSER PRINTING PIPELINE
   ========================================== */
function triggerPrint() {
  const originalCanvas = document.getElementById('resume-canvas');
  
  // Check that first name is inputted before downloading
  if (!resumeData.fn) {
    showToast('Attention Required', 'Please fill out your contact details (First Name) before saving.', 'warning');
    navigateToStep(1);
    return;
  }

  // Clone canvas container
  const printContainer = document.getElementById('print-only-container');
  printContainer.innerHTML = '';
  
  const clone = originalCanvas.cloneNode(true);
  clone.id = 'print-rendered-resume';
  printContainer.appendChild(clone);

  // Trigger print dialog
  window.print();
}

/* ==========================================
   TOASTS NOTIFIER
   ========================================== */
function showToast(header, message, type = 'info', duration = 4000) {
  const container = document.getElementById('suggestion-toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast-alert toast-${type}`;
  toast.innerHTML = `
    <div class="toast-header">
      <span>${header}</span>
      <button class="toast-close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="toast-body">${message}</div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, duration);
}

/* ==========================================
   THEME SWITCHER LOGIC
   ========================================== */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('rc_theme', newTheme);
  
  updateThemeToggleButtons(newTheme);
  showToast('Theme Updated', `Switched to ${newTheme} mode.`, 'success', 2000);
}

function updateThemeToggleButtons(theme) {
  const btnLanding = document.getElementById('theme-toggle-landing');
  const btnApp = document.getElementById('theme-toggle-app');
  const btnChecker = document.getElementById('theme-toggle-checker');
  const icon = theme === 'dark' ? '☀️' : '🌙';
  
  if (btnLanding) btnLanding.textContent = icon;
  if (btnApp) btnApp.textContent = icon;
  if (btnChecker) btnChecker.textContent = icon;
}

/* ==========================================
   LIVE ATS SCORE SYSTEM & COLLAPSIBLE PANELS
   ========================================== */
function toggleAuditPanel() {
  const drawer = document.getElementById('live-audit-checklist-drawer');
  const arrow = document.getElementById('audit-toggle-arrow');
  
  drawer.classList.toggle('active');
  
  if (drawer.classList.contains('active')) {
    arrow.textContent = '▲ Close Checklist';
  } else {
    arrow.textContent = '▼ See Checklist';
  }
}

function updateLiveATSScore() {
  if (typeof ATSScanner === 'undefined') return;
  const results = ATSScanner.evaluateResume(resumeData);
  const score = results.score;
  
  const scoreText = document.getElementById('score-text-mini');
  if (scoreText) scoreText.textContent = `${score}%`;
  
  const circle = document.getElementById('score-circle-mini-canvas');
  if (circle) {
    circle.className = 'score-circle-mini';
    if (score < 50) circle.classList.add('score-red');
    else if (score < 80) circle.classList.add('score-yellow');
    else circle.classList.add('score-green');
  }
  
  const statusText = document.getElementById('score-status-text');
  if (statusText) {
    if (score < 50) statusText.textContent = `Drafting: Needs Work (Score: ${score}%)`;
    else if (score < 80) statusText.textContent = `Good: Ready to Apply (Score: ${score}%)`;
    else statusText.textContent = `Excellent: Highly Optimized! (Score: ${score}%)`;
  }
  
  const checklistContainer = document.getElementById('live-audit-checklist-items');
  if (checklistContainer) {
    checklistContainer.innerHTML = results.checklist.map(item => {
      const icon = item.passed ? '✅' : '❌';
      return `
        <div class="audit-item ${item.passed ? 'passed' : ''}">
          <div class="audit-item-icon">${icon}</div>
          <div class="audit-item-details">
            <div class="audit-item-header-row">
              <span>${item.name}</span>
              <span>${item.pts}/${item.max} pts</span>
            </div>
            ${!item.passed ? `<div class="audit-item-tip">${item.tip}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

/* ==========================================
   EXTERNAL RESUME TEXT AUDITOR CONTROLLER
   ========================================== */
function scanPastedResume() {
  if (typeof ATSScanner === 'undefined') return;
  const textarea = document.getElementById('pasted-resume-text');
  const text = textarea.value;
  const result = ATSScanner.evaluatePastedText(text);
  
  if (result.error) {
    alert(result.error);
    return;
  }

  document.getElementById('checker-results-empty').style.display = 'none';
  document.getElementById('checker-results-loaded').style.display = 'flex';

  document.getElementById('checker-score-text').textContent = `${result.score}%`;
  
  const circle = document.getElementById('checker-score-circle');
  circle.className = 'score-circle-large';
  if (result.score < 50) circle.classList.add('score-red');
  else if (result.score < 80) circle.classList.add('score-yellow');
  else circle.classList.add('score-green');

  const gradeLabel = document.getElementById('checker-score-grade');
  const summaryLabel = document.getElementById('checker-score-summary-text');
  if (result.score < 50) {
    gradeLabel.textContent = 'Action Required';
    summaryLabel.textContent = 'This resume may be filtered out by ATS scanners. Follow the recommendations below to improve.';
  } else if (result.score < 80) {
    gradeLabel.textContent = 'Good Match';
    summaryLabel.textContent = 'Solid baseline formatting. Some structural optimizations can increase interview rates.';
  } else {
    gradeLabel.textContent = 'Excellent ATS Score!';
    summaryLabel.textContent = 'Excellent parseability, power-verb density, and metric structure. Great job!';
  }

  document.getElementById('checker-stat-verbs').textContent = result.verbCount;
  document.getElementById('checker-stat-metrics').textContent = result.metricsCount;

  const tipsContainer = document.getElementById('checker-advice-list');
  if (result.suggestions.length === 0) {
    tipsContainer.innerHTML = `
      <div class="advice-item severity-low">
        <span style="font-size:1.1rem; line-height:1;">🎯</span>
        <span>No critical issues found! Your resume template is clean, parseable, and well structured.</span>
      </div>
    `;
  } else {
    tipsContainer.innerHTML = result.suggestions.map(suggestion => `
      <li class="advice-item severity-${suggestion.severity}">
        <div style="font-weight: 700; margin-bottom: 0.15rem; color: var(--text-primary); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">${suggestion.section}</div>
        <div>${suggestion.tip}</div>
      </li>
    `).join('');
  }
}

function clearPastedResume() {
  document.getElementById('pasted-resume-text').value = '';
  document.getElementById('checker-results-empty').style.display = 'flex';
  document.getElementById('checker-results-loaded').style.display = 'none';
  const statusDiv = document.getElementById('checker-file-status');
  if (statusDiv) {
    statusDiv.style.display = 'none';
    statusDiv.textContent = '';
  }
}

/* ==========================================
   EXTERNAL CHECKS FILE PARSER ENGINES
   ========================================== */
function triggerCheckerFileInput(event) {
  event.stopPropagation();
  document.getElementById('checker-file-input').click();
}

function handleCheckerFileSelect(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processCheckerFile(files[0]);
  }
}

async function processCheckerFile(file) {
  const statusDiv = document.getElementById('checker-file-status');
  statusDiv.style.display = 'block';
  statusDiv.style.color = 'var(--accent-color)';
  statusDiv.textContent = `Extracting text from "${file.name}"... Please wait...`;

  try {
    let text = '';
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
      text = await parsePDFFile(file);
    } else if (extension === 'docx') {
      text = await parseDocxFile(file);
    } else if (extension === 'txt') {
      text = await parseTxtFile(file);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(extension)) {
      text = await parseImageFile(file);
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, TXT, or Image files.');
    }

    if (!text || text.trim().length < 10) {
      throw new Error('Could not extract any substantial text from the file.');
    }

    document.getElementById('pasted-resume-text').value = text;
    statusDiv.style.color = 'var(--accent-success)';
    statusDiv.textContent = `Successfully extracted text from "${file.name}"!`;
    
    // Automatically trigger scan
    scanPastedResume();
  } catch (err) {
    console.error(err);
    statusDiv.style.color = 'var(--accent-danger)';
    statusDiv.textContent = `Error: ${err.message}`;
  }
}

// 1. PDF Parser via PDF.js
async function parsePDFFile(file) {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('PDF.js library is not loaded. Check your internet connection.');
  }
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(' ') + '\n';
  }
  return text;
}

// 2. DOCX Parser via Mammoth.js
async function parseDocxFile(file) {
  if (typeof mammoth === 'undefined') {
    throw new Error('Mammoth.js library is not loaded. Check your internet connection.');
  }
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// 3. Plain Text Parser
async function parseTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

// 4. Image Parser via Tesseract.js (OCR)
async function parseImageFile(file) {
  if (typeof Tesseract === 'undefined') {
    throw new Error('Tesseract.js OCR library is not loaded. Check your internet connection.');
  }
  const result = await Tesseract.recognize(file, 'eng');
  return result.data.text;
}

/* ==========================================
   SAMPLE DATA LOADER & FORM RESET CONTROLLER
   ========================================== */
function loadSampleData() {
  if (confirm('Load sample professional data? This will overwrite your current inputs.')) {
    resumeData = JSON.parse(JSON.stringify(sampleResumeData));
    localStorage.removeItem('rc_resume_empty_intent');
    saveStateToLocalStorage();
    loadDataFromLocalStorage();
    showToast('Loaded Successfully', 'Sample professional resume data loaded.', 'success');
  }
}

function clearForm() {
  if (confirm('Are you sure you want to reset the form? All details will be cleared.')) {
    resumeData = {
      fn: '',
      ln: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      summary: '',
      techSkills: [],
      softSkills: [],
      exps: [],
      edus: [],
      certs: [],
      projs: [],
      langs: '',
      hobbies: '',
      achievements: '',
      customEnabled: false,
      customTitle: '',
      customBody: ''
    };
    localStorage.setItem('rc_resume_empty_intent', 'true');
    saveStateToLocalStorage();
    loadDataFromLocalStorage();
    showToast('Reset Complete', 'Form inputs cleared.', 'info');
  }
}

function renderLandingPreviews() {
  const templates = ['classic', 'modern', 'minimal', 'bold', 'tech', 'creative'];
  
  templates.forEach(tpl => {
    const container = document.getElementById(`landing-preview-${tpl}`);
    if (container) {
      container.innerHTML = `
        <div class="mini-resume-wrapper">
          <div class="resume-paper font-dm-sans margin-compact" style="--accent-theme: ${styleSettings.accentColor || '#6d5dfc'};">
            ${ResumeTemplates.render(tpl, sampleResumeData, { ...styleSettings, margins: 'compact' })}
          </div>
        </div>
      `;
    }
  });
}
