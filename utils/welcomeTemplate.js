
module.exports = function welcomeTemplate({ firstname, lastname, accountNumber, phoneNumber, emailAddress, password }) {
  const currentYear = new Date().getFullYear();

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
      <p style="margin: 4px 0 0 0; font-family: Arial, sans-serif;">
        This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended solely for the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination, distribution, copying or other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail that you received this message by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.<br />Thank you.
      </p>
    </td>
  </tr>
  `;

   const userTemplate = `
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
              <td colspan="2" style="padding: 20px 30px;">
                <h4 style="font-family: Arial, sans-serif; font-size: 13px;">Welcome, ${firstname} ${lastname}</h4>
                <p style="font-family: Arial, sans-serif; font-size: 12px;">
                  Your new credit card account has been created and established successfully.
                  This account is valid for worldwide reservations. Please refer to this account number in any future correspondence with us.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 12px;">Here are the account details:</p>
                <ul style="list-style-type: none; padding-left: 0; font-family: Arial, sans-serif; font-size: 12px;">
                  <li><strong>Account number:</strong> ${accountNumber}</li>
                  <li><strong>User ID:</strong> ${emailAddress}</li>
                  <li><strong>Password:</strong> ${password}</li>
                </ul>
              </td>
            </tr>
                <tr>
                  <td colspan="2" style="padding: 20px 30px;">
                      <p style="font-family: Arial, sans-serif; font-size: 12px;"> If you have any questions or require further assistance, please contact us via email at account_request@bostonasapcoach.com or by Phone toll-free US/Canada 
                          800.960.0232. International +1.617.630.0232.to expedite the process. We are Here to Assist You.
                      </p>
                      <p style="text-align: center; margin-top: 20px; font-family: Arial, sans-serif; font-size: 12px;">TThank you for using our Chauffeured Transportation Services<br /> We appreciate your business</p>
                  </td>
              </tr>
              ${confidentialNotice}
          </table>
    </body>
    </html>
  `;

  const adminTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Account Created</title>
      <style>${commonStyles}</style>
    </head>
    <body>
     <table style="border-collapse: collapse; width: 70%; font-size: 12px; color: #333; font-family: Arial, sans-serif;">
        <tr>
          <td colspan="2" style="padding: 20px 30px;">
            <h4 style="font-family: Arial, sans-serif; font-size:"13px">New Account Created: Account Number ${accountNumber} for ${firstname} ${lastname}</h4>
            <p style="font-family: Arial, sans-serif; font-size:"12px">A new account has been created with the following information:</p>
            <p style="font-family: Arial, sans-serif; font-size:"12px"><strong>Account Number:</strong> ${accountNumber}</p>
            <p style="font-family: Arial, sans-serif; font-size:"12px"><strong>Account Holder Name:</strong> ${firstname} ${lastname}</p>
            <p style="font-family: Arial, sans-serif; font-size:"12px"><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p style="font-family: Arial, sans-serif; font-size:"12px"><strong>Email Address:</strong> ${emailAddress}</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return {
    userTemplate,
    adminTemplate,
  };
};