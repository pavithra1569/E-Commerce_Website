module.exports = async function sendEmail(to, subject, text) {
  // For demo: just log. Use nodemailer for real emails.
  console.log(`Sending email to ${to}: ${subject} - ${text}`);
};