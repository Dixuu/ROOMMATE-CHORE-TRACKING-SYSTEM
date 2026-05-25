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

  return {
    status: "Poor",
    message: "⚠️ Extra Chores Assigned",
  };
}

 export function generateIncentives(scoresObj = {}) {
  return Object.entries(scoresObj).map(([id, user]) => {
    const points = user.points ?? user.totalPoints ?? 0;

    const incentive = getIncentive(points);

    return {
      id,
      name: user.name || "Unknown",
      points,
      tasksDone: user.tasksDone ?? user.taskCount ?? 0,
      status: incentive.status,
      message: incentive.message,
    };
  });
}