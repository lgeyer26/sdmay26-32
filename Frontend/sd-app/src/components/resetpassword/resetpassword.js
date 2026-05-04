import { url } from "../utils/constants";

export async function handleResetPasswordSubmit(
  event,
  {
    token,
    password,
    confirmPassword,
    isPasswordValid,
    setPassword,
    setConfirmPassword,
    setLoading,
    setError,
    setMessage,
  }
) {
  event.preventDefault();

  setError("");
  setMessage("");

  if (!token) {
    setError("Reset link is missing or invalid.");
    return;
  }

  if (!password || !confirmPassword) {
    setError("Please fill out all fields.");
    return;
  }

  if (!isPasswordValid) {
    setError("Password does not meet all requirements.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${url}/api/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        new_password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data?.message || "Unable to reset password.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage(data?.message || "Password reset successful.");
  } catch (error) {
    setError("Network error. Please try again.");
    console.error(error);
  } finally {
    setLoading(false);
  }
}