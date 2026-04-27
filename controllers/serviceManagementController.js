const conn = require("../services/db");

// Get service status for current tenant (Client/Admin)
exports.getServiceStatus = (req, res) => {
  const tenantId = req.tenantId;
  
  const sql = "SELECT standard_service_status, shuttle_service_status FROM service_management WHERE tenant_id = ?";
  
  conn.query(sql, [tenantId], (err, results) => {
    if (err) {
      console.error("Error fetching service status:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch service status" });
    }
    
    // Default - both services active if no record found
    if (results.length === 0) {
      return res.json({
        success: true,
        standard_service_status: 1,
        shuttle_service_status: 1
      });
    }
    
    res.json({
      success: true,
      standard_service_status: results[0].standard_service_status,
      shuttle_service_status: results[0].shuttle_service_status
    });
  });
};