// Recursively strips keys that could be interpreted as MongoDB query operators
// ($gt, $where, etc.) or dot-notation paths from user-supplied input.
// Mutates objects in place — never reassigns req.query/req.body/req.params themselves,
// since Express 5 makes req.query a getter-only property.

const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return;

  Object.keys(obj).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      return;
    }
    if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]); // recurse into nested objects/arrays
    }
  });
};

const sanitizeInput = (req, res, next) => {
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  next();
};

module.exports = sanitizeInput;