import { url } from "../utils/constants";

/*
Handles the forgot password form submission.
Sends the user's email to the backend so a reset link can be generated.
*/
export async function handleForgotPasswordSubmit(
  event,
  {
    email,
    setLoading,
    setError,
    setMessage,
    emailTouched,
    setEmailTouched,
    lastRequestTime,
    setLastRequestTime,
  }
) {
  event.preventDefault();

  const cleanEmail = (email || "").trim();

  setError("");
  setMessage("");

  if (setEmailTouched && !emailTouched) setEmailTouched(true);

  if (!cleanEmail) {
    setError("Please enter your email.");
    return;
  }

  // Prevent repeated requests within a short time window
  const now = Date.now();
  const COOLDOWN_MS = 5000;

  if (lastRequestTime && now - lastRequestTime < COOLDOWN_MS) {
    setError("Please wait a few seconds before trying again.");
    return;
  }

  setLastRequestTime(now);
  setLoading(true);

  try {
    const response = await fetch(`${url}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data?.message || "Unable to send reset link.");
      return;
    }

    // Generic success message for security reasons
    setMessage(
      "If an account exists for that email, a reset link has been sent."
    );

  } catch (error) {
    setError("Unable to process request. Please try again later.");
    console.error(error);
  } finally {
    setLoading(false);
  }
}


/*
Updates email state and clears previous messages when the user types.
*/
export function handleEmailChange(
  event,
  setEmail,
  setError,
  setMessage,
  setEmailTouched
) {
  setEmail(event.target.value);

  if (setEmailTouched) setEmailTouched(true);

  if (setError) setError("");
  if (setMessage) setMessage("");
}


/*
Basic validation used for showing inline email errors.
*/
export function getEmailInlineError(email, emailTouched) {
  if (!emailTouched) return "";

  const clean = (email || "").trim();

  if (!clean) return "Please enter your email.";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(clean)) {
    return "Please enter a valid email address.";
  }

  return "";
}