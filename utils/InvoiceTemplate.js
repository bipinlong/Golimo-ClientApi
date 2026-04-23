const generateInvoiceEmailTemplate = (data) => { 
    const { booking, invoiceData, billingContact, orderData, billingDetails, templateType } = data;
    
    const invoiceNumber = invoiceData.invoiceNumber || booking.bookingId;
    const invoiceDate = invoiceData.invoiceDate || new Date().toISOString().split('T')[0];
    const subtotal = invoiceData.subtotal || '0.00';
    const payments = invoiceData.payments || '0.00';
    const amountDue = invoiceData.amountDue || '0.00';
    const dueDate = invoiceData.invoiceDueDate || '';
    const estimatedTotal = billingDetails.estimatedTotal || '0.00';
    const passengerName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim();
    const serviceType = orderData.serviceType || '';
    const vehicleType = orderData.selectedVehicle?.vehicletype || '';
    
    const pickupAddress = orderData.pickupCoords?.address || 
        `${orderData.pickupCoords?.street || ''}, ${orderData.pickupCoords?.city || ''}, ${orderData.pickupCoords?.state || ''}`;
    
    const dropoffAddress = orderData.dropoffCoords?.address || 
        `${orderData.dropoffCoords?.street || ''}, ${orderData.dropoffCoords?.city || ''}, ${orderData.dropoffCoords?.state || ''}`;

    const capitalizeName = (name) => name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';

    return `
    <html>
<head>
    <style></style>
</head>
<body>
<div style="font-size:12px;font-family:Arial,sans-serif;">

    <!-- ********* HEADER (UNCHANGED) ********* -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:rgb(177,175,169);width:100%!important">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" width="723px" style="max-width:740px;width:100%;">
                    <tr>
                        <td style="padding:15px 15px 15px 30px;">
                            <img src="https://api.bostonasapcoach.com/images/boston_logo.png" alt="Boston Coach" width="97" height="50" style="display:block;border:0;outline:none;text-decoration:none;">
                        </td>
                        <td align="right" style="padding:15px 30px 15px 15px;">
                            <strong>Executive Chauffeured<br>Transportation Worldwide</strong>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- ********* COMPANY + INVOICE DETAILS ********* -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" width="723px" style="padding: 0px 15px; width:100%;">
                    <tr>
                        <!-- LEFT COLUMN -->
                        <td style="vertical-align:top; padding:10px 20px 10px 0;">
                            <p style="margin:2px 0;"><strong>BostonAsapCoach, Inc.</strong></p>
                            <p style="margin:2px 0;">Attn: Accounts Receivable</p>
                            <p style="margin:2px 0;">724 Washington Street</p>
                            <p style="margin:2px 0;">Suite A</p>
                            <p style="margin:2px 0;">Brookline, MA 02446</p>
                            <p style="margin:2px 0;">United States</p>
                        </td>

                        <!-- RIGHT COLUMN -->
                        <td style="vertical-align:top;padding:10px 10px 10px 20px;display:flex;justify-content: end;">
                                <table style="margin-left: 60%;border-collapse:collapse;/* width:50%; */font-size:12px;color:#333;width: 320px;">
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Invoice Status:</strong></td>
                                        <td style="padding:1px 0;">${invoiceData.invoiceStatus || 'OPEN - PENDING'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Invoice Number:</strong></td>
                                        <td style="padding:1px 0;">${invoiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Invoice Date:</strong></td>
                                        <td style="padding:1px 0;">${invoiceDate}</td>
                                    </tr>
                                    ${dueDate ? `
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Due Date:</strong></td>
                                        <td style="padding:1px 0;">${dueDate}</td>
                                    </tr>` : ''}
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Payment Terms:</strong></td>
                                        <td style="padding:1px 0;">${invoiceData.invoicePaymentTerms || 'Due Upon Receipt'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Account Number:</strong></td>
                                        <td style="padding:1px 0;">${booking.account_number || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:1px 0;"><strong>Billing Type:</strong></td>
                                        <td style="padding:1px 0;">${templateType === 'template1' ? 'Credit Card Billing' : 'Direct Bill'}</td>
                                    </tr>
                                </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- ********* INSTRUCTIONS ********* -->
    <p style="margin:0 0 15px 0;line-height:1.5;">
        Please review your Invoice details carefully. If any of the information appears to be incorrect or you have any questions about this invoice,
        please contact our billing department immediately via email
        <a href="mailto:billing_inquiries@bostonasapcoach.com" style="color:#2F7CBC;text-decoration:none;">billing_inquiries@bostonasapcoach.com</a>
        or by phone toll-free US/Canada 800.960.0232. International +1.617.630.0232.
        ${templateType === 'template2' ? `
        <br><br><strong>Make Check Payable To:</strong> BostonAsapCoach, Inc.<br>
        <strong>Send Payments To:</strong> 724 Washington Street, Suite A, Brookline, Massachusetts 02446 - 2107 United States` : ''}
    </p>

    <!-- ********* SERVICES TABLE ********* -->
    <table style="border-collapse:collapse;width:100%;font-size:12px;color:#333;">
        <thead>
            <tr style="background-color:#f8f9fa;">
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Date</th>
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Reservation #</th>
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Passenger Name</th>
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Service Type</th>
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Vehicle Class</th>
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Routing Details</th>
                <th style="border:1px solid #ddd;padding:8px;text-align:left;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border:1px solid #ddd;padding:8px;">${new Date(booking.createdAt).toLocaleDateString()}</td>
                <td style="border:1px solid #ddd;padding:8px;">${booking.bookingId}</td>
                <td style="border:1px solid #ddd;padding:8px;">${capitalizeName(passengerName)}</td>
                <td style="border:1px solid #ddd;padding:8px;">${serviceType}</td>
                <td style="border:1px solid #ddd;padding:8px;">${vehicleType}</td>
                <td style="border:1px solid #ddd;padding:8px;">
                    <strong>PU:</strong> ${pickupAddress}<br>
                    <strong>DO:</strong> ${dropoffAddress}
                </td>
                <td style="border:1px solid #ddd;padding:8px;">$${parseFloat(estimatedTotal).toFixed(2)}</td>
            </tr>
        </tbody>
    </table>

    <!-- ********* AMOUNT SUMMARY ********* -->
    <div style="text-align:right;margin:20px 0;font-size:12px;">
        <div><strong>Subtotal: $${parseFloat(subtotal).toFixed(2)}</strong></div>
        <div><strong>Payments: $${parseFloat(payments).toFixed(2)}</strong></div>
        <div><strong>Amount Due: $${parseFloat(amountDue).toFixed(2)}</strong></div>
    </div><br/>
    
    <!-- ********* FOOTER (UNCHANGED) ********* -->
    <p style="text-align: center;"><small style="text-align: center;">If you have questions about your account statement, please contact our Billing Department</small><br><span>Thank you for using our Chauffeured Transportation Services. <span><span>We look forward to serving you soon</span></p>

    <!-- ********* CONFIDENTIAL NOTICE (UNCHANGED) ********* -->
    <div style="font-size:10px;padding:0 40px;">
        <p>CONFIDENTIALITY NOTICE:<br>This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended solely for the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination, distribution, copying or other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail that you received this message by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.<br>Thank you.</p>
    </div>
</div>
</body>
</html>
    `;
};

module.exports = {
    generateInvoiceEmailTemplate
}