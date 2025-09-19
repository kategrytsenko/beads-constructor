export const ERROR_MESSAGES: Record<string, string> = {
    'auth/email-already-in-use': 'Email is already in use',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password is too weak (min 6 characters)',
    'auth/user-not-found': 'No user found',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid credentials',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Check your internet connection',
    default: 'Authentication error. Please try again later',
  };

export const UI_MESSAGES = {
    registrationCompleted: 'Registration completed! Please check your email',
    verifyEmailToSignIn: 'Please verify your email to sign in',
    passwordRequiredForResend: 'Password is required to resend the email',
    verificationEmailSent: 'Verification email sent',
    signedOutSuccess: 'Signed out successfully',
    signOutError: 'Error signing out',
    signedInSuccess: 'Signed in successfully',
  };