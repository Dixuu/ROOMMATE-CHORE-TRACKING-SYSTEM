export const normalizeUser = (id, user) => ({
  id,
  name: user.name || "Unknown",
  points: user.totalPoints || 0,
  tasksDone: user.taskCount || 0,
  status: user.status || "Good",
  message: user.message || ""
});