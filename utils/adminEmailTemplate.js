
exports.generateBookingEmailAdmin = ({ 
    bookingId,
    firstName,
    lastName,
    email,
    phone,
    combinedData,
    returnService,
    createdAt,
    paymentDetails,
    bookActionType,
    formattedDate,
    formattedTime,
    bookingTime,
    billingContact
}) => {
    
    const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const formatToMMDDYYYYWithTime = (dateStr) => {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-');
        let [hours, minutes, seconds] = timePart.split(':');
        const ampm = +hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };
  
    const formattedBookingTime = formatToMMDDYYYYWithTime(bookingTime);
  

    const actionHeader = bookActionType === "Book Now"
    ? `New Booking: Reservation# ${bookingId} for ${capitalizeName(firstName)} ${capitalizeName(lastName)} [${formattedDate} - ${formattedTime}]`
    : `New Quote Request: Referance# ${bookingId} for ${capitalizeName(firstName)} ${capitalizeName(lastName)} [${formattedDate} - ${formattedTime}]`;
     

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
                                <td style="font-weight: bold; font-size: 14px; line-height: 1.9; padding-left: 45px; margin-buttom:'20px'; padding-bottom:'20px'; font-family: Arial, sans-serif;">
                                ${actionHeader}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <table style="border-collapse: collapse; width: 70%; font-size: 12px; font-family: Arial, sans-serif; color: #333;">   
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Passenger:</strong></td>
                    <td>${capitalizeName(firstName)} ${capitalizeName(lastName)} &nbsp;&nbsp; 📧${email} &nbsp;&nbsp; 📞${phone}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Booking Contact:</strong></td>
                    <td>${capitalizeName(billingContact?.firstName)} ${capitalizeName(billingContact?.lastName)} &nbsp;&nbsp; 📧${billingContact?.email} &nbsp;&nbsp; 📞${billingContact?.phone}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Billing Contact:</strong></td>
                   <td>${capitalizeName(billingContact?.firstName)} ${capitalizeName(billingContact?.lastName)} &nbsp;&nbsp; 📧${billingContact?.email} &nbsp;&nbsp; 📞${billingContact?.phone}</td>
                </tr>
            </table>
               <br>
                 <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif; margin-bottom:5px; margin-top:10px;">
                <tr>
                    <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif; margin-bottom: 5px; margin-top:10px;"><strong>Ride Details</strong></td>     
                </tr>
                </table>    
                  <table style="border-collapse: collapse; width: 70%; font-size: 12px; font-family: Arial, sans-serif; color: #333;">
                <tr>   
                ${combinedData?.passengerInfo?.passengers?.length > 0 ? combinedData.passengerInfo.passengers.map((passenger) => `
                <tr>
                    <td style="width: 32%; padding-left: 50px;"><strong>Additional Passenger Name:</strong></td>
                    <td>${capitalizeName(passenger.firstname)} ${capitalizeName(passenger.lastname)}</td>
                </tr>
                 ${passenger?.phone ? `
                <tr>
                    <td style="width: 32%; padding-left: 50px;"><strong>Additional Passenger Phone:</strong></td>
                    <td>+${passenger.phone}</td>
                </tr>` : ''}
                ${passenger?.email ? `
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Additional Passenger Email:</strong></td>
                    <td>${passenger.email}</td>
                </tr>` : ''}
                `).join('') : ''}
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Number of Passenger(s):</strong></td>
                    <td>${combinedData?.passengers || '0'}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Number of Luggage(s):</strong></td>
                    <td>${combinedData?.luggage || '0'}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Type of Service:</strong></td>
                    <td>${combinedData?.serviceType || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Vehicle Class:</strong></td>
                    <td>${combinedData?.selectedVehicle?.name || 'N/A'}</td>
                </tr>
                        ${combinedData?.otherCommentsData?.otherComments  
                        ? `<tr>
                            <td style="width: 32%; padding-left: 50px;"><strong>Instructions:</strong></td>
                            <td>${combinedData?.otherCommentsData?.otherComments}</td>
                        </tr>` 
                        : ''}
                        ${combinedData?.otherCommentsData?.groupName  
                            ? `<tr>
                                <td style="width: 32%; padding-left: 50px; "><strong>GroupName:</strong></td>
                                <td>${combinedData?.otherCommentsData?.groupName}</td>
                            </tr>` 
                            : ''}
                        <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
              <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif; margin-bottom:5px;">
                <tr>
                    <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif;margin-bottom: 5px;"><strong>Routing Details</strong></td>     
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
                    <td>${combinedData.stops.map((stop, index) => `Stop ${index + 1}: ${stop.address || 'N/A'}`).join(', ')}</td>
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
                <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif;margin-bottom: 5px;"><strong>Pick-Up Flight Details:</strong></td>     
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
                    <td style="width:32%; padding-left: 50px"><strong>Departing Airport:</strong></td>
                    <td>${pickupFlightDetails.departingAirportCode}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
            <br/>
        </div>
        `;
    }
    
    if (combinedData?.flightDetails?.dropoffFlightDetails?.airline && combinedData?.flightDetails?.dropoffFlightDetails?.flightNumber) {
        const dropoffFlightDetails = combinedData.flightDetails.dropoffFlightDetails;
        emailContent += `
        <div style="font-size: 12px; color: #333;">
         <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; margin-bottom:5px; margin-top:10px;">
            <tr>
                <td style="width: 32%; padding-left: 50px; font-size: 14px; ont-family: Arial, sans-serif;margin-bottom: 5px;"><strong>Drop-Off Flight Details:</strong></td>     
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
    if (combinedData.childSeats && combinedData.childSeats.length > 0) {
        emailContent += `
         <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; margin-bottom:5px; margin-top:10px;">
            <tr>
                <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif;margin-bottom: 5px; margin-top:10px;"><strong>Child Seats:</strong></td>     
            </tr>
            </table>
           <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333;font-family: Arial, sans-serif;">
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
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
             
        `;
    }

    // Conditionally add Payment Details section if available
        if (paymentDetails) {
    emailContent += `
     <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; margin-bottom:5px;">
        <tr>
        <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif;margin-bottom: 10px;"><strong>Billing / Payment:</strong></td>     
        </tr>
    </table>
        <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333;font-family: Arial, sans-serif;">
            <tr>
            <td style="width:32%; padding-left: 50px"><strong>Booking Contact Name:</strong></td>
            <td>${capitalizeName(billingContact?.firstName)} ${capitalizeName(billingContact?.lastName)}</td>
        </tr>
        <tr>
            <td style="width:32%; padding-left: 50px" ><strong>Booking Contact Number:</strong></td>
            <td>${billingContact?.phone || 'N/A'}</td>
        </tr>
        <tr>
            <td style="width:32%; padding-left: 50px"><strong>Booking Contact Email:</strong></td>
            <td>${billingContact?.email || 'N/A'}</td>
        </tr>
         <tr>
            <td style="width:32%; padding-left: 50px"><strong>Payment Method:</strong></td>
            <td>${paymentDetails?.paymentMethod || 'N/A'}</td>
        </tr>`;
        
    // Only show credit card details if payment method is not Direct Bill/Invoice
    if (paymentDetails.paymentMethod !== "Direct Bill / Invoice") {
        emailContent += `
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Number:</strong></td>
                <td>${paymentDetails.cardNumber}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Expiration Date:</strong></td>
                <td>${paymentDetails?.expirationMonth}/ ${paymentDetails.expirationYear}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Credit Card Holder Name:</strong></td>
                <td>${paymentDetails?.FirstName ? capitalizeName(paymentDetails.FirstName) : ''} ${paymentDetails?.MiddleName} ${paymentDetails?.LastName}</td>
            </tr>
            <tr>
                <td style="width:32%; padding-left: 50px"><strong>Billing Address:</strong></td>
                <td>${paymentDetails?.address}, ${paymentDetails?.city}, ${paymentDetails?.state},${paymentDetails?.zipCode}, ${paymentDetails?.country} </td>
            </tr>`;
    }
    
    emailContent += `
        </table>
        </div>
    `;
}
  
    // Close the HTML tags
    emailContent += `
            </body>
        </html>
    `;

    return emailContent;
};
