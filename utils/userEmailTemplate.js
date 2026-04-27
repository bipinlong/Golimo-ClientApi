
// const generateUserEmailContent = (bookingId, formattedDate, formattedTime, bookActionType, bookingTime, firstName, lastName, email) => {
//   let userEmailContent = '';

//   const formatToMMDDYYYYWithTime = (dateStr) => {
//       const [datePart, timePart] = dateStr.split(' ');
//       const [year, month, day] = datePart.split('-');
//       let [hours, minutes, seconds] = timePart.split(':');
//       const ampm = +hours >= 12 ? 'PM' : 'AM';
//       hours = hours % 12 || 12;
//       return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
//   };

//   const formattedBookingTime = formatToMMDDYYYYWithTime(bookingTime);

//   const commonStyles = `
//       body { margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6; }
//       table { border-collapse: collapse; width: 100%; max-width: 100%; margin: 0 auto; }
//       td { font-family: Arial, sans-serif; font-size: 13px; color: #333333; }
//       a { color: #007bff; text-decoration: none; }
//       .logo, img#m_-6703129678938271976m_-8659832897488455608Picture_x0020_1 { 
//           width: 1.0138in !important; 
//           height: 0.5208in !important;
//           max-width: 1.0138in !important;
//           display: block !important;
//       }
//       .header-bg { background-color: #f5f5f5; }
//       .reference-bg { background-color: #eeeeee; }
//       .confidential { font-size: 10px; }
//   `;

//   const confidentialNotice = `
//   <tr>
//     <td colspan="2" style="padding: 15px 30px; font-size: 10px;">
//       <p style="margin: 0;">CONFIDENTIALITY NOTICE:</p>
//       <p style="margin: 4px 0 0 0;">
//         This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended solely for the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination, distribution, copying or other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail that you received this message by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.<br />Thank you.
//       </p>
//     </td>
//   </tr>
// `;

//   const quoteContent = `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Quote Request</title>
//     <style>${commonStyles}</style>
//   </head>
//   <body>
//           <!-- Full-width table with background color -->
//           <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgb(177, 175, 169); width: 100% !important;">
//             <tr>
//               <td align="center">
//                 <!-- Centered inner table with fixed width -->
//                 <table cellpadding="0" cellspacing="0" width="723px" style="max-width: 740px; width: 100%;">
//                   <tr>
//                     <td style="padding: 15px 15px 15px 30px;">
//                       <img 
//                         src="https://api.bostonasapcoach.com/images/boston_logo.png" 
//                         alt="Boston Coach" 
//                         width="97" height="50"
//                         style="display: block; width: 97px; height: 50px; border: 0; outline: none; text-decoration: none;"
//                        />
//                     </td>
//                     <td align="right" style="padding: 15px 30px 15px 15px;">
//                       <strong>Executive Chauffeured<br />Transportation Worldwide</strong>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//           <table cellpadding="0" cellspacing="0" align="center" style="width: 723px; max-width: 740px; margin: 0 auto;">
//               <tr>
//               <td colspan="2" style="height: 35px;"></td>
//               </tr>
//               <tr>
//                   <td colspan="2">
//                       <table>
//                           <tr>
//                               <td  style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Quote Reference #${bookingId}</td>
//                               <td  style="padding: 10px 30px; font-size:14px; background-color: #eeeeee; text-align: right;"">Last Modified On: ${formattedBookingTime}</td>
//                           </tr>
//                       </table>
//                   </td>
//               </tr>
//               <tr>
//                   <td colspan="2" style="padding: 20px 30px;">
//                       <p><strong>*Please note: If This Service Request Is Within Twenty-Four (24) Hours Please Contact us at 800.960.0232.</strong></p>
//                       <p>Your new Quote request has been received and is currently under review by our staff. As soon as it is revied and updated with the rates you will be notify immediately.</p>
//                       <p> In the meantime, if you require further assistance with this quote or need to book a ride, please contact us via email at reservations@bostonasapcoach.com by phone
//                          toll-free US/Canada 800.960.0232. International +1.617.630.0232.to expedite the process. We are Here to Assist You 24/7.
//                       </p>
//                       <p style="text-align: center; margin-top: 20px;">Thank you for considering our Chauffeured Transportation Services<br /> We look forward to serving you soon</p>
//                   </td>
//               </tr>
//               ${confidentialNotice}
//           </table>
//           </body>
//           </html>
//             `;
//             const bookingContent = `
//           <!DOCTYPE html>
//           <html>
//           <head>
//             <meta charset="utf-8" />
//             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//             <title>Booking Request</title>
//             <style>${commonStyles}</style>
//           </head>
//           <body>
//            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgb(177, 175, 169); width: 100% !important;">
//             <tr>
//               <td align="center">
//                 <!-- Centered inner table with fixed width -->
//                 <table cellpadding="0" cellspacing="0" width="723px" style="max-width: 740px; width: 100%;">
//                   <tr>
//                     <td style="padding: 15px 15px 15px 30px;">
//                       <img 
//                         src="https://api.bostonasapcoach.com/images/boston_logo.png" 
//                         alt="Boston Coach" 
//                          width="97" height="50"
//                          style="display: block; width: 97px; height: 50px; border: 0; outline: none; text-decoration: none;"/>
//                     </td>
//                     <td align="right" style="padding: 15px 30px 15px 15px;">
//                       <strong>Executive Chauffeured<br />Transportation Worldwide</strong>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//           <table cellpadding="0" cellspacing="0" align="center" style="width: 723px; max-width: 740px; margin: 0 auto;">
//               <tr>
//                   <td colspan="2" style="height: 35px;"></td>
//               <tr>
//           <td colspan="2">
//               <table border="0" cellpadding="0" cellspacing="0">
//                   <tr>
//                       <td style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Booking Request Pending: Reservation #${bookingId}</td>
//                       <td align="right" style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Last Modified On: ${formattedBookingTime}</td>
//                   </tr>
//               </table>
//           </td>
//       </tr>
//       <tr>
//           <td colspan="2" style="padding: 20px 30px;">
//               <p><strong>*Please note: If This Service Request Is within Twenty-Four (24) Hours Please Contact us by phone at 800.960.0232.</strong></p>
//               <p>Your New Reservation request has been received and is currently under review by our staff. As soon as it is revied and confirmed, you will be notify immediately.</p>
//               <p>If you require this Reservation with in Twelve (12) Hours or need further assistance with this Reservation, please contact us by Phone toll-free US/Canada 800.960.0232. 
//               International +1.617.630.0232.to expedite the process. We are Here to Assist You 24/7 
//               </p>
//               <p style="text-align: center; margin-top: 20px;">Thank you for considering our Chauffeured Transportation Services<br />We appreciate your business</p>
//           </td>
//       </tr>
//       ${confidentialNotice}
//   </table>
// </body>
// </html>
//   `;

//   if (bookActionType === "Request A Quote") {
//       userEmailContent = quoteContent;
//   } else if (bookActionType === "Book Now") {
//       userEmailContent = bookingContent;
//   }

//   return userEmailContent;
// };

// module.exports = generateUserEmailContent;

const generateUserEmailContent = (bookingId, formattedDate, formattedTime, bookActionType, bookingTime, firstName, lastName, email, createdAt, bookingTimeParam, billingContact) => {
  let userEmailContent = '';

  // ✅ FIXED: Safe date formatting function with null check
  const formatToMMDDYYYYWithTime = (dateStr) => {
      // ✅ NULL CHECK
      if (!dateStr || dateStr === undefined || dateStr === null) {
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
          
          if (!dateStrValue.includes(' ')) {
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
          
          const [datePart, timePart] = dateStrValue.split(' ');
          
          if (!datePart || !timePart) {
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
          
          const [year, month, day] = datePart.split('-');
          let [hours, minutes, seconds] = timePart.split(':');
          const ampm = +hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      } catch (error) {
          console.error("Error formatting date in userEmailTemplate:", error);
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

  // ✅ Use fallback if bookingTime is undefined
  const timeToFormat = bookingTime || bookingTimeParam || createdAt || new Date().toISOString();
  const formattedBookingTime = formatToMMDDYYYYWithTime(timeToFormat);

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

  const quoteContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quote Request</title>
    <style>${commonStyles}</style>
  </head>
  <body>
          <!-- Full-width table with background color -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgb(177, 175, 169); width: 100% !important;">
            <tr>
              <td align="center">
                <!-- Centered inner table with fixed width -->
                <table cellpadding="0" cellspacing="0" width="723px" style="max-width: 740px; width: 100%;">
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
          <table cellpadding="0" cellspacing="0" align="center" style="width: 723px; max-width: 740px; margin: 0 auto;">
              <tr>
              <td colspan="2" style="height: 35px;"></td>
              </tr>
              <tr>
                  <td colspan="2">
                      <table>
                          <tr>
                              <td  style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Quote Reference #${bookingId}</td>
                              <td  style="padding: 10px 30px; font-size:14px; background-color: #eeeeee; text-align: right;">Last Modified On: ${formattedBookingTime}</td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td colspan="2" style="padding: 20px 30px;">
                      <p><strong>*Please note: If This Service Request Is Within Twenty-Four (24) Hours Please Contact us at 800.960.0232.</strong></p>
                      <p>Your new Quote request has been received and is currently under review by our staff. As soon as it is revied and updated with the rates you will be notify immediately.</p>
                      <p> In the meantime, if you require further assistance with this quote or need to book a ride, please contact us via email at reservations@bostonasapcoach.com by phone
                         toll-free US/Canada 800.960.0232. International +1.617.630.0232.to expedite the process. We are Here to Assist You 24/7.
                      </p>
                      <p style="text-align: center; margin-top: 20px;">Thank you for considering our Chauffeured Transportation Services<br /> We look forward to serving you soon</p>
                  </td>
              </tr>
              ${confidentialNotice}
          </table>
          </body>
          </html>
            `;
            
  const bookingContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Request</title>
    <style>${commonStyles}</style>
  </head>
  <body>
   <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgb(177, 175, 169); width: 100% !important;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" width="723px" style="max-width: 740px; width: 100%;">
          <tr>
            <td style="padding: 15px 15px 15px 30px;">
              <img 
                src="https://api.bostonasapcoach.com/images/boston_logo.png" 
                alt="Boston Coach" 
                width="97" height="50"
                style="display: block; width: 97px; height: 50px; border: 0; outline: none; text-decoration: none;"/>
             </td>
            <td align="right" style="padding: 15px 30px 15px 15px;">
              <strong>Executive Chauffeured<br />Transportation Worldwide</strong>
             </td>
           </tr>
         </table>
       </td>
     </tr>
   </table>
   <table cellpadding="0" cellspacing="0" align="center" style="width: 723px; max-width: 740px; margin: 0 auto;">
       <tr>
          <td colspan="2" style="height: 35px;"></td>
       </tr>
       <tr>
          <td colspan="2">
              <table border="0" cellpadding="0" cellspacing="0">
                   <tr>
                      <td style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Booking Request Pending: Reservation #${bookingId}</td>
                      <td align="right" style="padding: 10px 30px; font-size:14px; background-color: #eeeeee;">Last Modified On: ${formattedBookingTime}</td>
                   </tr>
               </table>
           </td>
       </tr>
       <tr>
          <td colspan="2" style="padding: 20px 30px;">
              <p><strong>*Please note: If This Service Request Is within Twenty-Four (24) Hours Please Contact us by phone at 800.960.0232.</strong></p>
              <p>Your New Reservation request has been received and is currently under review by our staff. As soon as it is revied and confirmed, you will be notify immediately.</p>
              <p>If you require this Reservation with in Twelve (12) Hours or need further assistance with this Reservation, please contact us by Phone toll-free US/Canada 800.960.0232. 
              International +1.617.630.0232.to expedite the process. We are Here to Assist You 24/7 
              </p>
              <p style="text-align: center; margin-top: 20px;">Thank you for considering our Chauffeured Transportation Services<br />We appreciate your business</p>
           </td>
       </tr>
      ${confidentialNotice}
   </table>
</body>
</html>
  `;

  if (bookActionType === "Request A Quote") {
      userEmailContent = quoteContent;
  } else if (bookActionType === "Book Now") {
      userEmailContent = bookingContent;
  }

  return userEmailContent;
};

module.exports = generateUserEmailContent;