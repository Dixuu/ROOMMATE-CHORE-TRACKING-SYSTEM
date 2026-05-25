export const getBadge = (points = 0, status = "Good") => {
  // 🚨 Priority rule (status overrides everything)
  if (status === "Poor") {
    return {
      label: "Needs Support 😢",
      color: "#f87171",
      level: "low",
    };
  }

  // 🥇 Top tier
  if (points >= 200) {
    return {
      label: "Legend 👑",
      color: "#f59e0b",
      level: "legend",
    };
  }

  if (points >= 150) {
    return {
      label: "Gold 🥇",
      color: "#facc15",
      level: "gold",
    };
  }

  if (points >= 90) {
    return {
      label: "Silver 🥈",
      color: "#c0c0c0",
      level: "silver",
    };
  }

  if (points >= 20) {
    return {
      label: "Bronze 🥉",
      color: "#cd7f32",
      level: "bronze",
    };
  }

  return {
    label: "Starter ⭐",
    color: "#60a5fa",
    level: "starter",
  };
};