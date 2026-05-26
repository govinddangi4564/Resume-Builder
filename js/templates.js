/**
 * Resume Templates Rendering Engines
 * Takes resume data and design styles, returning HTML markup.
 */

const ResumeTemplates = {
  /**
   * Helper to format link text cleanly
   */
  formatLink(url) {
    if (!url) return '';
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
  },

  /**
   * Render experience bullet points
   */
  renderBullets(desc) {
    if (!desc) return '';
    const lines = desc.split('\n').filter(line => line.trim());
    return lines.map(line => {
      // Remove leading dashes/bullet characters if present
      const cleanLine = line.replace(/^[•\-*›]\s*/, '').trim();
      return `<div class="ro-bullet"><span>•</span><span>${cleanLine}</span></div>`;
    }).join('');
  },

  /**
   * Render section blocks dynamically based on user ordering choice
   */
  renderSectionsInOrder(d, styles, tplName) {
    const order = styles.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certs', 'extras', 'custom'];
    let htmlContent = '';
    const accent = tplName === 'academic' ? '#0a96c3' : styles.accentColor;

    order.forEach(sectionKey => {
      switch (sectionKey) {
        case 'summary':
          if (d.summary) {
            htmlContent += this.sections[tplName].summary(d.summary, accent);
          }
          break;
        case 'experience':
          if (d.exps && d.exps.length > 0) {
            htmlContent += this.sections[tplName].experience(d.exps, accent, this.renderBullets);
          }
          break;
        case 'education':
          if (d.edus && d.edus.length > 0) {
            htmlContent += this.sections[tplName].education(d.edus, accent);
          }
          break;
        case 'skills':
          if ((d.techSkills && d.techSkills.length > 0) || (d.softSkills && d.softSkills.length > 0)) {
            htmlContent += this.sections[tplName].skills(d.techSkills, d.softSkills, accent);
          }
          break;
        case 'projects':
          if (d.projs && d.projs.length > 0) {
            htmlContent += this.sections[tplName].projects(d.projs, accent);
          }
          break;
        case 'certs':
          if (d.certs && d.certs.length > 0) {
            htmlContent += this.sections[tplName].certs(d.certs, accent);
          }
          break;
        case 'extras':
          if (d.langs || d.hobbies || d.achievements) {
            htmlContent += this.sections[tplName].extras(d.langs, d.hobbies, d.achievements, accent);
          }
          break;
        case 'custom':
          if (d.customEnabled && d.customTitle && d.customBody) {
            htmlContent += this.sections[tplName].custom(d.customTitle, d.customBody, accent, this.renderBullets);
          }
          break;
      }
    });

    return htmlContent;
  },

  /**
   * Template Renderers mapping
   */
  render(templateId, data, styles) {
    const tplFn = this[templateId];
    if (typeof tplFn === 'function') {
      return tplFn.call(this, data, styles);
    }
    return this.classic(data, styles);
  },

  /* ==========================================
     1. CLASSIC EXECUTIVE TEMPLATE
     ========================================== */
  classic(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = styles.accentColor || '#1a1a2e';

    // Contact string filter
    const contactItems = [];
    if (d.email) contactItems.push(d.email);
    if (d.phone) contactItems.push(d.phone);
    if (d.location) contactItems.push(d.location);
    if (d.linkedin) contactItems.push(`<a href="https://${this.formatLink(d.linkedin)}" target="_blank">${this.formatLink(d.linkedin)}</a>`);
    if (d.github) contactItems.push(`<a href="https://${this.formatLink(d.github)}" target="_blank">${this.formatLink(d.github)}</a>`);
    const contactHTML = contactItems.join('  •  ');

    const sectionsHTML = this.renderSectionsInOrder(d, styles, 'classic');

    return `
      <div class="ro-classic">
        <header class="ro-header" style="border-color: ${accent}">
          <h1 class="ro-name" style="color: ${accent}">${fullName}</h1>
          ${d.title ? `<div class="ro-subtitle">${d.title}</div>` : ''}
          <div class="ro-contact">${contactHTML}</div>
        </header>
        <main class="ro-body">
          ${sectionsHTML}
        </main>
      </div>
    `;
  },

  /* ==========================================
     2. MODERN SIDEBAR TEMPLATE (TWO-COLUMN)
     ========================================== */
  modern(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = styles.accentColor || '#6d5dfc';

    // Sidebar items layout
    let sidebarHTML = '';

    // Contact
    sidebarHTML += `
      <div class="ro-section">
        <h3 class="ro-title" style="color: ${accent}">Contact <div class="ro-title-line" style="background-color: ${accent}"></div></h3>
        <div class="ro-contact">
          ${d.email ? `<div>✉ ${d.email}</div>` : ''}
          ${d.phone ? `<div>☎ ${d.phone}</div>` : ''}
          ${d.location ? `<div>📍 ${d.location}</div>` : ''}
          ${d.linkedin ? `<div>🔗 <a href="https://${this.formatLink(d.linkedin)}" target="_blank">${this.formatLink(d.linkedin)}</a></div>` : ''}
          ${d.github ? `<div>💻 <a href="https://${this.formatLink(d.github)}" target="_blank">${this.formatLink(d.github)}</a></div>` : ''}
        </div>
      </div>
    `;

    // Modern Sidebar Sections
    const sideOrder = ['skills', 'education', 'certs', 'extras'];
    sideOrder.forEach(key => {
      switch (key) {
        case 'skills':
          if ((d.techSkills && d.techSkills.length > 0) || (d.softSkills && d.softSkills.length > 0)) {
            sidebarHTML += this.sections.modern.skills(d.techSkills, d.softSkills, accent);
          }
          break;
        case 'education':
          if (d.edus && d.edus.length > 0) {
            sidebarHTML += this.sections.modern.education(d.edus, accent);
          }
          break;
        case 'certs':
          if (d.certs && d.certs.length > 0) {
            sidebarHTML += this.sections.modern.certs(d.certs, accent);
          }
          break;
        case 'extras':
          if (d.langs || d.hobbies || d.achievements) {
            sidebarHTML += this.sections.modern.extras(d.langs, d.hobbies, d.achievements, accent);
          }
          break;
      }
    });

    // Main Column Sections
    const mainOrder = styles.sectionOrder || ['summary', 'experience', 'projects', 'custom'];
    let mainHTML = '';
    mainOrder.forEach(key => {
      // Skip sidebar items to avoid duplicating
      if (sideOrder.includes(key)) return;

      switch (key) {
        case 'summary':
          if (d.summary) mainHTML += this.sections.modern.summary(d.summary, accent);
          break;
        case 'experience':
          if (d.exps && d.exps.length > 0) mainHTML += this.sections.modern.experience(d.exps, accent, this.renderBullets);
          break;
        case 'projects':
          if (d.projs && d.projs.length > 0) mainHTML += this.sections.modern.projects(d.projs, accent);
          break;
        case 'custom':
          if (d.customEnabled && d.customTitle && d.customBody) {
            mainHTML += this.sections.modern.custom(d.customTitle, d.customBody, accent, this.renderBullets);
          }
          break;
      }
    });

    return `
      <div class="ro-modern">
        <div class="ro-main-col">
          <header class="ro-header">
            <h1 class="ro-name" style="color: ${accent}">${fullName}</h1>
            ${d.title ? `<div class="ro-subtitle">${d.title}</div>` : ''}
          </header>
          ${mainHTML}
        </div>
        <aside class="ro-sidebar">
          ${sidebarHTML}
        </aside>
      </div>
    `;
  },

  /* ==========================================
     3. MINIMAL CLEAN TEMPLATE
     ========================================== */
  minimal(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = styles.accentColor || '#111111';

    const contactItems = [];
    if (d.email) contactItems.push(d.email);
    if (d.phone) contactItems.push(d.phone);
    if (d.location) contactItems.push(d.location);
    if (d.linkedin) contactItems.push(`<a href="https://${this.formatLink(d.linkedin)}" target="_blank">${this.formatLink(d.linkedin)}</a>`);
    if (d.github) contactItems.push(`<a href="https://${this.formatLink(d.github)}" target="_blank">${this.formatLink(d.github)}</a>`);
    const contactHTML = contactItems.join('  |  ');

    const sectionsHTML = this.renderSectionsInOrder(d, styles, 'minimal');

    return `
      <div class="ro-minimal">
        <header class="ro-header">
          <h1 class="ro-name" style="color: ${accent}">${fullName}</h1>
          ${d.title ? `<div class="ro-subtitle">${d.title}</div>` : ''}
          <div class="ro-contact">${contactHTML}</div>
        </header>
        <main class="ro-body">
          ${sectionsHTML}
        </main>
      </div>
    `;
  },

  /* ==========================================
     4. BOLD TEMPLATE
     ========================================== */
  bold(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = styles.accentColor || '#f7c06a';

    const contactItems = [];
    if (d.email) contactItems.push(`✉ ${d.email}`);
    if (d.phone) contactItems.push(`☎ ${d.phone}`);
    if (d.location) contactItems.push(`📍 ${d.location}`);
    if (d.linkedin) contactItems.push(`🔗 <a href="https://${this.formatLink(d.linkedin)}" target="_blank">${this.formatLink(d.linkedin)}</a>`);
    if (d.github) contactItems.push(`💻 <a href="https://${this.formatLink(d.github)}" target="_blank">${this.formatLink(d.github)}</a>`);
    const contactHTML = contactItems.join('   ');

    const sectionsHTML = this.renderSectionsInOrder(d, styles, 'bold');

    return `
      <div class="ro-bold">
        <header class="ro-header" style="background-color: ${accent}; color: ${this.isLightColor(accent) ? '#121217' : '#ffffff'}">
          <h1 class="ro-name">${fullName}</h1>
          ${d.title ? `<div class="ro-subtitle">${d.title}</div>` : ''}
          <div class="ro-contact">${contactHTML}</div>
        </header>
        <main class="ro-body">
          ${sectionsHTML}
        </main>
      </div>
    `;
  },

  /* ==========================================
     5. TECH MONOSPACE TEMPLATE (DEVS & ENGINEERS)
     ========================================== */
  tech(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = styles.accentColor || '#58a6ff';

    const contactItems = [];
    if (d.email) contactItems.push(`[${d.email}]`);
    if (d.phone) contactItems.push(`[${d.phone}]`);
    if (d.location) contactItems.push(`[${d.location}]`);
    if (d.linkedin) contactItems.push(`[linkedin::${this.formatLink(d.linkedin)}]`);
    if (d.github) contactItems.push(`[github::${this.formatLink(d.github)}]`);
    const contactHTML = contactItems.join('  ');

    const sectionsHTML = this.renderSectionsInOrder(d, styles, 'tech');

    return `
      <div class="ro-tech">
        <header class="ro-header">
          <h1 class="ro-name" style="color: ${accent}">&gt; ${fullName}</h1>
          ${d.title ? `<div class="ro-subtitle">// ${d.title}</div>` : ''}
          <div class="ro-contact">${contactHTML}</div>
        </header>
        <main class="ro-body">
          ${sectionsHTML}
        </main>
      </div>
    `;
  },

  /* ==========================================
     6. CREATIVE GRADIENT TEMPLATE
     ========================================== */
  creative(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = styles.accentColor || '#6d5dfc';

    // Gradient text support
    const endColor = this.lightenColor(accent, 35);

    const contactItems = [];
    if (d.email) contactItems.push(`✉  ${d.email}`);
    if (d.phone) contactItems.push(`☎  ${d.phone}`);
    if (d.location) contactItems.push(`📍  ${d.location}`);
    if (d.linkedin) contactItems.push(`🔗  <a href="https://${this.formatLink(d.linkedin)}" target="_blank">${this.formatLink(d.linkedin)}</a>`);
    if (d.github) contactItems.push(`💻  <a href="https://${this.formatLink(d.github)}" target="_blank">${this.formatLink(d.github)}</a>`);
    const contactHTML = contactItems.join('<br>');

    const sectionsHTML = this.renderSectionsInOrder(d, styles, 'creative');

    return `
      <div class="ro-creative">
        <header class="ro-header" style="border-color: ${accent}">
          <div>
            <h1 class="ro-name" style="background: linear-gradient(135deg, ${accent}, ${endColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${fullName}</h1>
            ${d.title ? `<div class="ro-subtitle" style="color: ${accent}">${d.title}</div>` : ''}
          </div>
          <div class="ro-contact">${contactHTML}</div>
        </header>
        <main class="ro-body">
          ${sectionsHTML}
        </main>
      </div>
    `;
  },

  /* ==========================================
     7. ACADEMIC BLUE-HEADER TEMPLATE
     ========================================== */
  /* ==========================================
     7. ACADEMIC BLUE-HEADER TEMPLATE
     ========================================== */
  academic(d, styles) {
    const fullName = `${d.fn || ''} ${d.ln || ''}`.trim() || 'Your Name';
    const accent = '#0a96c3';

    const sectionsHTML = this.renderSectionsInOrder(d, styles, 'academic');

    let coCurricularHTML = '';
    if (d.coCurricular) {
      const items = d.coCurricular.split('\n').filter(Boolean);
      coCurricularHTML = `
        <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
          <div class="ro-section-banner" style="background-color: ${accent}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">CO-CURRICULAR ACTIVITIES</div>
          <div style="font-size: 0.8rem; line-height: 1.45; color: #222; padding-left: 0.25rem;">
            ${items.map(item => {
        const clean = item.replace(/^[•\-*›▫○o]\s*/, '').trim();
        return `<div style="margin-bottom: 0.3rem; text-align: justify;">${clean}</div>`;
      }).join('')}
          </div>
        </div>
      `;
    }

    let extraCurricularHTML = '';
    if (d.extraCurricular) {
      const items = d.extraCurricular.split('\n').filter(Boolean);
      extraCurricularHTML = `
        <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
          <div class="ro-section-banner" style="background-color: ${accent}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">EXTRA CURRICULAR ACTIVITIES</div>
          <div style="font-size: 0.8rem; line-height: 1.45; color: #222; padding-left: 0.25rem;">
            ${items.map(item => {
        const clean = item.replace(/^[•\-*›▫○o]\s*/, '').trim();
        return `<div style="margin-bottom: 0.3rem; text-align: justify;">${clean}</div>`;
      }).join('')}
          </div>
        </div>
      `;
    }

    let weblinksHTML = '';
    if (d.weblinks) {
      const items = d.weblinks.split('\n').filter(Boolean);
      weblinksHTML = `
        <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
          <div class="ro-section-banner" style="background-color: ${accent}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">WEBLINKS</div>
          <div style="font-size: 0.8rem; line-height: 1.45; color: #222; padding-left: 0.25rem;">
            ${items.map(item => {
        const clean = item.replace(/^[•\-*›▫○o]\s*/, '').trim();
        if (clean.includes(':')) {
          const idx = clean.indexOf(':');
          const label = clean.substring(0, idx).trim();
          const url = clean.substring(idx + 1).trim();
          return `<div style="margin-bottom: 0.2rem;"><strong>${label}:</strong> <a href="${url.startsWith('http') ? url : 'https://' + url}" target="_blank" style="color: inherit; text-decoration: none;">${url}</a></div>`;
        }
        return `<div style="margin-bottom: 0.2rem;"><a href="${clean.startsWith('http') ? clean : 'https://' + clean}" target="_blank" style="color: inherit; text-decoration: none;">${clean}</a></div>`;
      }).join('')}
          </div>
        </div>
      `;
    }

    let contactDetailsHTML = '';
    if (d.email || d.phone) {
      contactDetailsHTML = `
        <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
          <div class="ro-section-banner" style="background-color: ${accent}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">CONTACT DETAILS</div>
          <div style="font-size: 0.8rem; color: #222; padding: 0.15rem 0.25rem; display: flex; justify-content: space-between;">
            ${d.email ? `<div><strong>Emails:</strong> <a href="mailto:${d.email}" style="color: inherit; text-decoration: none; font-weight: normal;">${d.email}</a></div>` : ''}
            ${d.phone ? `<div style="text-align: right;"><strong>Phone Numbers:</strong> <span style="font-weight: normal;">${d.phone}</span></div>` : ''}
          </div>
        </div>
      `;
    }

    let referencesHTML = '';
    if (d.references) {
      const refLines = d.references.split('\n').filter(Boolean);
      referencesHTML = `
        <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
          <div class="ro-section-banner" style="background-color: ${accent}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">REFERENCES</div>
          <div style="font-size: 0.8rem; line-height: 1.45; color: #222; padding-left: 0.25rem;">
            ${refLines.map((line, idx) => {
        const spaces = line.match(/^\s*/)[0].length;
        const clean = line.trim();
        const indent = '&nbsp;'.repeat(spaces);
        if (idx === 0) {
          return `<div style="font-weight: 700; color: #111;">${indent}${clean}</div>`;
        }
        return `<div style="color: #333; margin-top: 0.15rem;">${indent}${clean}</div>`;
      }).join('')}
          </div>
        </div>
      `;
    }

    let subtitleHTML = '';
    if (d.title) {
      const titleText = d.title;
      if (titleText.includes(' - ')) {
        const parts = titleText.split(' - ');
        subtitleHTML = `<span style="color: ${accent};">${parts[0]}</span> <span style="color: #222;">- ${parts.slice(1).join(' - ')}</span>`;
      } else {
        subtitleHTML = `<span style="color: ${accent};">${titleText}</span>`;
      }
    }

    return `
      <div class="ro-academic" style="color: #222; font-family: inherit; line-height: 1.4; padding: 0.25rem 0;">
        <header class="ro-header" style="text-align: right; margin-bottom: 1rem; padding-bottom: 0.25rem;">
          <h1 class="ro-name" style="color: ${accent}; font-family: var(--font-display), sans-serif; font-size: 2rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.1rem; letter-spacing: -0.5px;">${fullName}</h1>
          ${d.title ? `<div class="ro-subtitle" style="font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem;">${subtitleHTML}</div>` : ''}
          <div class="ro-contact" style="font-size: 0.78rem; font-weight: 600; display: flex; flex-direction: column; gap: 0.1rem; align-items: flex-end;">
            ${d.phone ? `<div><span style="color: ${accent};">Ph:</span> <span style="font-weight: normal; color: #222;">${d.phone}</span></div>` : ''}
            ${d.email ? `<div><span style="color: ${accent};">Email:</span> <a href="mailto:${d.email}" style="color: #222; font-weight: normal; text-decoration: none;">${d.email}</a></div>` : ''}
          </div>
        </header>
        <main class="ro-body">
          ${sectionsHTML}
          ${coCurricularHTML}
          ${extraCurricularHTML}
          ${weblinksHTML}
          ${contactDetailsHTML}
          ${referencesHTML}
        </main>
      </div>
    `;
  },

  /**
   * Helper function to detect light colors (to swap text black/white)
   */
  isLightColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
  },

  /**
   * Helper to generate a secondary gradient color based on accent
   */
  lightenColor(hex, percent) {
    let num = parseInt(hex.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
  },

  /* ==========================================================================
     INDIVIDUAL SECTION BUILDERS FOR ALL 6 TEMPLATES
     ========================================================================== */
  sections: {
    classic: {
      summary: (text, acc) => `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Professional Summary</h2><p class="ro-summary">${text}</p></div>`,
      experience: (list, acc, bulletFn) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Professional Experience</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.title}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub">${e.company || ''} ${e.loc ? `• ${e.loc}` : ''} ${e.type ? `• ${e.type}` : ''}</div>
              <div class="ro-item-desc">${bulletFn(e.desc)}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      education: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Education</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.deg}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub">${e.inst || ''} ${e.gpa ? `• GPA: ${e.gpa}` : ''}</div>
              ${e.course ? `<div class="ro-item-desc"><strong>Coursework:</strong> ${e.course}</div>` : ''}
            </div>
          `;
        });
        return h + '</div>';
      },
      skills: (tech, soft, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Skills</h2>`;
        if (tech && tech.length > 0) {
          h += `<div style="margin-bottom:0.5rem;"><strong style="font-size:0.85rem;">Technical Skills:</strong> <span style="font-size:0.825rem;">${tech.join(', ')}</span></div>`;
        }
        if (soft && soft.length > 0) {
          h += `<div><strong style="font-size:0.85rem;">Professional Skills:</strong> <span style="font-size:0.825rem;">${soft.join(', ')}</span></div>`;
        }
        return h + '</div>';
      },
      projects: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Projects</h2>`;
        list.forEach(p => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${p.name} ${p.tech ? `<span style="font-weight: normal; font-size: 0.8rem; color:#666;">(${p.tech})</span>` : ''}</span>
                <span class="ro-item-date">${p.year || ''}</span>
              </div>
              <div class="ro-item-desc">
                ${p.desc || ''} 
                ${p.url ? `<a href="https://${p.url}" target="_blank" style="color:${acc}; font-size: 0.78rem; font-weight:600; margin-left: 0.25rem;">[Link]</a>` : ''}
              </div>
            </div>
          `;
        });
        return h + '</div>';
      },
      certs: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Certifications</h2><ul style="padding-left:1.25rem; font-size:0.825rem;">`;
        list.forEach(c => {
          h += `<li style="margin-bottom:0.25rem;"><strong>${c.name}</strong> ${c.issuer ? `— ${c.issuer}` : ''}</li>`;
        });
        return h + '</ul></div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">Additional Information</h2>`;
        if (langs) h += `<div style="margin-bottom:0.4rem; font-size:0.825rem;"><strong>Languages:</strong> ${langs}</div>`;
        if (hobbies) h += `<div style="margin-bottom:0.4rem; font-size:0.825rem;"><strong>Interests:</strong> ${hobbies}</div>`;
        if (ach) h += `<div style="font-size:0.825rem; white-space:pre-line;"><strong>Key Achievements:</strong><br>${ach}</div>`;
        return h + '</div>';
      },
      custom: (title, body, acc, bulletFn) => `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}; color:${acc}">${title}</h2><div class="ro-item-desc">${bulletFn(body)}</div></div>`
    },

    modern: {
      summary: (text, acc) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Profile<div class="ro-title-line" style="background-color:${acc}"></div></h2><p class="ro-summary">${text}</p></div>`,
      experience: (list, acc, bulletFn) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Experience<div class="ro-title-line" style="background-color:${acc}"></div></h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.title}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub">${e.company || ''} ${e.loc ? `| ${e.loc}` : ''}</div>
              <div class="ro-item-desc">${bulletFn(e.desc)}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      education: (list, acc) => {
        let h = `<div class="ro-section"><h3 class="ro-title" style="color:${acc}">Education<div class="ro-title-line" style="background-color:${acc}"></div></h3>`;
        list.forEach(e => {
          h += `
            <div class="ro-item" style="margin-bottom: 0.75rem;">
              <div style="font-size:0.85rem; font-weight:700;">${e.deg}</div>
              <div style="font-size:0.78rem; color:#555;">${e.inst}</div>
              <div style="font-size:0.75rem; color:#777;">${e.start || ''} - ${e.end || ''}</div>
              ${e.gpa ? `<div style="font-size:0.75rem; color:#555;">GPA: ${e.gpa}</div>` : ''}
            </div>
          `;
        });
        return h + '</div>';
      },
      skills: (tech, soft, acc) => {
        let h = `<div class="ro-section"><h3 class="ro-title" style="color:${acc}">Skills<div class="ro-title-line" style="background-color:${acc}"></div></h3>`;
        if (tech && tech.length > 0) {
          h += `
            <div style="margin-bottom: 0.75rem;">
              <div style="font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color:#666; margin-bottom: 0.25rem;">Technical</div>
              <div class="ro-skills-wrap">
                ${tech.map(s => `<span class="ro-skill-pill" style="background-color:rgba(109, 93, 252, 0.08); color:${acc};">${s}</span>`).join('')}
              </div>
            </div>
          `;
        }
        if (soft && soft.length > 0) {
          h += `
            <div>
              <div style="font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color:#666; margin-bottom: 0.25rem;">Professional</div>
              <div class="ro-skills-wrap">
                ${soft.map(s => `<span class="ro-skill-pill" style="background-color:#f0f0f5; color:#555566;">${s}</span>`).join('')}
              </div>
            </div>
          `;
        }
        return h + '</div>';
      },
      projects: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Projects<div class="ro-title-line" style="background-color:${acc}"></div></h2>`;
        list.forEach(p => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${p.name}</span>
                <span class="ro-item-date">${p.year || ''}</span>
              </div>
              ${p.tech ? `<div style="font-size:0.75rem; color:${acc}; font-weight:600; margin-bottom:0.2rem;">${p.tech}</div>` : ''}
              <div class="ro-item-desc">${p.desc || ''} ${p.url ? `<a href="https://${p.url}" target="_blank" style="color:${acc}; font-size:0.78rem;">🔗</a>` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      certs: (list, acc) => {
        let h = `<div class="ro-section"><h3 class="ro-title" style="color:${acc}">Certifications<div class="ro-title-line" style="background-color:${acc}"></div></h3><ul style="padding-left:1rem; font-size:0.78rem; color:#444;">`;
        list.forEach(c => {
          h += `<li style="margin-bottom:0.25rem;"><strong>${c.name}</strong></li>`;
        });
        return h + '</ul></div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `<div class="ro-section"><h3 class="ro-title" style="color:${acc}">Extras<div class="ro-title-line" style="background-color:${acc}"></div></h3><div style="font-size:0.78rem; color:#444; line-height:1.5;">`;
        if (langs) h += `<div style="margin-bottom:0.3rem;"><strong>Languages:</strong><br>${langs}</div>`;
        if (hobbies) h += `<div style="margin-bottom:0.3rem;"><strong>Interests:</strong><br>${hobbies}</div>`;
        if (ach) h += `<div style="white-space:pre-line;"><strong>Awards:</strong><br>${ach}</div>`;
        return h + '</div></div>';
      },
      custom: (title, body, acc, bulletFn) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">${title}<div class="ro-title-line" style="background-color:${acc}"></div></h2><div class="ro-item-desc">${bulletFn(body)}</div></div>`
    },

    minimal: {
      summary: (text, acc) => `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Profile</h2><p class="ro-summary">${text}</p></div>`,
      experience: (list, acc, bulletFn) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Experience</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.title} / <span style="font-weight:normal; font-size:0.9rem;">${e.company}</span></span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              ${e.loc ? `<div style="font-size: 0.78rem; color:#777; margin-bottom: 0.25rem;">📍 ${e.loc}</div>` : ''}
              <div class="ro-item-desc">${bulletFn(e.desc)}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      education: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Education</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.deg}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub" style="font-weight:normal;">${e.inst} ${e.gpa ? ` | GPA: ${e.gpa}` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      skills: (tech, soft, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Skills</h2><div style="font-size:0.825rem; line-height:1.5;">`;
        if (tech && tech.length > 0) {
          h += `<div><strong>Technical Tools:</strong> ${tech.join(', ')}</div>`;
        }
        if (soft && soft.length > 0) {
          h += `<div><strong>Core Competencies:</strong> ${soft.join(', ')}</div>`;
        }
        return h + '</div></div>';
      },
      projects: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Projects</h2>`;
        list.forEach(p => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${p.name}</span>
                <span class="ro-item-date">${p.year || ''}</span>
              </div>
              <div class="ro-item-desc">${p.desc || ''} ${p.url ? `<a href="https://${p.url}" target="_blank" style="color:#555; text-decoration:underline;">[Link]</a>` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      certs: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Certifications</h2><div style="font-size:0.825rem;">`;
        const items = list.map(c => `<strong>${c.name}</strong> ${c.issuer ? `(${c.issuer})` : ''}`);
        return h + items.join('  •  ') + '</div></div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">Details</h2><div style="font-size:0.825rem; line-height:1.5;">`;
        if (langs) h += `<div><strong>Languages:</strong> ${langs}</div>`;
        if (hobbies) h += `<div><strong>Hobbies:</strong> ${hobbies}</div>`;
        if (ach) h += `<div><strong>Achievements:</strong> ${ach}</div>`;
        return h + '</div></div>';
      },
      custom: (title, body, acc, bulletFn) => `<div class="ro-section"><h2 class="ro-title" style="border-color:${acc}">${title}</h2><div class="ro-item-desc">${bulletFn(body)}</div></div>`
    },

    bold: {
      summary: (text, acc) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}"><style>.ro-bold .ro-title::before{background-color:${acc} !important;}</style>Summary</h2><p class="ro-summary">${text}</p></div>`,
      experience: (list, acc, bulletFn) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Experience</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title" style="color:${acc}">${e.title}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub"><strong>${e.company}</strong> ${e.loc ? `| ${e.loc}` : ''}</div>
              <div class="ro-item-desc">${bulletFn(e.desc)}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      education: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Education</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.deg}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub">${e.inst} ${e.gpa ? `| GPA: ${e.gpa}` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      skills: (tech, soft, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Skills</h2>`;
        if (tech && tech.length > 0) {
          h += `
            <div style="margin-bottom:0.5rem; display:flex; flex-wrap:wrap; gap:0.4rem; align-items:center;">
              <strong style="font-size:0.8rem; text-transform:uppercase; color:#666;">Technical:</strong>
              <div class="ro-skills-wrap">${tech.map(s => `<span class="ro-skill-pill" style="background-color:#f5f5f5; border:1px solid #ddd; color:#111;">${s}</span>`).join('')}</div>
            </div>
          `;
        }
        if (soft && soft.length > 0) {
          h += `
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; align-items:center;">
              <strong style="font-size:0.8rem; text-transform:uppercase; color:#666;">Professional:</strong>
              <div class="ro-skills-wrap">${soft.map(s => `<span class="ro-skill-pill" style="background-color:${acc}15; color:${acc}; font-weight:700;">${s}</span>`).join('')}</div>
            </div>
          `;
        }
        return h + '</div>';
      },
      projects: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Projects</h2>`;
        list.forEach(p => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title" style="color:${acc}">${p.name}</span>
                <span class="ro-item-date">${p.year || ''}</span>
              </div>
              <div class="ro-item-desc">${p.desc || ''} ${p.url ? `<a href="https://${p.url}" target="_blank" style="color:${acc}; font-weight:700;">[🔗 Website]</a>` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      certs: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Certifications</h2><ul style="padding-left:1.25rem; font-size:0.825rem;">`;
        list.forEach(c => {
          h += `<li style="margin-bottom:0.25rem;"><strong>${c.name}</strong> ${c.issuer ? `(${c.issuer})` : ''}</li>`;
        });
        return h + '</ul></div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Additions</h2><div style="font-size:0.825rem; line-height:1.5;">`;
        if (langs) h += `<div><strong>Languages:</strong> ${langs}</div>`;
        if (hobbies) h += `<div><strong>Hobbies & Interests:</strong> ${hobbies}</div>`;
        if (ach) h += `<div><strong>Honors & Awards:</strong><br>${ach}</div>`;
        return h + '</div></div>';
      },
      custom: (title, body, acc, bulletFn) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">${title}</h2><div class="ro-item-desc">${bulletFn(body)}</div></div>`
    },

    tech: {
      summary: (text, acc) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* professional_summary */</h2><p class="ro-summary" style="font-family:var(--font-mono); font-size:0.8rem; color:#444;">${text}</p></div>`,
      experience: (list, acc, bulletFn) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* experience_log */</h2>`;
        list.forEach(e => {
          // Format custom bullets for tech: › prefix
          const bulletsHTML = e.desc.split('\n').filter(b => b.trim()).map(line => {
            const clean = line.replace(/^[•\-*›]\s*/, '').trim();
            return `<div class="ro-bullet"><span style="color:${acc}">&gt;</span><span>${clean}</span></div>`;
          }).join('');

          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title" style="color:${acc};">${e.title}</span>
                <span class="ro-item-date">${e.start || ''} - ${e.end || ''}</span>
              </div>
              <div style="font-size:0.8rem; font-weight:bold; margin-bottom: 0.35rem;">@ ${e.company} ${e.loc ? `[${e.loc}]` : ''}</div>
              <div class="ro-item-desc" style="font-family:var(--font-mono); font-size:0.78rem;">${bulletsHTML}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      education: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* academic_record */</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.deg}</span>
                <span class="ro-item-date">${e.start || ''} - ${e.end || ''}</span>
              </div>
              <div style="font-size:0.8rem;">class ${e.inst.replace(/\s+/g, '')} { gpa: ${e.gpa || '10.0'} }</div>
              ${e.course ? `<div style="font-size:0.75rem; color:#555; font-family:var(--font-mono);">// Coursework: ${e.course}</div>` : ''}
            </div>
          `;
        });
        return h + '</div>';
      },
      skills: (tech, soft, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* tech_stack */</h2><div class="ro-skills-wrap">`;
        const all = [...tech, ...soft];
        h += all.map(s => `<span class="ro-skill-pill" style="border:1px solid #ddd; background:#fafafa; font-family:var(--font-mono); font-size:0.75rem;">[${s}]</span>`).join('');
        return h + '</div></div>';
      },
      projects: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* git_projects */</h2>`;
        list.forEach(p => {
          h += `
            <div class="ro-item">
              <div class="ro-item-header">
                <span class="ro-item-title" style="color:${acc};">${p.name}</span>
                <span class="ro-item-date">${p.year || ''}</span>
              </div>
              ${p.tech ? `<div style="font-size:0.75rem; font-family:var(--font-mono); color:#666;">import { ${p.tech.split(',').map(s => s.trim()).join(', ')} }</div>` : ''}
              <div class="ro-item-desc" style="font-size:0.8rem;">${p.desc || ''} ${p.url ? `<a href="https://${p.url}" style="color:${acc}; font-weight:bold;">[code]</a>` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      certs: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* verified_certifications */</h2><div style="font-size: 0.8rem; font-family:var(--font-mono);">`;
        list.forEach(c => {
          h += `<div>const ${c.name.replace(/[^a-zA-Z]/g, '')} = "${c.issuer || 'Issuer'}";</div>`;
        });
        return h + '</div></div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* config_parameters */</h2><div style="font-size: 0.8rem; font-family:var(--font-mono); color:#555;">`;
        if (langs) h += `<div>languages = [ "${langs.split(',').map(s => s.trim()).join('", "')}" ];</div>`;
        if (hobbies) h += `<div>interests = [ "${hobbies.split(',').map(s => s.trim()).join('", "')}" ];</div>`;
        if (ach) h += `<div>achievements = \`${ach.replace(/`/g, '\\`').trim()}\`;</div>`;
        return h + '</div></div>';
      },
      custom: (title, body, acc, bulletFn) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}; border-color:${acc}">/* ${title.toLowerCase().replace(/\s+/g, '_')} */</h2><div class="ro-item-desc">${bulletFn(body)}</div></div>`
    },

    creative: {
      summary: (text, acc) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Summary</h2><p class="ro-summary">${text}</p></div>`,
      experience: (list, acc, bulletFn) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Experience</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item" style="background-color:#fafaff; border-left:3px solid ${acc}; padding:0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.25rem;">
              <div class="ro-item-header">
                <span class="ro-item-title" style="color:${acc}">${e.title}</span>
                <span class="ro-item-date" style="font-weight:bold; color:${acc};">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub"><strong>${e.company}</strong> ${e.loc ? `• ${e.loc}` : ''} ${e.type ? `(${e.type})` : ''}</div>
              <div class="ro-item-desc" style="margin-top:0.5rem;">${bulletFn(e.desc)}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      education: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Education</h2>`;
        list.forEach(e => {
          h += `
            <div class="ro-item" style="margin-bottom:1rem;">
              <div class="ro-item-header">
                <span class="ro-item-title">${e.deg}</span>
                <span class="ro-item-date">${e.start || ''} — ${e.end || ''}</span>
              </div>
              <div class="ro-item-sub" style="color:#555;">${e.inst}</div>
              ${e.course ? `<div style="font-size:0.75rem; color:#777; margin-top:0.2rem;">Coursework: ${e.course}</div>` : ''}
            </div>
          `;
        });
        return h + '</div>';
      },
      skills: (tech, soft, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Skills</h2><div class="ro-skills-wrap">`;
        h += tech.map(s => `<span class="ro-skill-pill" style="background-color:${acc}; color:#fff;">${s}</span>`).join('');
        h += soft.map(s => `<span class="ro-skill-pill" style="background-color:#eef; color:${acc}; font-weight:700;">${s}</span>`).join('');
        return h + '</div></div>';
      },
      projects: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Projects</h2>`;
        list.forEach(p => {
          h += `
            <div class="ro-item" style="border: 1px solid #eee; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem;">
              <div class="ro-item-header">
                <span class="ro-item-title">${p.name}</span>
                <span class="ro-item-date" style="font-size:0.75rem; background:#f0f0f5; padding: 0.1rem 0.4rem; border-radius:4px;">${p.year || ''}</span>
              </div>
              ${p.tech ? `<div style="font-size:0.75rem; color:#777; margin-top:0.15rem; font-style:italic;">Stack: ${p.tech}</div>` : ''}
              <div class="ro-item-desc" style="margin-top:0.4rem;">${p.desc || ''} ${p.url ? `<a href="https://${p.url}" target="_blank" style="color:${acc}; font-weight:700;">🔗 Link</a>` : ''}</div>
            </div>
          `;
        });
        return h + '</div>';
      },
      certs: (list, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Credentials</h2><ul style="padding-left:1.25rem; font-size:0.825rem;">`;
        list.forEach(c => {
          h += `<li style="margin-bottom:0.25rem; color:#444;"><strong>${c.name}</strong> ${c.issuer ? `— ${c.issuer}` : ''}</li>`;
        });
        return h + '</ul></div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">Extra</h2><div style="font-size:0.825rem; line-height:1.5; color:#444;">`;
        if (langs) h += `<div><strong>Languages:</strong> ${langs}</div>`;
        if (hobbies) h += `<div><strong>Interests:</strong> ${hobbies}</div>`;
        if (ach) h += `<div style="margin-top:0.25rem;"><strong>Highlights:</strong><br>${ach}</div>`;
        return h + '</div></div>';
      },
      custom: (title, body, acc, bulletFn) => `<div class="ro-section"><h2 class="ro-title" style="color:${acc}">${title}</h2><div class="ro-item-desc" style="background:#fafaff; border-left:3px solid ${acc}; padding:0.75rem 1rem; border-radius: 0 6px 6px 0;">${bulletFn(body)}</div></div>`
    },
    academic: {
      summary: (text, acc) => `
        <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
          <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">BRIEF OVERVIEW / CAREER OBJECTIVE / SUMMARY</div>
          <p class="ro-summary" style="font-size: 0.8rem; line-height: 1.45; color: #222; padding-left: 0.25rem; text-align: justify; margin-bottom: 0.5rem;">${text}</p>
        </div>
      `,
      experience: (list, acc, bulletFn) => {
        let h = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">SEMINARS / TRAININGS / WORKSHOPS</div>
            <div class="ro-academic-card" style="border: 1px solid #c9e8f2; background-color: #f7fbfd; padding: 0.6rem 0.8rem; border-radius: 3px; margin-bottom: 0.5rem;">
        `;
        list.forEach((e, idx) => {
          const descHTML = e.desc ? e.desc.split('\n').filter(Boolean).map(line => {
            const clean = line.replace(/^[•\-*›]\s*/, '').trim();
            return `<div style="margin-top: 0.15rem; line-height: 1.45; color: #333; font-size: 0.8rem; text-align: justify;">${clean}</div>`;
          }).join('') : '';

          const mbStyle = idx === list.length - 1 ? '' : 'margin-bottom: 0.6rem;';
          h += `
            <div class="ro-item" style="${mbStyle}">
              <div class="ro-item-header" style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.825rem; color: #222; margin-bottom: 0.15rem;">
                <span class="ro-item-title">${e.title}</span>
                ${(e.start || e.end) ? `<span class="ro-item-date" style="font-weight: normal; color: #555; font-size: 0.78rem;">${e.start || ''}${e.end ? ' — ' + e.end : ''}</span>` : ''}
              </div>
              <div class="ro-item-desc" style="font-size: 0.8rem; line-height: 1.45; color: #333;">${descHTML}</div>
            </div>
          `;
        });
        return h + '</div></div>';
      },
      education: (list, acc) => {
        let h = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">EDUCATION</div>
            <div class="ro-academic-card" style="border: 1px solid #c9e8f2; background-color: #f7fbfd; padding: 0.6rem 0.8rem; border-radius: 3px; margin-bottom: 0.5rem;">
        `;
        list.forEach((e, idx) => {
          let degText = e.deg;
          degText = degText.replace(/12th/gi, '12<sup>th</sup>').replace(/10th/gi, '10<sup>th</sup>');

          const isSchool = e.deg.toLowerCase().includes('12th') || e.deg.toLowerCase().includes('10th') || e.deg.toLowerCase().includes('secondary') || e.deg.toLowerCase().includes('matric');
          const mbStyle = idx === list.length - 1 ? '' : 'margin-bottom: 0.5rem;';

          if (isSchool) {
            h += `
              <div class="ro-item" style="${mbStyle}">
                <div class="ro-item-header" style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #222; margin-bottom: 0.15rem;">
                  <span class="ro-item-title" style="font-weight: normal;"><strong>${degText}</strong> | ${e.inst || ''} ${e.gpa ? ' | Aggregate: ' + e.gpa : ''}</span>
                  <span class="ro-item-date" style="font-weight: normal; color: #555; font-size: 0.78rem;">${e.end || e.start || ''}</span>
                </div>
              </div>
            `;
          } else {
            h += `
              <div class="ro-item" style="${mbStyle}">
                <div class="ro-item-header" style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.825rem; color: #222; margin-bottom: 0.15rem;">
                  <span class="ro-item-title">${e.inst}</span>
                  <span class="ro-item-date" style="font-weight: normal; color: #555; font-size: 0.78rem;">${e.start || ''}${e.end ? ' - ' + e.end : ''}</span>
                </div>
                <div class="ro-item-sub" style="font-size: 0.8rem; color: #333; font-weight: 500; margin-bottom: 0.15rem;">${degText} ${e.gpa ? ' | SGPA/CGPA: ' + e.gpa : ''}</div>
                ${e.course ? `<div class="ro-item-desc" style="font-size: 0.78rem; color: #666; margin-top: 0.1rem; padding-left: 0.25rem;">Coursework: ${e.course}</div>` : ''}
              </div>
            `;
          }
        });
        return h + '</div></div>';
      },
      skills: (tech, soft, acc) => {
        let h = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">KEY EXPERTISE / SKILLS</div>
            <div class="ro-academic-card" style="border: 1px solid #c9e8f2; background-color: #f7fbfd; padding: 0.6rem 0.8rem; border-radius: 3px; margin-bottom: 0.5rem; font-size: 0.8rem; line-height: 1.45; color: #333;">
        `;
        if (tech && tech.length > 0) {
          h += `
            <div style="margin-bottom: 0.35rem;">
              <div style="font-weight: 700; color: #111; display: flex; gap: 0.4rem; align-items: center;">
                <span style="color: ${acc}; font-size: 0.75rem;">▫</span>
                <span>Technical:</span>
              </div>
              <div style="padding-left: 0.85rem; color: #333; margin-top: 0.15rem;">${tech.join(', ')}</div>
            </div>`;
        }
        if (soft && soft.length > 0) {
          h += `
            <div>
              <div style="font-weight: 700; color: #111; display: flex; gap: 0.4rem; align-items: center;">
                <span style="color: ${acc}; font-size: 0.75rem;">▫</span>
                <span>Soft Skills:</span>
              </div>
              <div style="padding-left: 0.85rem; color: #333; margin-top: 0.15rem;">${soft.join(', ')}</div>
            </div>`;
        }
        return h + '</div></div>';
      },
      projects: (list, acc) => {
        let h = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">PROJECTS</div>
            <div class="ro-academic-card" style="border: 1px solid #c9e8f2; background-color: #f7fbfd; padding: 0.6rem 0.8rem; border-radius: 3px; margin-bottom: 0.5rem;">
        `;
        list.forEach((p, idx) => {
          const mbStyle = idx === list.length - 1 ? '' : 'margin-bottom: 0.6rem;';

          let descHTML = '';
          if (p.desc) {
            descHTML = p.desc.split('\n').map(line => {
              const clean = line.replace(/^[•\-*›▫○o]\s*/, '').trim();
              if (clean.includes('|')) {
                let boldClean = clean
                  .replace(/Mentor\s*:/gi, '<strong>Mentor:</strong>')
                  .replace(/TeamSize\s*:/gi, '<strong>Team Size:</strong>')
                  .replace(/Team Size\s*:/gi, '<strong>Team Size:</strong>')
                  .replace(/No\.\s*of\s*Authors\s*:/gi, '<strong>No. of Authors:</strong>');
                return `<div style="font-size: 0.8rem; margin-top: 0.15rem; margin-bottom: 0.15rem; color: #333; padding-left: 0.85rem;">${boldClean}</div>`;
              }
              return `<div style="padding-left: 0.85rem; text-align: justify; margin-top: 0.2rem; line-height: 1.45;">${clean}</div>`;
            }).join('');
          }

          h += `
            <div class="ro-item" style="${mbStyle}">
              <div class="ro-item-header" style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.825rem; color: #222; margin-bottom: 0.15rem;">
                <div style="display: flex; gap: 0.4rem; align-items: flex-start;">
                  <span style="color: ${acc}; font-size: 0.75rem; margin-top: 0.1rem;">▫</span>
                  <span class="ro-item-title" style="font-weight: 700;">${p.name}</span>
                </div>
                <span class="ro-item-date" style="font-weight: normal; color: #555; font-size: 0.78rem;">${p.year || ''}</span>
              </div>
              ${p.tech ? `<div style="font-size: 0.8rem; color: #333; padding-left: 0.85rem; margin-top: 0.15rem; margin-bottom: 0.15rem;"><strong>Key Skills:</strong> ${p.tech}</div>` : ''}
              <div class="ro-item-desc" style="font-size: 0.8rem; line-height: 1.45; color: #333;">
                ${descHTML}
                ${p.url ? `<div style="padding-left: 0.85rem; margin-top: 0.15rem;"><a href="https://${p.url}" target="_blank" style="color: ${acc}; font-size: 0.78rem; font-weight: 600;">[Link]</a></div>` : ''}
              </div>
            </div>
          `;
        });
        return h + '</div></div>';
      },
      certs: (list, acc) => {
        let h = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">AWARDS</div>
        `;
        list.forEach(c => {
          h += `
            <div style="margin-bottom: 0.5rem; padding-left: 0.25rem;">
              <div style="display: flex; gap: 0.4rem; align-items: flex-start; font-size: 0.8rem; line-height: 1.4; color: #111;">
                <span style="color: ${acc}; flex-shrink: 0; margin-top: 0.1rem;">▫</span>
                <div>
                  <strong style="color: #111;">${c.name}</strong>
                  ${c.issuer ? `<div style="font-size: 0.8rem; color: #333; margin-top: 0.2rem; line-height: 1.45; text-align: justify;">${c.issuer}</div>` : ''}
                </div>
              </div>
            </div>
          `;
        });
        return h + '</div>';
      },
      extras: (langs, hobbies, ach, acc) => {
        let h = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">ACHIEVEMENTS</div>
            <div style="font-size: 0.8rem; line-height: 1.45; color: #333; padding-left: 0.25rem;">
        `;
        if (ach) {
          h += `<div style="margin-bottom: 0.35rem;">${ach.split('\n').filter(line => line.trim()).map(line => {
            const clean = line.replace(/^[•\-*›o▫○]\s*/, '').trim();
            return `<div style="display:flex; gap:0.4rem; align-items:flex-start; margin-bottom:0.2rem; font-size:0.8rem;">
              <span style="color: ${acc}; flex-shrink: 0; font-size: 0.75rem; margin-top: 0.1rem;">○</span>
              <span style="text-align: justify;">${clean}</span>
            </div>`;
          }).join('')}</div>`;
        }
        if (langs) {
          h += `<div style="margin-top: 0.35rem; font-size: 0.8rem; padding-left: 0.25rem;"><strong>Languages Known:</strong> ${langs}</div>`;
        }
        if (hobbies) {
          h += `<div style="margin-top: 0.15rem; font-size: 0.8rem; padding-left: 0.25rem;"><strong>Interests / Hobbies:</strong> ${hobbies}</div>`;
        }
        return h + '</div></div>';
      },
      custom: (title, body, acc, bulletFn) => {
        let html = `
          <div class="ro-section" style="margin-bottom: 0.75rem; page-break-inside: avoid;">
            <div class="ro-section-banner" style="background-color: ${acc}; color: #ffffff; padding: 0.35rem 0.65rem; font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">${title}</div>
            <div class="ro-academic-card" style="border: 1px solid #c9e8f2; background-color: #f7fbfd; padding: 0.6rem 0.8rem; border-radius: 3px; margin-bottom: 0.5rem;">
              <div class="ro-item-desc" style="font-size: 0.8rem; line-height: 1.45; color: #333;">
        `;
        let isNewItem = true;
        const lines = body.split('\n').filter(line => line.trim());
        lines.forEach((line, idx) => {
          const clean = line.replace(/^[•\-*›▫○o]\s*/, '').trim();
          if (clean.includes('|')) {
            let boldClean = clean
              .replace(/Mentor\s*:/gi, '<strong>Mentor:</strong>')
              .replace(/TeamSize\s*:/gi, '<strong>Team Size:</strong>')
              .replace(/Team Size\s*:/gi, '<strong>Team Size:</strong>')
              .replace(/No\.\s*of\s*Authors\s*:/gi, '<strong>No. of Authors:</strong>');
            html += `<div style="font-size: 0.8rem; margin-top: 0.15rem; margin-bottom: 0.15rem; color: #333; padding-left: 0.85rem;">${boldClean}</div>`;
            isNewItem = false;
          } else if (clean.startsWith('Key Skills:') || clean.startsWith('Key Skills :')) {
            const skillsText = clean.substring(clean.indexOf(':') + 1).trim();
            html += `<div style="font-size: 0.8rem; line-height: 1.45; color: #333; padding-left: 0.85rem; margin-top: 0.15rem; margin-bottom: 0.15rem;"><strong>Key Skills:</strong> ${skillsText}</div>`;
            isNewItem = true;
          } else {
            if (isNewItem || idx === 0) {
              html += `
                <div style="display: flex; gap: 0.4rem; align-items: flex-start; font-weight: 700; font-size: 0.825rem; color: #222; margin-top: 0.35rem; margin-bottom: 0.15rem;">
                  <span style="color: ${acc}; font-size: 0.75rem; margin-top: 0.1rem;">▫</span>
                  <span>${clean}</span>
                </div>
              `;
              isNewItem = false;
            } else {
              html += `<div style="font-size: 0.8rem; line-height: 1.45; color: #333; padding-left: 0.85rem; text-align: justify; margin-top: 0.15rem;">${clean}</div>`;
            }
          }
        });
        return html + '</div></div></div>';
      }
    }
  }
};
