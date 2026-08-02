// Auto-applied by Jest for every test that transitively imports 'puppeteer'.
// Puppeteer v25 is ESM-only and cannot be required under Jest's CommonJS test environment,
// so we replace it entirely with a lightweight fake that satisfies pdf.service.js's usage.

const mockPage = {
  setContent: jest.fn().mockResolvedValue(undefined),
  pdf: jest.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
};

const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: jest.fn().mockResolvedValue(undefined),
};

module.exports = {
  launch: jest.fn().mockResolvedValue(mockBrowser),
};