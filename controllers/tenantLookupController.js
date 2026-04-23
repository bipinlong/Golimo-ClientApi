const conn = require('../services/db');

// GET /tenant/by-domain?domain=toyota.localhost
// Public endpoint - frontend calls this on load to resolve subdomain → tenant
exports.getTenantByDomain = (req, res) => {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ message: 'domain query param required' });
  conn.query('SELECT id, name, domain FROM tenants WHERE domain = ?', [domain], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!rows.length) return res.status(404).json({ message: 'Tenant not found: ' + domain });
    res.json(rows[0]);
  });
};
