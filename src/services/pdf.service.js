const puppeteer = require('puppeteer');
const generateClassicTemplate = require('../templates/resume-classic');

const templates = {
  classic: generateClassicTemplate,
  // modern, minimal will be added here later
};

const generateResumePDF = async (resume) => {
  const templateFn = templates[resume.template] || templates.classic;
  const html = templateFn(resume);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // needed on many Linux/hosting environments
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    return pdfBuffer;
  } finally {
    await browser.close(); // always close, even if something above throws
  }
};

module.exports = { generateResumePDF };