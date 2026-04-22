const conn = require('../services/db');

// Resolves x-tenant-id header → sets req.tenantId
// Applied to all routes that need tenant scoping
exports.resolveTenant = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) return res.status(400).json({ message: 'Missing x-tenant-id header' });
  conn.query('SELECT id FROM tenants WHERE id = ?', [parseInt(tenantId)], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error resolving tenant' });
    if (!rows.length) return res.status(404).json({ message: 'Tenant not found' });
    req.tenantId = parseInt(tenantId, 10);
    next();
  });
};
