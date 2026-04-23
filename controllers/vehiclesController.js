
const conn = require('../services/db')
require("dotenv").config();

exports.getVehicles = (req, res) =>{
    const sqlQuery = 'SELECT * FROM vehicle WHERE status = 1 AND tenant_id = ?';

    conn.query(sqlQuery, [req.tenantId], (err, results) =>{
        if(err){
            console.error('Error fetching vehicle:', err);
            return res.status(500).send({msg:'Error fetching vehicles', error: err.message});
        } 
        res.status(200).json(results);
    })
}