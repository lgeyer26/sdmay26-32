export async function postData(email, password) {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Accept":       "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.message === "User created successfully") {
      return {
        success: true,
        user: {
          user_id: data.user_id,
          email:   data.email,
          role:    "public",
        },
      };
    } else {
      return { success: false, error: data.message };
    }
  } catch {
    return { success: false, error: "Signup failed. Please try again." };
  }
}
