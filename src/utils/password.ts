// One place for the password rules, so register, reset and profile all agree.
export const MIN_PASSWORD_LENGTH = 6;

// Returns an error message, or null when the password is acceptable.
export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  // A special character is anything that is not a letter, a number or a space
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return 'Password must include at least one special character (e.g. ! @ # $ %).';
  }
  return null;
}