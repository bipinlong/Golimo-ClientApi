

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

exports.createPaymentIntent = async (req, res) => {
    const { amount, currency, description } = req.body;

    try {
        // Create a PaymentIntent with the specified amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
            description,
            automatic_payment_methods: {
                enabled: true, // Enable payment methods
            },
        });

        // Send the client secret to the frontend
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
};
