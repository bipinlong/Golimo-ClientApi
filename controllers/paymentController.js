

// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const conn = require('../services/db')



exports.getStripeConfig = (req, res) => {
    const tenantId = req.tenantId;

    const sql = `
        SELECT publishable_key, is_active 
        FROM stripe_config 
        WHERE tenant_id = ?
    `;

    conn.query(sql, [tenantId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Config not found" });
        }

        if (!results[0].is_active) {
            return res.status(403).json({ error: "Stripe inactive" });
        }

        // ✅ sirf public key bhejo
        res.json({
            publishable_key: results[0].publishable_key
        });
    });
};


// exports.createPaymentIntent = async (req, res) => {
//     const { amount, currency, paymentMethodId } = req.body;
//     const tenantId = req.tenantId;

//     // Database se secret_key fetch kar
//     const sql = "SELECT secret_key, publishable_key, is_active FROM stripe_config WHERE tenant_id = ?";
    
//     conn.query(sql, [tenantId], async (err, results) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ error: 'Failed to fetch stripe configuration' });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ error: 'Stripe configuration not found' });
//         }

//         if (!results[0].is_active) {
//             return res.status(403).json({ error: 'Stripe payment is inactive' });
//         }

//         if (!results[0].secret_key) {
//             return res.status(404).json({ error: 'Stripe secret key not configured' });
//         }

//         try {
//             // ✅ Secret key se Stripe initialize kar
//             const stripe = require('stripe')(results[0].secret_key);
            
//             // Create PaymentIntent
//             const paymentIntent = await stripe.paymentIntents.create({
//                 amount: Math.round(parseFloat(amount) * 100), // Convert to cents
//                 currency: currency || 'usd',
//                 payment_method: paymentMethodId,
//                 confirmation_method: 'manual',
//                 confirm: true,
//             });

//             res.status(200).json({
//                 success: true,
//                 clientSecret: paymentIntent.client_secret,
//                 paymentIntentId: paymentIntent.id,
//                 status: paymentIntent.status
//             });
            
//         } catch (error) {
//             console.error('Error creating payment intent:', error);
//             res.status(500).json({ 
//                 success: false,
//                 error: error.message || 'Failed to create payment intent'
//             });
//         }
//     });
// };

exports.createPaymentIntent = async (req, res) => {
    const { amount, currency, paymentMethodId } = req.body;
    const tenantId = req.tenantId;

    const sql = "SELECT secret_key, publishable_key, is_active FROM stripe_config WHERE tenant_id = ?";
    
    conn.query(sql, [tenantId], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Failed to fetch stripe configuration' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Stripe configuration not found' });
        }

        if (!results[0].is_active) {
            return res.status(403).json({ error: 'Stripe payment is inactive' });
        }

        if (!results[0].secret_key) {
            return res.status(404).json({ error: 'Stripe secret key not configured' });
        }

        try {
            const stripe = require('stripe')(results[0].secret_key);
            
            // ✅ SIMPLEST - Sirf card payments, koi automatic_payment_methods nahi
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(parseFloat(amount) * 100),
                currency: currency || 'usd',
                payment_method: paymentMethodId,
                confirm: true,
                payment_method_types: ['card']  // Sirf card payments allow
            });

            res.status(200).json({
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status
            });
            
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ 
                success: false,
                error: error.message || 'Failed to create payment intent'
            });
        }
    });
};