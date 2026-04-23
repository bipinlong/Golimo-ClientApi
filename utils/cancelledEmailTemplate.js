

exports.cancellationTemplate = (bookingId, userEmail, formattedPickUpDateTime, firstName, lastName, bookingTime, billingContact) => {
    const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const emailSubject = `Ride Cancellation: Reservation #${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedPickUpDateTime}]`;

    const formatToMMDDYYYYWithTime = (dateStr) => {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-');
        let [hours, minutes, seconds] = timePart.split(':');
        const ampm = +hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };
  
    const formattedBookingTime = formatToMMDDYYYYWithTime(bookingTime);


            const commonStyles = `
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; max-width: 100%; margin: 0 auto; }
            td { font-family: Arial, sans-serif; font-size: 13px; color: #333333; }
            a { color: #007bff; text-decoration: none; }
            .logo, img#m_-6703129678938271976m_-8659832897488455608Picture_x0020_1 { 
                width: 1.0138in !important; 
                height: 0.5208in !important;
                max-width: 1.0138in !important;
                display: block !important;
            }
            .header-bg { background-color: #f5f5f5; }
            .reference-bg { background-color: #eeeeee; }
            .confidential { font-size: 10px; }
        `;

        const confidentialNotice = `
        <tr>
            <td colspan="2" style="padding: 15px 30px; font-size: 10px;">
            <p style="margin: 0;">CONFIDENTIALITY NOTICE:</p>
            <p style="margin: 4px 0 0 0;">
                This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended solely for the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination, distribution, copying or other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail that you received this message by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.<br />Thank you.
            </p>
            </td>
        </tr>
        `;
    const emailBody = `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Quote Request</title>
                <style>${commonStyles}</style>
                </head>
                <body>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:rgb(177, 175, 169); width: 100% !important;">
                    <tr>
                    <td align="center">
                        <!-- Centered inner table with fixed width -->
                        <table cellpadding="0" cellspacing="0" width="700px" style="max-width: 700px; width: 100%;">
                        <tr>
                            <td style="padding: 15px 15px 15px 30px;">
                            <img 
                                src="https://api.bostonasapcoach.com/images/boston_logo.png" 
                                alt="Boston Coach" 
                                width="97" height="50"
                                style="display: block; width: 97px; height: 50px; border: 0; outline: none; text-decoration: none;"
                                />
                            </td>
                            <td align="right" style="padding: 15px 30px 15px 15px;">
                            <strong>Executive Chauffeured<br />Transportation Worldwide</strong>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                  <table cellpadding="0" cellspacing="0" align="center" style="width: 700px; max-width: 700px; margin: 0 auto;">
                        <tr>
                        <td colspan="2" style="height: 35px;"></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Ride Cancellation Pending: Reservation #${bookingId}</td>
                                        <td align="right" style="padding: 10px 25px; font-size:14px; background-color: #eeeeee;">Last Modified On:  ${formattedBookingTime}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>                    
                        <td colspan="2" style="padding: 20px 30px;">
                            <p>Your Ride Cancellation request has been received and is currently under review by our staff. As soon as it is revied and Cancellation is Confirmed you will be notify immediately.</p>
                            <p>If you require this Ride Cancellation with in Twelve (12) Hours or need further assistance with this Modification, please contact us by Phone toll-free US/Canada 800.960.0232.        
                                    International +1.617.630.0232. We are Here to Assist You 24/7.</p>
                            <p style="text-align: center; margin-top: 20px;">Thank you for considering our Chauffeured Transportation Services<br />We look forward to serving you again soon</p>
                        </td>
                    </tr>           
                    ${confidentialNotice}
                </table>
                </body>
                </html>
                    `;

    return emailBody
};


exports.generateAdminBookingCancelEmail = ({ bookingId, firstName, lastName, email, phone, combinedData, formattedTime, returnservice, bookActionType, paymentDetails, billingContact }) => {

    const { pickUpDate, pickUpTime } = combinedData;

    const formatDateFromString = (dateStr) => {
        if (!dateStr) return '';

        const parts = dateStr.split(' ');
        if (parts.length < 6) return '';

        const dayName = parts[0];           // Tue
        const monthName = parts[1];         // May
        const day = parts[2];               // 20
        const year = parts[3];              // 2025

        const months = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04',
            May: '05', Jun: '06', Jul: '07', Aug: '08',
            Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        };

        const month = months[monthName] || '00';

        return `${month}-${day}-${year} - ${getFullDayName(dayName)}`;
    };

    const getFullDayName = (shortDay) => {
        const map = {
            Sun: 'Sunday',
            Mon: 'Monday',
            Tue: 'Tuesday',
            Wed: 'Wednesday',
            Thu: 'Thursday',
            Fri: 'Friday',
            Sat: 'Saturday'
        };
        return map[shortDay] || '';
    };

    // Converts: Tue May 20 2025 17:00:00 GMT+0530 --> 5:00 PM
    const formatTimeFromString = (dateStr) => {
        if (!dateStr) return '';

        const timePart = dateStr.split(' ')[4]; // 17:00:00
        if (!timePart) return '';

        const [hoursStr, minutes] = timePart.split(':');
        let hours = parseInt(hoursStr, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${ampm}`;
    };

    // Format date and time
    const formattedDate = formatDateFromString(pickUpDate);   // 05-20-2025 - Tuesday
    const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();



    let emailContent = `  
        <html>    
            <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
            <body>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    font-family: Arial, sans-serif;
                    flex-wrap: wrap;
                    padding: 10px 0; ">
                    <div style="
                        text-align: right; 
                        flex: 1; 
                        min-width: 150px; 
                        padding: 5px;
                        font-size: 14px;
                        line-height: 1.5;
                    ">
                        <table  style="border-collapse: collapse;  width: 100%; font-family: Arial, sans-serif;">
                            <tr>
                                <td style="font-weight: bold; font-size: 20px; line-height: 1.9; padding-left: 45px; margin-buttom:'20px'; padding-bottom:'20px'; font-family: Arial, sans-serif;">
                              Ride Cancellation
                            </td>
                        </tr>
                        </table>
                    </div>
                </div>  
                 <table style="border-collapse: collapse; width: 70%; font-size: 14px; color: #333; font-family: Arial, sans-serif; margin-bottom:20px">
                <tr>
                    <td style="width: 32%; padding-left: 50px; font-size: 14px;"><strong> Reservation Number:</strong></td>
                    <td>${bookingId}</td>
                </tr>
                </table>
                 <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif;">
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong> Pick-up Date / Day:</strong></td>
                    <td>${formattedDate}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Pick-up Time:</strong></td>
                    <td>${formattedTime}</td>
                </tr>
                 <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Passenger Name:</strong></td>
                    <td>${capitalizeName(firstName)} ${capitalizeName(lastName)}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Passenger Phone:</strong></td>
                    <td>${phone}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong> Passenger Email: </strong></td>
                    <td>${email} </td>
                </tr>
                <tr>   
                ${combinedData?.passengerInfo?.passengers?.length > 0 ? combinedData.passengerInfo.passengers.map((passenger) => `
                <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Additional Passenger Name:</strong></td>
                    <td>${capitalizeName(passenger.firstname)} ${capitalizeName(passenger.lastname)}</td>
                </tr>
                 ${passenger?.phone ? `
                <tr>
                    <td style="width: 32%; padding-left: 50px;"><strong>Additional Passenger Phone:</strong></td>
                    <td>+${passenger.phone}</td>
                </tr>` : ''}
                ${passenger?.email ? `
                <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Additional Passenger Email:</strong></td>
                    <td>${passenger.email}</td>
                </tr>` : ''}
                `).join('') : ''}
                <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Number of Passenger(s):</strong></td>
                    <td>${combinedData?.passengers || '0'}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Number of Luggage(s):</strong></td>
                    <td>${combinedData?.luggage || '0'}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px;"><strong>Type of Service:</strong></td>
                    <td>${combinedData?.serviceType || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Vehicle Class:</strong></td>
                    <td>${combinedData?.selectedVehicle?.name || 'N/A'}</td>
                </tr>
                 <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Vehicle Capacity:</strong></td>
                    <td>${combinedData?.selectedVehicle?.passenger || 'N/A'}</td>
                </tr>
                 <tr>
                    <td style="width: 32%; padding-left: 50px; "><strong>Vehicle Quantity:</strong></td>
                     <td>${combinedData?.selectedVehicle ? 1 : 'N/A'}</td>
                </tr>
                <tr>
                 ${combinedData.childSeats.map(seat => {
                    return `
                    <tr>
                        <td style="width:32%; padding-left: 50px"><strong>Seat Type:</strong></td>
                        <td >${seat.type}</td>
                    </tr>
                    <tr>
                        <td style="width:32%; padding-left: 50px"><strong>Quantity:</strong></td>
                        <td >${seat.quantity}</td>
                    </tr>`;
                }).join('')}
                    </tr>
                    <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
              <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif; margin-bottom:5px;">
               <tr>
                <td style="width: 32%; padding-left: 50px; font-size: 14px; ont-family: Arial, sans-serif;margin-bottom: 5px;"><strong>Routing Details:</strong></td>     
                </tr>
               </table>
            <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif;">
            <tr>
            <td style="width: 32%; padding-left: 50px; vertical-align: top;"><strong>Pick-Up Location:</strong></td>
            <td>${combinedData?.pickupCoords?.address || 'N/A'}</td>
            </tr>
            ${combinedData.stops && combinedData.stops.length > 0 
                ? `<tr>
                    <td style="width: 32%; padding-left: 50px; vertical-align: top;"><strong>Stop:</strong></td>
                    <td>
                    ${combinedData.stops
                            .filter(stop => stop.address) 
                            .map((stop, index) => `Stop ${index + 1}: ${stop.address}`)
                            .join('<br>')}
                    </td>
                </tr>` 
                : ''}
            <tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Final Destination:</strong></td>
                    <td>${combinedData?.dropoffCoords?.address || 'N/A'}</td>
                </tr>
                ${combinedData?.allowedWaitTime?.toLowerCase() === 'yes' ? `
                    <tr>
                        <td style="width: 32%; padding-left: 50px"><strong>Authorized Wait:</strong></td>
                        <td>${combinedData.allowedWaitTime}</td>
                    </tr>
                    ` : ''}                    
                ${combinedData?.otherCommentsData?.otherComments ? `
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Instructions:</strong></td>
                    <td>${combinedData.otherCommentsData.otherComments}</td>
                </tr>
                ` : ''}
                ${combinedData?.otherCommentsData?.groupName ? `
                    <tr>
                        <td style="width: 32%; padding-left: 50px"><strong>Group Name:</strong></td>
                        <td>${combinedData.otherCommentsData.groupName}</td>
                    </tr>
                    ` : ''}
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
    `;
   
    // Conditionally add Flight Details section if available
    if (combinedData?.flightDetails?.pickupFlightDetails?.airline && combinedData?.flightDetails?.pickupFlightDetails?.flightNumber) {
        const pickupFlightDetails = combinedData.flightDetails.pickupFlightDetails;
        emailContent += `
        <div style="font-size: 12px; color: #333;">
         <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; margin-bottom:5px;">
             <tr>
                <td style="width: 32%; padding-left: 50px; font-size: 14px; ont-family: Arial, sans-serif;margin-bottom: 5px;"><strong>Pick-Up Flight Details:</strong></td>     
            </tr>
        </table>
            <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333;font-family: Arial, sans-serif;">
                <tr>
                    <td style="width:32%; padding-left: 50px"><strong>Airline:</strong></td>
                    <td >${pickupFlightDetails.airline}</td>
                </tr>
                <tr>
                    <td style="width:32%; padding-left: 50px"><strong>Flight Number:</strong></td>
                    <td>${pickupFlightDetails.flightNumber}</td>
                </tr>
                <tr>
                    <td style="width:32%; padding-left: 50px"><strong>Departing Code:</strong></td>
                    <td>${pickupFlightDetails.departingAirportCode}</td>
                </tr>
            </table>
        </div>
        `;
    }
    
    if (combinedData?.flightDetails?.dropoffFlightDetails?.airline && combinedData?.flightDetails?.dropoffFlightDetails?.flightNumber) {
        const dropoffFlightDetails = combinedData.flightDetails.dropoffFlightDetails;
        emailContent += `
        <div style="font-size: 12px; color: #333;">
         <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; margin-bottom:5px;">
             <tr>
                <td style="width: 32%; padding-left: 50px; font-size: 14px; ont-family: Arial, sans-serif;margin-bottom: 5px;"><strong>  Drop-Off Flight Details:</strong></td>     
            </tr>
        </table>
            <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333;font-family: Arial, sans-serif;">
                <tr>
                    <td style="width:32%; padding-left: 50px"><strong>Airline:</strong></td>
                    <td>${dropoffFlightDetails.airline}</td>
                </tr>
                <tr>
                    <td style="width:32%; padding-left: 50px"><strong>Flight Number:</strong></td>
                    <td>${dropoffFlightDetails.flightNumber}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
        </div>
        `;
    }

    // Conditionally add Payment Details section if available
    if (paymentDetails) {
        emailContent += `
         <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; margin-bottom:5px;">
            <tr>
             <td style="width: 32%; padding-left: 50px; font-size: 14px; ont-family: Arial, sans-serif;margin-bottom: 5px;"><strong> Billing / Payment:</strong></td>     
            </tr>
        </table>
            <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333;font-family: Arial, sans-serif;">
                <tr>
                <td style="width:32%; padding-left: 50px"><strong>Booking Contact Name:</strong></td>
               <td>${
                    billingContact
                    ? `${capitalizeName(billingContact.firstName)} ${capitalizeName(billingContact.lastName)}`
                    : ' '
                }</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px" ><strong>Booking Contact Number:</strong></td>
                <td>${billingContact ? billingContact.phone : ' '}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Booking Contact Email:</strong></td>
                <td>${billingContact ? billingContact.email : ' '}</td>
            </tr>
             <tr>
                <td style="width:32%; padding-left: 50px"><strong>Billing Payment Method:</strong></td>
                <td>${paymentDetails?.paymentMethod || 'N/A'}</td>
            </tr>`;
            
        // Check payment method
        const paymentMethod = paymentDetails?.paymentMethod?.toLowerCase();
        const isDirectBill = paymentMethod === 'direct bill / invoice' || paymentMethod === 'direct bill/invoice';
        
        // Only show credit card and address details if NOT direct bill
        if (!isDirectBill) {
            emailContent += `
             <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Type:</strong></td>
                <td>${paymentDetails?.paymentMethod || 'N/A'}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Number:</strong></td>
                <td>${paymentDetails?.cardNumber || 'N/A'}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Expiration Date:</strong></td>
                <td>${paymentDetails?.expirationMonth ? `${paymentDetails.expirationMonth}/` : ''} ${paymentDetails?.expirationYear || ''}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Holder Name:</strong></td>
                <td>${[
                    paymentDetails?.FirstName ? capitalizeName(paymentDetails.FirstName) : '',
                    paymentDetails?.MiddleName || '',
                    paymentDetails?.LastName || ''
                ].filter(n => n).join(' ')}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Billing Address:</strong></td>
                <td>${[
                    paymentDetails?.address,
                    paymentDetails?.city,
                    paymentDetails?.state,
                    paymentDetails?.zipCode,
                    paymentDetails?.country
                ].filter(part => part).join(', ')}</td>
            </tr>`;
        }
        
        emailContent += `
        </table>
        </div>
        `;
    }
    // Close the HTML tags
    emailContent += `
        <div style="font-size: small;"> 
        </div>
    </body></html>
    `;

    return emailContent;
};