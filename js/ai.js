/**
 * AI Enhancement & Local Optimization Engine
 */

const AIConfig = {
  provider: 'none', // 'none', 'gemini', 'anthropic'
  apiKey: '',
  model: 'gemini-2.5-flash',

  async load() {
    // 1. Try to load from local config.json file first
    try {
      const response = await fetch('config.json');
      if (response.ok) {
        const data = await response.json();
        if (data.GEMINI_API_KEY) {
          this.provider = 'gemini';
          this.apiKey = data.GEMINI_API_KEY.trim();
          this.model = (data.GEMINI_MODEL || 'gemini-2.5-flash').trim();
          return;
        }
      }
    } catch (e) {
      // Ignore if config.json is missing or blocked
    }

    // 2. Fallback to localStorage
    this.provider = localStorage.getItem('rc_ai_provider') || 'none';
    this.apiKey = localStorage.getItem('rc_ai_key') || '';
    this.model = localStorage.getItem('rc_ai_model') || 'gemini-2.5-flash';
  },

  save(provider, key, model = 'gemini-2.5-flash') {
    this.provider = provider;
    this.apiKey = key;
    this.model = model;
    localStorage.setItem('rc_ai_provider', provider);
    localStorage.setItem('rc_ai_key', key);
    localStorage.setItem('rc_ai_model', model);
  }
};

const AIEngine = {
  // Map of common passive phrases to active power verbs
  weakVerbsMap: [
    {
      patterns: [/worked on/i, /was involved in/i, /handled/i, /managed/i],
      replacements: ['Spearheaded', 'Orchestrated', 'Directed', 'Executed', 'Championed'],
      label: 'worked on'
    },
    {
      patterns: [/responsible for/i, /duties included/i, /was in charge of/i],
      replacements: ['Accountable for driving', 'Led key initiatives for', 'Oversaw execution of', 'Delegated tasks to'],
      label: 'responsible for'
    },
    {
      patterns: [/helped with/i, /assisted/i, /participated/i, /helped to/i],
      replacements: ['Collaborated to deliver', 'Supported construction of', 'Contributed core insights to', 'Facilitated development of'],
      label: 'helped'
    },
    {
      patterns: [/did/i, /made/i, /built/i, /created/i],
      replacements: ['Engineered', 'Architected', 'Designed', 'Forged', 'Authored', 'Constructed'],
      label: 'built/created'
    },
    {
      patterns: [/improved/i, /changed/i, /fixed/i],
      replacements: ['Optimized', 'Refined', 'Streamlined', 'Overhauled', 'Revitalized', 'Re-engineered'],
      label: 'improved'
    },
    {
      patterns: [/learned/i, /got experience in/i, /used/i],
      replacements: ['Mastered', 'Acquired expertise in', 'Deployed', 'Implemented', 'Leveraged'],
      label: 'used/learned'
    }
  ],

  /**
   * Local Scanner: Analyzes text client-side, returning optimization tips
   */
  scanTextLocally(text) {
    const suggestions = [];
    if (!text || text.trim().length < 5) return suggestions;

    // 1. Weak verbs checker
    this.weakVerbsMap.forEach(rule => {
      rule.patterns.forEach(pattern => {
        if (pattern.test(text)) {
          suggestions.push({
            type: 'verb',
            phrase: rule.label,
            alternatives: rule.replacements,
            message: `Found passive verb "${rule.label}". Replace with a power verb like: <strong>${rule.replacements.slice(0, 3).join(', ')}</strong>.`
          });
        }
      });
    });

    // 2. Metrics Checker: Look for numbers/percentages
    const hasMetric = /\b\d+%?\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|first|second|hundred|thousand|million)\b/i.test(text) || /\b(percent|\$|USD|INR|hours|days|weeks|months|years|users|conversion)\b/i.test(text);
    if (!hasMetric) {
      suggestions.push({
        type: 'metric',
        message: '<strong>Quantify your impact:</strong> ATS parsers and hiring managers look for metrics. Add percentages, dollar values, timelines, or volume (e.g., "Reduced page loads by 40%" or "Led a team of 4").'
      });
    }

    return suggestions;
  },

  /**
   * Connects to configured AI provider to optimize professional summary
   */
  async optimizeSummary(rawSummary) {
    await AIConfig.load();
    if (!rawSummary || rawSummary.trim().length < 10) {
      throw new Error('Please enter a longer summary first before optimizing.');
    }

    if (AIConfig.provider === 'none' || !AIConfig.apiKey) {
      // Fallback local rewrites simulation
      return this.simulateLocalAIImprovement(rawSummary, 'summary');
    }

    const prompt = `You are an expert resume writer. Improve the following candidate professional summary to make it highly professional, punchy, and optimized for applicant tracking systems. 
    
    CRITICAL INSTRUCTION: You MUST retain all original information and keep the generated text at least as long as the original text. Do not compress or shorten the text. Elevate the vocabulary and use strong action verbs. Return ONLY the improved text.
    
    Original Summary: "${rawSummary}"`;

    if (AIConfig.provider === 'gemini') {
      return this.callGeminiAPI(prompt, 800);
    } else if (AIConfig.provider === 'anthropic') {
      return this.callClaudeAPI(prompt);
    }

    return rawSummary;
  },

  /**
   * Connects to configured AI provider to optimize work experience bullet points
   */
  async optimizeBullets(rawBullets, jobTitle) {
    await AIConfig.load();
    if (!rawBullets || rawBullets.trim().length < 10) {
      throw new Error('Please write some details for this role before optimizing.');
    }

    if (AIConfig.provider === 'none' || !AIConfig.apiKey) {
      return this.simulateLocalAIImprovement(rawBullets, 'bullets', jobTitle);
    }

    const prompt = `You are an ATS resume optimization tool. Rewrite the following work responsibilities for a "${jobTitle || 'Professional'}" role.
    
    CRITICAL INSTRUCTION: You MUST retain all original information and keep the generated text at least as long as the original text. Do not compress or shorten the text.
    Make each bullet point start with a strong action verb, specify the technical skill used, and prompt or guess reasonable numeric impacts (e.g., increased efficiency by X%, saved Y hours, managed Z users) where appropriate to make it metric-driven.
    Output each bullet point on a new line starting with a bullet character (•). Do not include any intro, explanations, or outro. Return ONLY the enhanced bullet points.
    
    Original Responsibilities:
    ${rawBullets}`;

    if (AIConfig.provider === 'gemini') {
      return this.callGeminiAPI(prompt, 1000);
    } else if (AIConfig.provider === 'anthropic') {
      return this.callClaudeAPI(prompt);
    }

    return rawBullets;
  },

  /**
   * Google Gemini API direct client fetch
   */
  async callGeminiAPI(prompt, maxTokens = 300) {
    const model = AIConfig.model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${AIConfig.apiKey}`;
    const body = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.2
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Gemini API call failed.');
      }

      const resJson = await response.json();
      const txt = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!txt) throw new Error('Received empty response from Gemini.');
      return txt.trim();
    } catch (e) {
      console.error(e);
      throw new Error(`Gemini AI Error: ${e.message}`);
    }
  },

  /**
   * Anthropic Claude API direct client fetch (Subject to CORS depending on headers)
   */
  async callClaudeAPI(prompt) {
    const url = 'https://api.anthropic.com/v1/messages';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AIConfig.apiKey,
          'anthropic-version': '2023-06-01',
          // Note: Browser execution will trigger CORS without proxy, user is warned.
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Claude API call failed.');
      }

      const resJson = await response.json();
      const txt = resJson.content?.[0]?.text;
      if (!txt) throw new Error('Received empty response from Claude.');
      return txt.trim();
    } catch (e) {
      console.error(e);
      throw new Error(`Claude AI Error: ${e.message}. Note: Anthropic restricts browser calls via CORS. We highly recommend using Google Gemini API instead.`);
    }
  },

  /**
   * Simulates AI improvements locally if API key is not configured.
   * Enhances text by replacing passive verbs and structures.
   */
  simulateLocalAIImprovement(text, type, context = '') {
    let result = text;

    if (type === 'summary') {
      // Basic enhancements: capitalize, fix passive verbs, add standard professional intro
      let lines = text.split('.').map(s => s.trim()).filter(Boolean);
      lines = lines.map(line => {
        let enhanced = line;
        AIEngine.weakVerbsMap.forEach(rule => {
          rule.patterns.forEach(pat => {
            if (pat.test(enhanced)) {
              enhanced = enhanced.replace(pat, rule.replacements[0]);
            }
          });
        });
        return enhanced;
      });

      // Capitalize properly
      result = lines.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('. ') + '.';
      if (!result.includes('Results-driven') && !result.includes('Result-oriented') && !result.includes('Dedicated')) {
        result = 'Results-driven professional with a proven track record. ' + result;
      }
    } else {
      // Bullets
      let lines = text.split('\n').map(s => s.trim()).filter(Boolean);
      const enhancedLines = lines.map(line => {
        let clean = line.replace(/^[•\-*›]\s*/, '').trim();

        // Enhance weak verbs at the start of bullets
        AIEngine.weakVerbsMap.forEach(rule => {
          rule.patterns.forEach(pat => {
            const startPattern = new RegExp('^' + pat.source, 'i');
            if (startPattern.test(clean)) {
              clean = clean.replace(startPattern, rule.replacements[0]);
            }
          });
        });

        // Ensure starts with upper case
        clean = clean.charAt(0).toUpperCase() + clean.slice(1);

        // Append metric tip if missing numbers
        if (!/\d/.test(clean)) {
          clean += ' resulting in a 15% increase in efficiency';
        }

        return `• ${clean}`;
      });
      result = enhancedLines.join('\n');
    }

    return result;
  }
};
