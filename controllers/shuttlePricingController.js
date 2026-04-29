const conn = require("../services/db");

// Get shuttle pricing for tenant
exports.getShuttlePricing = (req, res) => {
  const tenantId = req.tenantId;
  
  let sql = "SELECT pricing_data FROM shuttle_pricing WHERE tenant_id = ?";
  
  conn.query(sql, [tenantId], (err, results) => {
    if (err) {
      console.error("Error fetching shuttle pricing:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
    }
    
    let pricingData = null;
    
    if (results && results.length > 0) {
      try {
        pricingData = JSON.parse(results[0].pricing_data);
      } catch (parseErr) {
        console.error("Error parsing pricing data:", parseErr);
      }
    }
    
    // Default pricing if nothing found
    const defaultPricing = {
      port_canaveral: {
        one_way: 30,
        round_trip: 55,
        private_transfer: 80,
        luxury_suv: 120
      },
      airport: {
        one_way: 35,
        round_trip: 60,
        private_transfer: 90,
        luxury_suv: 130
      },
      disney: {
        one_way: 35,
        round_trip: 55,
        private_transfer: 120,
        child_seat: 15
      }
    };
    
    res.json({
      success: true,
      pricing: pricingData || defaultPricing
    });
  });
};