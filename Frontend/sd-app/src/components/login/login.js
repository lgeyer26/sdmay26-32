export async function handleLoginSubmit(event, email, password, setError) {
  event.preventDefault();

  if (!email || !password) {
    setError("Please enter both email and password.");
    return { success: false };
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Accept":       "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.message === "Login successful") {
      return {
        success: true,
        user: {
          user_id: data.user_id,
          email:   data.email,
          role:    data.role ?? "public",
        },
      };
    } else {
      return { success: false, error: data.message };
    }
  } catch {
    return { success: false, error: "Login failed. Please try again." };
  }
}

export function handleEmailChange(event, setEmail) {
  setEmail(event.target.value);
}

export function handlePasswordChange(event, setPassword) {
  setPassword(event.target.value);
}
