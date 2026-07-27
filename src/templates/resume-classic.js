const generateClassicTemplate = (resume) => {
  const { personalInfo, summary, education, experience, projects, skills, certifications } = resume;

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #222; padding: 40px; }
        h1 { margin-bottom: 0; font-size: 24px; }
        .contact { font-size: 12px; color: #555; margin-bottom: 20px; }
        h2 { font-size: 15px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 20px; }
        .item { margin-bottom: 10px; }
        .item-title { font-weight: bold; }
        .item-sub { font-size: 12px; color: #555; }
        ul { margin: 4px 0; padding-left: 18px; }
        .skills-line { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <h1>${personalInfo.fullName || ''}</h1>
      <div class="contact">
        ${personalInfo.email || ''} ${personalInfo.phone ? '| ' + personalInfo.phone : ''}
        ${personalInfo.location ? '| ' + personalInfo.location : ''}
        ${personalInfo.links?.github ? '| ' + personalInfo.links.github : ''}
      </div>

      ${summary ? `<h2>Summary</h2><p>${summary}</p>` : ''}

      ${education?.length ? `
        <h2>Education</h2>
        ${education.map(e => `
          <div class="item">
            <div class="item-title">${e.degree} — ${e.institution}</div>
            <div class="item-sub">${e.fieldOfStudy || ''} (${e.startYear || ''} - ${e.endYear || ''})</div>
          </div>
        `).join('')}
      ` : ''}

      ${experience?.length ? `
        <h2>Experience</h2>
        ${experience.map(e => `
          <div class="item">
            <div class="item-title">${e.role} — ${e.company}</div>
            <div class="item-sub">${e.startDate} - ${e.isCurrent ? 'Present' : e.endDate}</div>
            <ul>${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
          </div>
        `).join('')}
      ` : ''}

      ${projects?.length ? `
        <h2>Projects</h2>
        ${projects.map(p => `
          <div class="item">
            <div class="item-title">${p.title}</div>
            <div class="item-sub">${(p.techStack || []).join(', ')}</div>
            <p>${p.description || ''}</p>
          </div>
        `).join('')}
      ` : ''}

      ${skills?.length ? `
        <h2>Skills</h2>
        ${skills.map(s => `<div class="skills-line"><b>${s.category}:</b> ${s.items.join(', ')}</div>`).join('')}
      ` : ''}

      ${certifications?.length ? `
        <h2>Certifications</h2>
        ${certifications.map(c => `<div class="item-sub">${c.name} — ${c.issuer} (${c.year})</div>`).join('')}
      ` : ''}
    </body>
  </html>
  `;
};

module.exports = generateClassicTemplate;