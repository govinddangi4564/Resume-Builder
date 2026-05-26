/**
 * ATS Score Engine & Plain-Text Resume Scanner
 */

const ATSScanner = {
  // Broad list of ATS-friendly active power verbs
  powerVerbs: [
    'spearheaded', 'designed', 'developed', 'engineered', 'architected', 'optimized',
    'streamlined', 'implemented', 'orchestrated', 'overhauled', 'revitalized', 'directed',
    'executed', 'formulated', 'pioneered', 'supervised', 'collaborated', 'coordinated',
    'increased', 'reduced', 'saved', 'maximized', 'minimized', 'launched', 'authored',
    'managed', 'led', 'improved', 'built', 'created', 'established', 'initiated'
  ],

  /**
   * Evaluates the current state data of the builder resume
   * Returns score (0-100) and detailed audit checklist
   */
  evaluateResume(d) {
    let score = 0;
    const checklist = [];

    // 1. CONTACT INFO (Max 15 pts)
    let contactPts = 0;
    const nameFilled = (d.fn && d.fn.trim()) && (d.ln && d.ln.trim());
    if (nameFilled) contactPts += 3;
    if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) contactPts += 3;
    if (d.phone && d.phone.trim().length > 5) contactPts += 3;
    if (d.location && d.location.trim().length > 3) contactPts += 3;
    if (d.linkedin && d.linkedin.trim().length > 5) contactPts += 3;

    score += contactPts;
    checklist.push({
      section: 'contact',
      name: 'Contact details completed',
      passed: contactPts === 15,
      pts: contactPts,
      max: 15,
      tip: 'Fill out your full name, email, phone, location, and LinkedIn URL to make it easy for recruiters to reach you.'
    });

    // 2. PROFESSIONAL SUMMARY (Max 10 pts)
    let summaryPts = 0;
    const hasSummary = d.summary && d.summary.trim().length > 10;
    if (hasSummary) {
      summaryPts += 5;
      const len = d.summary.trim().length;
      if (len >= 100 && len <= 400) {
        summaryPts += 5;
      }
    }
    score += summaryPts;
    checklist.push({
      section: 'summary',
      name: 'Professional summary audit',
      passed: summaryPts === 10,
      pts: summaryPts,
      max: 10,
      tip: hasSummary
        ? 'Your summary is either too short or too long. Aim for a concise paragraph of 2-3 sentences (100 to 400 characters).'
        : 'Write a professional summary outlining your top achievements and core technical skills to capture attention.'
    });

    // 3. WORK EXPERIENCE (Max 30 pts)
    let expPts = 0;
    const hasExp = d.exps && d.exps.length > 0;
    if (hasExp) {
      expPts += 10; // basic structure
      if (d.exps.length >= 2) expPts += 5; // breadth

      // Scan description bullets for power verbs and metrics
      let activeVerbsFound = 0;
      let metricsFound = 0;
      let totalText = '';

      d.exps.forEach(e => {
        totalText += ' ' + (e.desc || '').toLowerCase();
      });

      // Count distinct power verbs
      this.powerVerbs.forEach(verb => {
        if (totalText.includes(verb)) activeVerbsFound++;
      });

      // Count digits
      const digitsMatch = totalText.match(/\b\d+%?\b|\b(percent|\$|usd|inr|hours|days|users)\b/g);
      if (digitsMatch) metricsFound = digitsMatch.length;

      if (activeVerbsFound >= 3) expPts += 10;
      else if (activeVerbsFound >= 1) expPts += 5;

      if (metricsFound >= 2) expPts += 5;
      else if (metricsFound >= 1) expPts += 2;
    }

    score += expPts;

    let expTip = '';
    if (!hasExp) {
      expTip = 'Add at least one work experience entry. If you are a fresher, include internships, volunteering, or freelance projects.';
    } else {
      const verbMatch = expPts >= 25;
      const metricMatch = expPts % 10 >= 5 || expPts >= 30;
      if (!verbMatch && !metricMatch) {
        expTip = 'Ensure your job bullet points start with strong action verbs (e.g. Optimized, Engineered) and include numeric metrics (e.g. improved performance by 25%).';
      } else if (!verbMatch) {
        expTip = 'Add more action verbs to the beginning of your job responsibility bullet points.';
      } else if (!metricMatch) {
        expTip = 'Quantify your achievements. Try adding numbers, dollar values, sizes of teams, or percentages (e.g., "Led team of 4 devs").';
      }
    }

    checklist.push({
      section: 'experience',
      name: 'Work experience impact',
      passed: expPts === 30,
      pts: expPts,
      max: 30,
      tip: expTip
    });

    // 4. EDUCATION (Max 15 pts)
    let eduPts = 0;
    const hasEdu = d.edus && d.edus.length > 0;
    if (hasEdu) {
      eduPts += 10;
      // Check if degree and inst are filled
      const filled = d.edus.every(e => e.deg && e.deg.trim().length > 3 && e.inst && e.inst.trim().length > 3);
      if (filled) eduPts += 5;
    }
    score += eduPts;
    checklist.push({
      section: 'education',
      name: 'Education details complete',
      passed: eduPts === 15,
      pts: eduPts,
      max: 15,
      tip: hasEdu
        ? 'Make sure degree names, institutions, and end dates are fully written out for all education items.'
        : 'Add your college degree or highest educational qualification.'
    });

    // 5. SKILLS DENSITY (Max 15 pts)
    let skillsPts = 0;
    const hasTech = d.techSkills && d.techSkills.length > 0;
    const hasSoft = d.softSkills && d.softSkills.length > 0;
    if (hasTech) {
      skillsPts += 5;
      if (d.techSkills.length >= 5) skillsPts += 5; // good density
    }
    if (hasSoft && d.softSkills.length >= 3) {
      skillsPts += 5;
    }
    score += skillsPts;
    checklist.push({
      section: 'skills',
      name: 'Skills density & keywords',
      passed: skillsPts === 15,
      pts: skillsPts,
      max: 15,
      tip: 'List at least 5 technical skills tags and 3 soft/domain skills. Keywords are critical for matching job descriptions in ATS scanners.'
    });

    // 6. PROJECTS (Max 10 pts)
    let projPts = 0;
    const hasProj = d.projs && d.projs.length > 0;
    if (hasProj) {
      projPts += 7;
      const detailsFilled = d.projs.every(p => p.tech || p.url);
      if (detailsFilled) projPts += 3;
    }
    score += projPts;
    checklist.push({
      section: 'projects',
      name: 'Project details and tech stack',
      passed: projPts === 10,
      pts: projPts,
      max: 10,
      tip: 'Projects show practical application. Add at least 1 project, specify the tech stack used, and supply a code or website link.'
    });

    // 7. EXTRAS & CERTIFICATIONS (Max 5 pts)
    let extraPts = 0;
    if (d.certs && d.certs.length > 0) extraPts += 3;
    if (d.langs && d.langs.trim().length > 3) extraPts += 2;
    score += extraPts;
    checklist.push({
      section: 'extras',
      name: 'Credentials & extras',
      passed: extraPts === 5,
      pts: extraPts,
      max: 5,
      tip: 'Certifications and languages add credibility. Mention AWS/Google certifications and language skills if applicable.'
    });

    return {
      score: Math.min(score, 100),
      checklist
    };
  },

  /**
   * Scans a raw plain-text string pasted from an external resume
   * Returns a simulated ATS score evaluation, detected sections, and tips
   */
  evaluatePastedText(text) {
    if (!text || text.trim().length < 50) {
      return {
        score: 0,
        error: 'Please paste a complete resume. Input text must be at least 50 characters.'
      };
    }

    const cleanText = text.toLowerCase();
    const suggestions = [];
    let score = 0;

    // 1. Detect sections presence
    const sections = {
      experience: false,
      education: false,
      skills: false,
      summary: false,
      projects: false
    };

    if (/experience|employment|work history|professional history|professional background|jobs/i.test(cleanText)) {
      sections.experience = true;
      score += 25;
    } else {
      suggestions.push({
        section: 'Experience',
        severity: 'high',
        tip: 'Missing <strong>Work Experience</strong> header. Use common titles like "Work Experience", "Professional Experience", or "Employment History".'
      });
    }

    if (/education|academic|university|degree|college/i.test(cleanText)) {
      sections.education = true;
      score += 15;
    } else {
      suggestions.push({
        section: 'Education',
        severity: 'high',
        tip: 'Missing <strong>Education</strong> header. ATS systems parse academic credentials under standardized "Education" sections.'
      });
    }

    if (/skills|technologies|tools|technical competencies|competencies/i.test(cleanText)) {
      sections.skills = true;
      score += 15;
    } else {
      suggestions.push({
        section: 'Skills',
        severity: 'high',
        tip: 'Missing a clear <strong>Skills</strong> header. An ATS parses keywords under a skills section to match job descriptions.'
      });
    }

    if (/summary|profile|professional summary|objective|about me/i.test(cleanText)) {
      sections.summary = true;
      score += 10;
    } else {
      suggestions.push({
        section: 'Summary',
        severity: 'medium',
        tip: 'Consider adding a brief <strong>Professional Summary</strong> at the top of your resume to introduce your qualifications.'
      });
    }

    if (/projects|personal projects|selected projects|accomplishments/i.test(cleanText)) {
      sections.projects = true;
      score += 10;
    }

    // 2. Contact details detection
    const contact = {
      email: false,
      phone: false,
      linkedin: false
    };

    // Email regex
    const emailMatch = cleanText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    if (emailMatch) {
      contact.email = true;
      score += 5;
    } else {
      suggestions.push({
        section: 'Contact Info',
        severity: 'high',
        tip: '<strong>Email Address</strong> not detected. Check formatting (e.g. name@domain.com).'
      });
    }

    // Phone regex (broad)
    const phoneMatch = cleanText.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{5}\s\d{5}\b/);
    if (phoneMatch) {
      contact.phone = true;
      score += 5;
    } else {
      suggestions.push({
        section: 'Contact Info',
        severity: 'high',
        tip: '<strong>Phone Number</strong> not found. Make sure your contact details are listed at the top.'
      });
    }

    // LinkedIn check
    if (cleanText.includes('linkedin.com/')) {
      contact.linkedin = true;
      score += 5;
    } else {
      suggestions.push({
        section: 'Contact Info',
        severity: 'medium',
        tip: 'No <strong>LinkedIn Profile URL</strong> found. Hiring managers frequently check LinkedIn.'
      });
    }

    // 3. Action Verbs analysis
    let verbCount = 0;
    const foundVerbs = [];
    this.powerVerbs.forEach(verb => {
      const regex = new RegExp('\\b' + verb + '\\b', 'g');
      const matches = cleanText.match(regex);
      if (matches) {
        verbCount += matches.length;
        foundVerbs.push(verb);
      }
    });

    if (verbCount >= 5) {
      score += 10;
    } else if (verbCount >= 2) {
      score += 5;
      suggestions.push({
        section: 'Content Action',
        severity: 'medium',
        tip: `Found only ${verbCount} active power verbs. Add action verbs like: <em>${this.powerVerbs.slice(0, 3).join(', ')}</em> to describe your work.`
      });
    } else {
      suggestions.push({
        section: 'Content Action',
        severity: 'high',
        tip: 'Your descriptions sound passive. Start job bullet points with strong active verbs instead of passive phrases like "responsible for".'
      });
    }

    // 4. Numbers / Metrics density
    const metricsMatch = cleanText.match(/\b\d+%?\b|\b(percent|\$|usd|inr|hours|days|users)\b/g);
    const metricsCount = metricsMatch ? metricsMatch.length : 0;

    if (metricsCount >= 4) {
      score += 10;
    } else if (metricsCount >= 1) {
      score += 5;
      suggestions.push({
        section: 'Quantifiable Metrics',
        severity: 'medium',
        tip: `Found only ${metricsCount} metrics. Increase the impact of your bullets by adding numbers, dollar values, and timelines.`
      });
    } else {
      suggestions.push({
        section: 'Quantifiable Metrics',
        severity: 'high',
        tip: 'No quantifiable results detected. Recruiters look for metrics. E.g. "Increased conversions by 15%" or "Managed a team of 4 engineers".'
      });
    }

    // 5. Total word count checks (Optimal: 400 - 900 words)
    const words = cleanText.split(/\s+/).filter(w => w.length > 1).length;
    if (words > 1200) {
      suggestions.push({
        section: 'Length check',
        severity: 'medium',
        tip: `Your resume is quite long (${words} words). Keep it compact and remove older, irrelevant details to fit 1-2 pages.`
      });
    } else if (words < 200) {
      suggestions.push({
        section: 'Length check',
        severity: 'medium',
        tip: `Your resume is very short (${words} words). Expand on your projects, technical skills, and job achievements.`
      });
    }

    return {
      score: Math.min(score, 100),
      sections,
      contact,
      metricsCount,
      verbCount,
      foundVerbs: foundVerbs.slice(0, 8),
      suggestions
    };
  }
};
