
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
    
    // ✅ Safe capitalize function
    const capitalizeName = (name) => {
        if (!name || typeof name !== 'string') return '';
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    // ✅ FIXED: Safe date formatting function with proper null handling
    const formatToMMDDYYYYWithTime = (dateStr) => {
        // If dateStr is null/undefined/empty, use current date/time
        if (!dateStr) {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const year = now.getFullYear();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
        }
        
        try {
            const dateStrValue = String(dateStr);
            
            // Check if it has space (date and time)
            if (!dateStrValue.includes(' ')) {
                // If no time part, try to parse as date only
                if (dateStrValue.includes('-')) {
                    const [year, month, day] = dateStrValue.split('-');
                    return `${month}-${day}-${year}`;
                }
                return dateStrValue;
            }
            
            const [datePart, timePart] = dateStrValue.split(' ');
            
            if (!datePart || !timePart) {
                const now = new Date();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const year = now.getFullYear();
                return `${month}-${day}-${year}`;
            }
            
            let [year, month, day] = datePart.split('-');
            
            // If year is not 4 digits, try different format
            if (year && year.length !== 4) {
                const parts = datePart.split('/');
                if (parts.length === 3) {
                    month = parts[0].padStart(2, '0');
                    day = parts[1].padStart(2, '0');
                    year = parts[2];
                }
            }
            
            let [hours, minutes, seconds] = timePart.split(':');
            hours = parseInt(hours, 10) || 0;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const formattedMinutes = String(minutes || '00').padStart(2, '0');
            const formattedSeconds = String(seconds || '00').padStart(2, '0');
            
            return `${month}-${day}-${year} ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            // Fallback to current date/time
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const year = now.getFullYear();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
        }
    };
    
    // ✅ FIXED: Safe booking time formatting with fallback
    let formattedBookingTime = "";
    try {
        const timeToFormat = bookingTime || createdAt || new Date().toISOString();
        formattedBookingTime = formatToMMDDYYYYWithTime(timeToFormat);
    } catch (error) {
        console.error("Error formatting booking time:", error);
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        formattedBookingTime = `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    }
    
    // ✅ Safe formatted date and time
    const safeFormattedDate = formattedDate || new Date().toLocaleDateString();
    const safeFormattedTime = formattedTime || new Date().toLocaleTimeString();

    const actionHeader = bookActionType === "Book Now"
        ? `New Booking: Reservation# ${bookingId} for ${capitalizeName(firstName)} ${capitalizeName(lastName)} [${safeFormattedDate} - ${safeFormattedTime}]`
        : `New Quote Request: Reference# ${bookingId} for ${capitalizeName(firstName)} ${capitalizeName(lastName)} [${safeFormattedDate} - ${safeFormattedTime}]`;
     
    // ✅ Safe billing contact names
    const billingFirstName = capitalizeName(billingContact?.firstName);
    const billingLastName = capitalizeName(billingContact?.lastName);
    const billingFullName = `${billingFirstName} ${billingLastName}`.trim() || 'N/A';
    const billingEmail = billingContact?.email || 'N/A';
    const billingPhone = billingContact?.phone || 'N/A';

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
                        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
                            <tr>
                                <td style="font-weight: bold; font-size: 14px; line-height: 1.9; padding-left: 45px; font-family: Arial, sans-serif;">
                                ${actionHeader}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <table style="border-collapse: collapse; width: 70%; font-size: 12px; font-family: Arial, sans-serif; color: #333;">   
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Passenger:</strong></td>
                    <td>${capitalizeName(firstName)} ${capitalizeName(lastName)} &nbsp;&nbsp; 📧${email || 'N/A'} &nbsp;&nbsp; 📞${phone || 'N/A'}}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Booking Contact:</strong></td>
                    <td>${billingFullName} &nbsp;&nbsp; 📧${billingEmail} &nbsp;&nbsp; 📞${billingPhone}</td>
                </tr>
                <tr>
                    <td style="width: 32%; padding-left: 50px"><strong>Billing Contact:</strong></td>
                   <td>${billingFullName} &nbsp;&nbsp; 📧${billingEmail} &nbsp;&nbsp; 📞${billingPhone}</td>
                </tr>
            </table>
               <br>
                 <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif; margin-bottom:5px; margin-top:10px;">
                <tr>
                    <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif; margin-bottom: 5px; margin-top:10px;"><strong>Ride Details</strong>}</td>     
                </tr>
                </table>    
                  <table style="border-collapse: collapse; width: 70%; font-size: 12px; font-family: Arial, sans-serif; color: #333;">
                <tr>   
    `;
    
    // Additional passengers
    if (combinedData?.passengerInfo?.passengers?.length > 0) {
        emailContent += combinedData.passengerInfo.passengers.map((passenger) => `
        <tr>
            <td style="width: 32%; padding-left: 50px;"><strong>Additional Passenger Name:</strong>}</td>
            <td>${capitalizeName(passenger.firstname)} ${capitalizeName(passenger.lastname)}}</td>
        </tr>
        ${passenger?.phone ? `
        <tr>
            <td style="width: 32%; padding-left: 50px;"><strong>Additional Passenger Phone:</strong>}</td>
            <td>+${passenger.phone}}</td>
        </tr>` : ''}
        ${passenger?.email ? `
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Additional Passenger Email:</strong>}</td>
            <td>${passenger.email}}</td>
        </tr>` : ''}
        `).join('');
    }
    
    emailContent += `
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Number of Passenger(s):</strong>}</td>
            <td>${combinedData?.passengers || '0'} }</td>
        </tr>
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Number of Luggage(s):</strong>}</td>
            <td>${combinedData?.luggage || '0'} }</td>
        </tr>
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Type of Service:</strong>}</td>
            <td>${combinedData?.serviceType || 'N/A'} }</td>
        </tr>
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Vehicle Class:</strong>}</td>
            <td>${combinedData?.selectedVehicle?.name || 'N/A'} }</td>
        </tr>
        ${combinedData?.otherCommentsData?.otherComments ? `
        <tr>
            <td style="width: 32%; padding-left: 50px;"><strong>Instructions:</strong>}</td>
            <td>${combinedData.otherCommentsData.otherComments} }</td>
        </tr>` : ''}
        ${combinedData?.otherCommentsData?.groupName ? `
        <tr>
            <td style="width: 32%; padding-left: 50px;"><strong>Group Name:</strong>}</td>
            <td>${combinedData.otherCommentsData.groupName} }</td>
        </tr>` : ''}
    </table>
    <hr style="border: 1.5px solid #c7bfbf; width: 70%; margin-top: 10px;">
    
    <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif; margin-bottom:5px;">
        <tr>
            <td style="width: 32%; padding-left: 50px; font-size: 14px; font-family: Arial, sans-serif;margin-bottom: 5px;"><strong>Routing Details</strong>}</td>     
        </tr>
    </table>
    <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif;">
        <tr>
            <td style="width: 32%; padding-left: 50px; vertical-align: top;"><strong>Pick-Up Location:</strong>}</td>
            <td>${combinedData?.pickupCoords?.address || 'N/A'} }</td>
        </tr>
    `;
    
    if (combinedData?.stops && combinedData.stops.length > 0) {
        emailContent += `
        <tr>
            <td style="width: 32%; padding-left: 50px; vertical-align: top;"><strong>Stop:</strong>}</td>
            <td>${combinedData.stops.map((stop, index) => `Stop ${index + 1}: ${stop.address || 'N/A'}`).join(', ')} }</td>
        </tr>`;
    }
    
    emailContent += `
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Final Destination:</strong>}</td>
            <td>${combinedData?.dropoffCoords?.address || 'N/A'} }</td>
        </tr>
        <tr>
            <td style="width: 32%; padding-left: 50px"><strong>Booking Date/Time:</strong>}</td>
            <td>${formattedBookingTime} }</td>
        </tr>
    </table>
    `;

    // Close HTML
    emailContent += `
            </body>
        </html>
    `;

    return emailContent;
};