function getIncentive(points) {
  if (points >= 100) {
    return {
      status: "Reward",
      message: "🎉 Movie Night Reward",
    };
  }

  if (points >= 50) {
    return {
      status: "Good",
      message: "👍 Well Done",
    };
  }

  if (points < 25) {
    return {
      status: "Start",
      message: "Keep going! 💪",
    };
  }

  return {
    status: "Poor",
    message: "⚠️ Extra Chores Assigned",
  };
}

export function generateIncentives(scoresObj = {}) {
  if (!scoresObj || typeof scoresObj !== "object") return [];

  return Object.entries(scoresObj).map(([id, user]) => {
    const points = user?.totalPoints ?? user?.points ?? 0;
    const tasksDone = user?.taskCount ?? user?.tasksDone ?? 0;

    const incentive = getIncentive(points);

    return {
      id,
      name: user?.name || "Unknown",
      points,
      tasksDone,
      status: incentive.status,
      message: incentive.message,
    };
  });
}