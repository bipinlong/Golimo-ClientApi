// const conn = require('../services/db');

// // Resolves x-tenant-id header → sets req.tenantId
// // Applied to all routes that need tenant scoping
// exports.resolveTenant = (req, res, next) => {
//   const tenantId = req.headers['x-tenant-id'];
//   if (!tenantId) return res.status(400).json({ message: 'Missing x-tenant-id header' });
//   conn.query('SELECT id FROM tenants WHERE id = ?', [parseInt(tenantId)], (err, rows) => {
//     if (err) return res.status(500).json({ message: 'DB error resolving tenant' });
//     if (!rows.length) return res.status(404).json({ message: 'Tenant not found' });
//     req.tenantId = parseInt(tenantId, 10);
//     next();
//   });
// };


// middleware/tenantResolver.js
const conn = require('../services/db');

exports.resolveTenant = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  
  if (!tenantId) {
    return res.status(400).json({ message: 'Missing x-tenant-id header' });
  }
  
  const tenantIdNum = parseInt(tenantId, 10);
  
  // Check by tenant_id column, not id column
  conn.query('SELECT id, tenant_id, name FROM tenants WHERE tenant_id = ?', [tenantIdNum], (err, rows) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'DB error resolving tenant' });
    }
    
    if (!rows.length) {
      return res.status(404).json({ 
        message: 'Tenant not found',
        requestedTenantId: tenantIdNum,
        availableTenants: 'Check tenants table for valid tenant_id values'
      });
    }
    
    req.tenantId = rows[0].tenant_id; // Use tenant_id from database
    req.tenantName = rows[0].name;
    console.log(`✅ Tenant resolved: ${req.tenantName} (${req.tenantId})`);
    next();
  });
};