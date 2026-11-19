import { EMAILJS } from '../config';

// Send the password-reset email through EmailJS.
// Throws an error if the email could not be sent.
export async function sendResetEmail(toEmail: string, username: string, resetLink: string, minutes: number) {

  if (__DEV__) console.log('Password reset link:', resetLink);

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS.serviceId,
      template_id: EMAILJS.templateId,
      user_id: EMAILJS.publicKey,
      
      template_params: { to_email: toEmail, username, reset_link: resetLink, expires_in: `${minutes} minutes` },
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}