import { useUser } from "../../context/UserContext";
import React from "react";
import { useNavigate } from "react-router-dom";

export function useHistoryLogic(navigate) {
  const { user, clearUser } = useUser();

  const handleSignOut = () => { clearUser(); navigate("/"); };
  const handleTeamPage = () => navigate("/team");
  const handleMain = () => navigate("/main");
  const handleHistory = () => navigate("/history");

  return {
    user,
    handleSignOut,
    handleTeamPage,
    handleMain,
    handleHistory,
  };
}

export async function fetchHistory(id) {
  try {
    const response = await fetch(`/api/history/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      history: data.history || [],
    };

  } catch (error) {
    console.error("Failed to fetch history:", error);

    return {
      success: false,
      error,
      history: [],
    };
  }
}
