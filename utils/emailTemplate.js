
function generateReservationEmail(bookingId, firstName, lastName, formattedDate, formattedTime) {
    return `
        <p><strong>Reservation Reference #${bookingId}</strong></p>
        <p>Last Modified On: ${formattedDate} ${formattedTime}</p>
        <p>Your new reservation request has been received and is currently under review. As soon as it is confirmed by one of our representatives, you will be notified immediately via email, fax, or phone.</p>
        <p>If you require this service within twelve (12) hours or need further assistance with this reservation, please contact our reservation department at 800.960.0232.</p>
        <p>Thank you for using our Ground Transportation Services. We appreciate your business.</p>
    `;
}

function generateQuoteEmail(bookingId, firstName, lastName, formattedDate, formattedTime) {
    return `
        <p><strong>Quote Reference #${bookingId}</strong></p>
        <p>Last Modified On: ${formattedDate} ${formattedTime}</p>
        <p>Dear ${firstName} ${lastName},</p>
        <p>*Please note: If this service request is within twenty-four (24) hours, please contact us at 800.960.0232.</p>
        <p>Your new quote request has been received and is currently under review. It might take up to 24 hours to process. Once your request has been processed, you will receive an email with the estimated rate.</p>
        <p>In the meantime, if you require further assistance with this quote or need to book a ride, please contact us via email at <a href="mailto:reservations@bostonasapcoach.com">reservations@bostonasapcoach.com</a> or by phone: US/Canada 800.960.0232. International +1.617.630.0232.</p>
        <p>Thank you for considering our Chauffeured Transportation Services. We look forward to serving you soon.</p>
    `;
}

module.exports = { generateReservationEmail, generateQuoteEmail };
