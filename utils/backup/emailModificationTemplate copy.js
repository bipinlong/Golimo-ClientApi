exports.generateBookingModificationEmail = ({ bookingId, firstName, lastName, email, phone, combinedData, returnservice, bookActionType, paymentdetails, account_number }) => {

  
    let emailContent = `
        <html>  
            <body>
            <div style="font-size: 12px; font-family: Arial, sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f0f0; font-family: Arial, sans-serif; font-size: 12px;">
                    <tr>
                        <td style="padding: 5px 10px;">
                        <img src="cid:logo" alt="Logo" style="max-width: 80px; height: auto; padding-left: 45px;">
                        </td>
                        <td align="right" style="padding: 5px 10px; line-height: 1; padding-right: 50px;">
                        <p style="margin: 0; font-weight: bold; color: #817f89;">Executive Chauffeured </p>
                        <p style="margin: 0; font-weight: bold; color: #817f89;">Transportation Worldwide</p>
                        </td>
                    </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px;">
                        <tr style="background-color: #f0f0f0;">
                            <td style="font-size: 12px;padding-left: 45px;"> Ride Modification Pending: Reservation#${bookingId}</td>
                            <td align="right" style="font-size: 12px; padding-right:40px;">Last Modified On:  ${new Date().toLocaleString()}</td>
                        </tr>
                </table>
                 <div style="padding: 20px;">
                    <p style="font-size: 12px; padding-left:40px; padding-right:40px;">
                       Your Ride Modification request has been received and is currently under review by our staff. As soon as it is revied and Modification is Confirmed you will be notify immediately.
                    </p>
                   <p style="font-size: 12px; padding-left:40px; padding-right:40px;">
                          If you require this Ride Modification with in Twelve (12) Hours or need further assistance with this Modification, please contact us by Phone toll-free US/Canada 
                        800.960.0232. International +1.617.630.0232. We are Here to Assist You 24/7.
                    </p>
                    <p style="font-size: 14px; text-align: center; line-height: 1.5;">
                        Thank you for using our Chauffeured Transportation Services<br />
                        We appreciate your business
                    </p>
                </div>
               
            </div>
        `;

    // Close the HTML tags
    emailContent += `
         <div style="font-size: 12px; padding-left: 50px; padding-right: 40px">
            <hr style="border: 1.5px solidd #c7bfbf;>
                <p style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">THINGS TO KNOW</p>
                <p>
                Estimated total amount shown may fluctuate depending on Waiting-Time, En-Route Stop(s), Ride Duration, Tolls/Parking, Government mandated charges, etc. 
                Time-based Hourly Rates will be billed from the time of Pick-up to the time of Drop-off plus Garage-to-Garage charges. All rates are estimated and are subject to change due to additional charges.
                Such charges will appear without notice among your final charges as applicable. For any last-minute Changes or Cancellations, please review our policies below carefully to avoid any preventable Charges.</p>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Late Change, Cancellation, and No-Show Policy</h3>
                <p>Late change, cancellation, and no-show policy applies to all confirmed flat rate and time-based hourly rate reservations:→</p>
                <ul>
                    <li>For flat rate transfer reservations in the United States, Canada, and Puerto Rico, a late change fee or late cancellation fee for all transfer reservations will be charged. Unless the Transfer reservations changed or cancelled within the minimum stated time prior to the scheduled pick-up time.</li>
                    <li>For time-based hourly reservations, a late change fee or late cancellation fee equal to the minimum hours quoted at the time of reservation will be charged. Unless the hourly reservation changed or cancelled within the minimum stated time prior to the scheduled pick-up time.</li>
                    <li>For all countries not aforementioned and where a reservation is changed or cancelled within the minimum stated time prior to the scheduled pick-up time, either transfer reservation or time-based hourly rate reservation will incur a fee equal to the applicable transfer rate or hourly rate plus local VAT where applicable will be charged.
                    Unless the transfer or hourly reservation changed or cancelled within the minimum stated time prior to the scheduled pick-up time.</li>
                    <li>Applies to all reservations where the pickup location is within the local city metropolitan area. The local city metropolitan area is defined as within 50 miles of the city center. All services outside the local city metropolitan area may be assessed the actual drive time to and from the pick-up location.</li>
                    <li>All Special Event reservations change and cancellation policies supersede standard change and cancellation policies and are noted in the email confirmation.</li>
                    <li>A No-Show fee equal to the transfer or time-based hourly minimum rate, plus any if applicable wait time, applicable tolls, parking, airport fee, fuel surcharge, STC charge, regulatory fees, taxes,
                    will apply for all confirmed reservations, should the passenger fail to cancel or meet the chauffeur at the designated pick-up location.</li>
                </ul>
                <p>
                    To avoid a late change / modification fee, cancellation fee, or no-show fee, the reservation(s) must be changed or cancelled in accordance with the cancellation policy terms noted below			
                    in this email confirmation. You may either change, modify or cancel the reservation on-line, via email reservations@bostonasapcoach.com or by phone toll-free US/Canada 800.960.0232.			
                    International +1.617.630.0232. Please note if reservation(s) is within Six Hours, please Call to change / modify or cancel.
                </p>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Change and Cancellation Terms</h3>
                <p>Late change and cancellations fee equal to the rate confirmed at the time of reservation will apply unless:→ </p>
                <ul>
                    <li>Sedan Reservations are changed or cancelled more than Three (3) Hours prior to the scheduled pickup time.</li>
                        <li>SUV / MPV Reservations are changed or cancelled more than Six (6) Hours prior to the scheduled pickup time.</li>
                        <li>Van / Sprinter Reservations are changed or cancelled more than Twelve (12) Hours prior to the scheduled pickup time.</li>
                        <li>Sedan Limousine / SUV Limousine / Sprinter Limo Coach Reservations are changed or cancelled more than Seventy-Two (72) Hours prior to the scheduled pickup time.</li>
                        <li>Limo Coach / Mini Coach / Motor Coach Reservations are changed or cancelled more than Seventy-Two (72) Hours prior to the scheduled pickup time.</li>
                        <li>Event and Special Occasion Reservations are changed or cancelled more than Seventy-Two (72) Hours prior to scheduled pickup time.</li>
                        <li>International Reservations for Sedan, SUV, MPV, and Van are changed or cancelled more than Twenty-Four (24) Hours prior to the scheduled pickup time.</li>
                </ul>
                <p>
                	The above cancellation terms represent standard policy at the Company and may be modified from time to time based on market, desired reservation dates and vehicle availability.			
	                All modifications that are mutually agreed upon in writing or communicated and confirmed at the time of reservation will supersede the above.
                </p>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px;  padding-bottom: 5px;">Wait Time Policy</h3>
                <p>All flat-rate rides that do not begin at an airport are subject to Wait Time after the Ten (10) minutes of grace period is over: →</p>
                <ul>
                    <li>On all flat rate transfers origination from an Airport, customers are permitted waiting period of Forty Five (45) minutes after the actual arrival time of domestic flights and Seventy (70) minutes for international flights at no extra charge.</li>
                </ul>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px;  padding-bottom: 5px;">Additional</h3>
                <ul>
                   <li>The Company assumes no liability for any lost or misplaced personal property or any other items left in the vehicle.</li>
                   <li>The party hiring the vehicle acknowledges and agrees the terms of this reservation liability agreement and also understand that the said party his/her responsibility in returning the vehicle to the Company in the same condition as when received. Otherwise in addition to the Flat or Time-based Hourly Rate for Vehicle and Chauffeur, 
                   any damage excess of usual use and wear of Hired Vehicle, there will be a minimum charge of 400.00 USD for the Repair and or General Cleaning of the Vehicle.
                   Decision as to the usual wear and use of the Vehicle Interior and its environs, rests with the Company, solely and its experience as to general habitation of hired vehicles and its decision is final.
                   </li>
                   <li>Additionally, in no event, will the Company or any of its affiliates or subcontractors be liable or responsible for damages of any kind caused by any delay in performance or failure to perform, in whole or in part, 
                   any of their obligations in connection with the services, where such delay or failure is due in part to traffic, road construction, strikes, weather, fire, flood, earthquake, act of God, act of war or terrorism, act of any public authority or sovereign government, civil disorder, 
                   government sanctioned embargo, delay caused by any air or ground passenger carrier, or any other circumstances beyond the reasonable control of the Company, its affiliates, or subcontractors.</li>
                </ul>
                </div>
                 <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px;  padding-left: 50px; padding-bottom: 5px;">Questions about this reservation? </h3>
                 <p style="padding-left: 50px; padding-right: 40px">Check out our FAQs: https://www.bostonasapcoach.com/supports-faqs/ or Call 24/7 Reservations: 800.960.0232 If calling from outside the US or Canada, please dial: +1.617.630.0232 </p>
                <p style="padding-left: 50px; padding-right: 40px">
                <strong>Have you booked the second leg of your travel yet?</strong>
               <a href="https://www.bostonasapcoach.com/book-ride/" target="_blank"
                style="display: inline-block; background-color: #f0f0f0; color: #333; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-left:20px;">
                Book a Ride
                </a>            
             <div style="font-size: 10px; font-family: Arial, sans-serif; padding-left: 40px; padding-right: 40px;">
                <p><strong>CONFIDENTIALITY NOTICE:</strong><br>
                    This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended solely for	
                the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination, distribution, copying or	
                other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail that you received this message 	
                by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.
                <br>Thank you.</p>
            </div>
            </body>
        </html>
        `;
    return emailContent;
};

exports.generateAdminBookingModificationEmail = ({ bookingId, firstName, lastName, email, phone, combinedData, returnservice,bookActionType, paymentdetails }) => {

    const { pickUpDate, pickUpTime } = combinedData;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${month}-${day}-${year} - ${dayOfWeek}`; // e.g., '01-23-2025 (Thursday)'
    };

    // Function to format time to 12-hour AM/PM format
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesFormatted = ("0" + minutes).slice(-2);
        return `${hours}:${minutesFormatted} ${ampm}`; // '6:30 PM'
    };

    // Format date and time
    const formattedDate = formatDate(pickUpDate);
    const formattedTime = formatTime(pickUpDate);
    const formattedDropOffTime = formatTime(combinedData?.estimatedDropOffTime);


    const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let emailContent = `  
        <html>    
            <body>
            <div style="font-size: 12px; font-family: Arial, sans-serif;">
                 <div style="display: flex; background-color: #f0f0f0; justify-content:space-between; align-items: center; font-size: 12px; font-family: Arial, sans-serif;">
                <img src="cid:logo" alt="Logo" style="max-width: 90px; height: auto; padding-top:5px; padding-left:5px">
                <div style="padding-top:5px; padding-right:5px; line-height: 1;">
                    <p style="margin: 0; padding: 0; font-weight: bold;">Worldwide</p>
                    <p style="margin: 0; padding: 0; font-weight: bold;">Executive Transportation</p>
                </div>
                </div>
                <p style="margin: 0; font-size: 16px; font-weight: bold; line-height: 1.5;">Booking Modification</p>
                <hr>
                 <h1>Admin Alert: Booking Modified</h1>
                <p>A booking has been modified. Below are the updated reservation details. Please review carefully.</p>
                <hr>
                 <h4 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-weight: bold;">
                ${bookActionType === "Book Now" ? `Reservation Number ${bookingId}` : `Quote Number ${bookingId}`}
                </h4>
                <hr>
                <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                    <tr>
                        <td style="width: 50%;"><strong>Reservation Date / Day:</strong></td>
                        <td style="width: 50%;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td><strong>Reservation Time:</strong></td><td>${formattedTime}</td>
                    </tr>
                    <tr>
                        <td><strong>Estimated Drop Time:</strong></td><td>${formattedDropOffTime}</td>
                    </tr>
                    <tr>
                        <td><strong>Passenger Name:</strong></td>
                        <td>${capitalizeName(firstName)} ${capitalizeName(lastName)}</td>
                    </tr>
                    <tr>
                        <td><strong>Passenger Phone Number:</strong></td>
                        <td>${phone || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Passenger Email:</strong></td>
                        <td>${email || 'N/A'}</td>
                    </tr>
                    ${combinedData?.passengerDetails?.passengers?.length > 0 ? combinedData.passengerDetails.passengers.map((passenger) => `
                    <tr>
                        <td><strong>Additional Passenger Name:</strong></td>
                        <td>${capitalizeName(passenger.firstname)} ${capitalizeName(passenger.lastname)}</td>
                    </tr>
                    <tr>
                        <td><strong>Additional Passenger Phone:</strong></td>
                        <td>${passenger?.phone ? `+${passenger.phone}` : 'N/A'}</td>
                    </tr>
                    ${passenger?.email ? `
                    <tr>
                        <td><strong>Additional Passenger Email:</strong></td>
                        <td>${passenger.email}</td>
                    </tr>` : ''}
                    `).join('') : ''}
                    <tr>
                        <td><strong>Number of Passenger(s):</strong></td><td>${combinedData?.passengers || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Number of Luggage(s):</strong></td><td>${combinedData?.luggage || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Type of Service:</strong></td><td>${combinedData?.serviceType || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Vehicle Class:</strong></td><td>${combinedData?.selectedVehicle?.name || 'N/A'}</td>
                    </tr>
                </table>
                 <hr>
                <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Routing Details</h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                <tr>
            <td style="width: 50%;"><strong>Pick-Up Location:</strong></td>
            <td style="width: 50%;">
                ${combinedData?.pickupCoords?.address || 'N/A'}
                ${combinedData.stops && combinedData.stops.length > 0 ? `
                    <br><strong>Stops:</strong>
                    <span style="display: inline-block; margin-left: 5px;">
                        ${combinedData.stops.map((stop, index) => `Stop ${index + 1}: ${stop.address || 'N/A'}`).join(', ')}
                    </span>
                    ` : ''}
                    </td>
                </tr>
                <tr>
                    <td><strong>Final Destination:</strong></td>
                    <td>${combinedData?.dropoffCoords?.address || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Authorized Wait:</strong></td>
                    <td>${combinedData?.allowedWaitTime || 'N/A'}</td>
                </tr>
                ${combinedData?.passengerDetails?.otherCommentsData?.otherComments ? `
                <tr>
                    <td><strong>Instructions:</strong></td>
                    <td>${combinedData.passengerDetails.otherCommentsData.otherComments}</td>
                </tr>
                ` : ''}
            </table>
            </div>
        `;

           
    if (combinedData?.flightDetails?.pickupFlightDetails?.airline && combinedData?.flightDetails?.pickupFlightDetails?.flightNumber) {
        const pickupFlightDetails = combinedData.flightDetails.pickupFlightDetails;
        emailContent += `
        <hr>
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
            Pick-Up Flight Details:
            </h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                <tr>
                    <td style="width: 50%; padding: 5px;"><strong>Airline:</strong></td>
                    <td style="width: 50%; padding: 5px;">${pickupFlightDetails.airline}</td>
                </tr>
                <tr>
                    <td style="width: 50%; padding: 5px;"><strong>Flight Number:</strong></td>
                    <td style="width: 50%; padding: 5px;">${pickupFlightDetails.flightNumber}</td>
                </tr>
            </table>
        </div>
        `;
    }
    
    if (combinedData?.flightDetails?.dropoffFlightDetails?.airline && combinedData?.flightDetails?.dropoffFlightDetails?.flightNumber) {
        const dropoffFlightDetails = combinedData.flightDetails.dropoffFlightDetails;
        emailContent += `
         <hr>
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
            Drop-Off Flight Details:
            </h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                <tr>
                    <td style="width: 50%; padding: 5px;"><strong>Airline:</strong></td>
                    <td style="width: 50%; padding: 5px;">${dropoffFlightDetails.airline}</td>
                </tr>
                <tr>
                    <td style="width: 50%; padding: 5px;"><strong>Flight Number:</strong></td>
                    <td style="width: 50%; padding: 5px;">${dropoffFlightDetails.flightNumber}</td>
                </tr>
            </table>
        </div>
        `;
    }
    if (combinedData.childSeats && combinedData.childSeats.length > 0) {
        emailContent += `
         <hr>
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
            Child Seats:
            </h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                ${combinedData.childSeats.map(seat => {
                    return `<tr>
                        <td style="width: 50%; padding: 5px;"><strong>Seat Type:</strong></td>
                        <td style="width: 50%; padding: 5px;">${seat.type}</td>
                    </tr>
                    <tr>
                        <td style="width: 50%; padding: 5px;"><strong>Quantity:</strong></td>
                        <td style="width: 50%; padding: 5px;">${seat.quantity}</td>
                    </tr>`;
                }).join('')}
            </table>
        </div>
        `;
    }
    if (paymentdetails && paymentdetails.cardNumber) {
        
        emailContent += `
        <hr>
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
                Billing / Payment:
            </h3>
           <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Booking Contact Name:</strong></td>
                <td style="width: 50%; padding: 5px;">${capitalizeName(firstName)} ${capitalizeName(lastName)}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Booking Contact Number:</strong></td>
                <td style="width: 50%; padding: 5px;">${phone || 'N/A'}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Booking Contact Email:</strong></td>
                <td style="width: 50%; padding: 5px;">${email || 'N/A'}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Credit Card Number:</strong></td>
                <td style="width: 50%; padding: 5px;">${paymentdetails.cardNumber}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Credit Card Type:</strong></td>
                <td style="width: 50%; padding: 5px;">${paymentdetails?.paymentMethod || 'N/A'}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Credit Card Expiration Date:</strong></td>
                <td style="width: 50%; padding: 5px;">${paymentdetails?.expirationMonth}/ ${paymentdetails.expirationYear}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Credit Card Holder Name:</strong></td>
                <td style="width: 50%; padding: 5px;">${paymentdetails?.cardholderName ? capitalizeName(paymentdetails.cardholderName) : 'N/A'}</td>
            </tr>
            <tr>
                <td style="width: 50%; padding: 5px;"><strong>Billing Address:</strong></td>
                <td style="width: 50%; padding: 5px;">${paymentdetails?.address}, ${paymentdetails?.city} ${paymentdetails?.state}</td>
            </tr>
        </table>
        </div>
        `;
    }
    // Close the HTML tags
    emailContent += `
        <div style="font-size: small;">
        <hr>
            <p style="font-size: 12px;">This is an admin notification for booking updates. Please review and take any necessary actions.</p>
        </div>
    </body></html>
    `;

    return emailContent;
};
