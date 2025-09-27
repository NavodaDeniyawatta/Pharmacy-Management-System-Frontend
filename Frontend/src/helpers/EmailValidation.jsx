// Helper function to validate email
export const EmailValidation = (email) => {
  // Regular expression for basic email format validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email); // Returns true if email matches the regex pattern, otherwise false
};
