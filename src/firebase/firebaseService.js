import {
  ref,
  set,
  get,
  onValue,
  update,
  remove
} from "firebase/database";

import { db } from "./firebaseConfig";

/* =========================
   CHORE POINTS
========================= */
export const CHORE_POINTS = {
  "Wash Dishes": 10,
  "Clean Bathroom": 25,
  "Take Out Trash": 15,
  "Vacuum Living Room": 20,
  "Laundry": 30
};

/* =========================
   USERS
========================= */
export const addUser = async (name) => {
  const userRef = ref(db, `users/${Date.now()}`);

  const user = {
    name,
    totalPoints: 0,
    taskCount: 0
  };

  await set(userRef, user);

  return { uid: userRef.key, ...user };
};

export const getUsers = async () => {
  const snap = await get(ref(db, "users"));
  const data = snap.val() || {};

  return Object.entries(data).map(([uid, value]) => ({
    uid,
    ...value
  }));
};

/* =========================
   TASKS
========================= */
export const addTask = async (task) => {
  const taskRef = ref(db, `tasks/${Date.now()}`);

  const points =
    task.customPoints ??
    CHORE_POINTS[task.title] ??
    10;

  const cleanTask = {
    title: task.title,
    assignedTo: task.assignedTo,
    assignedName: task.assignedName,
    points,
    status: "pending",
    createdAt: Date.now(),
    dueDate: task.dueDate || null
  };

  // 🚨 REMOVE undefined values (Firebase safety)
  Object.keys(cleanTask).forEach((key) => {
    if (cleanTask[key] === undefined) {
      delete cleanTask[key];
    }
  });

  await set(taskRef, cleanTask);

  return { success: true, points };
};

export const completeTask = async (taskId, userId, userName) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  const userRef = ref(db, `users/${userId}`);

  const taskSnap = await get(taskRef);
  if (!taskSnap.exists()) {
    return { success: false, message: "Task not found" };
  }

  const task = taskSnap.val();

  const userSnap = await get(userRef);
  const user = userSnap.val();

  const newPoints = (user.totalPoints || 0) + (task.points || 0);
  const newCount = (user.taskCount || 0) + 1;

  await update(userRef, {
    totalPoints: newPoints,
    taskCount: newCount
  });

  await update(taskRef, {
    status: "completed",
    completedAt: Date.now(),
    completedName: userName
  });

  return {
    success: true,
    pointsAwarded: task.points || 0
  };
};

export const updateTask = async (taskId, updates) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, updates);
};

export const deleteTask = async (taskId) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  await remove(taskRef);
};

/* =========================
   RESET SYSTEM
========================= */
export const resetAllScores = async () => {
  await remove(ref(db, "users"));
  await remove(ref(db, "tasks"));
};

/* =========================
   BADGE SYSTEM
========================= */
export const getBadge = (points) => {
  if (points >= 200) return { label: "🔥 Legend", color: "#f59e0b" };
  if (points >= 100) return { label: "⭐ Pro", color: "#3b82f6" };
  if (points >= 50) return { label: "👍 Good", color: "#22c55e" };
  return { label: "🌱 New", color: "#94a3b8" };
};

/* =========================
   OPTIONAL REALTIME (SAFE)
========================= */
export const subscribeToScores = (callback) => {
  return onValue(ref(db, "users"), (snap) => {
    const data = snap.val() || {};
    const list = Object.entries(data).map(([uid, v]) => ({
      uid,
      ...v
    }));
    callback(list);
  });
};