# 🏠 Roommate Chore & Reward Tracking System  
**ITEC 631 | Australian Catholic University (ACU)**  
**Dixika Thapa | Chahat Thakur | Khusbu Bhandari**

---

## 📌 Project Overview

The **Roommate Chore & Reward Tracking System** is a web-based application designed to help roommates manage household chores fairly and efficiently.

It includes a points-based reward system that motivates users to complete tasks and compete on a live leaderboard.

### ✨ Key Features
- ➕ Create, edit, and delete chores/tasks
- ✔️ Mark tasks as completed to earn points
- 📊 Live leaderboard ranking based on total points
- 🎖️ Badge system (Good Contributor, Top Performer, Weekly Champion)
- 👥 Add and manage roommates dynamically
- ⚡ Real-time updates (mock/local mode by default)
- 🔥 Optional Firebase integration for persistent storage

---

## 🚀 How to Run the Project

### 1. Open the Project
```
File → Open Folder → select `scoring-system`
```
---

### 2. Install Dependencies
Open terminal and run:

```bash
npm install
```
### 3. Start the app
```bash
npm start
```
Opens at
The app will run at : http://localhost:3000

---

## Test Everything

| Feature          | Location                | How to Test                          |
| ---------------- | ----------------------- | ------------------------------------ |
| View leaderboard | Leaderboard tab         | Preloaded users appear automatically |
| Add task         | Add Task tab            | Fill form and submit                 |
| Complete task    | Tasks tab               | Click “Mark Complete”                |
| Edit task        | Tasks tab               | Click “Edit” → update → Save         |
| Delete task      | Tasks tab               | Click “Delete”                       |
| Add roommate     | Add Task tab            | Enter name → Add                     |
| Live scoring     | Dashboard               | Points update instantly              |
| View badges      | Dashboard / Leaderboard | Earned at 50 / 100 / 200 points      |
| Reset system     | Dashboard               | Click “Reset All Scores”             |


### Point Values
| Chore                  | Points       |
| ---------------------- | ------------ |
| Wash Dishes            | 10           |
| Take Out Trash         | 15           |
| Vacuum / Laundry / Mop | 20           |
| Clean Bathroom         | 25           |
| Groceries              | 25           |
| Cook Meal              | 30           |
| Custom Task            | User-defined |


---

⚙️ How Scoring Works
Each task has a defined point value
When a task is marked complete:
Points are added to the assigned roommate
Leaderboard updates automatically
Badge system recalculates based on total points

### Badge System
| Points Range | Badge            |
| ------------ | ---------------- |
| 50+          | Good Contributor |
| 100+         | Top Performer    |
| 200+         | Weekly Champion  |



## GitHub Pages Deployment

### 1. Pushing our code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/scoring-system.git
git push -u origin main
```

### 2. Add homepage in `package.json`
"homepage": "https://YOUR_USERNAME.github.io/scoring-system"

### 3. Install Deployment Tool
npm install gh-pages --save-dev

### 4. Add Scripts in package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

### 5. Deploy Project
```bash
npm run deploy
```
---

## Connect Real Firebase 
1. Create a project at https://console.firebase.google.com
2. Enable **Realtime Database** and **Authentication (Email/Password)**
3. Open `src/firebase/config.js`
4. Set `USE_MOCK = false` and paste your config
5. Update Firebase Realtime Database rules to allow read/write during development

---

## File Structure
```
ROOMMATE CHORE TRACKING SYSTEM/
│
├── public/
│   ├── index.html
│
├── src/
│   ├── components/
│   │   ├── AddTask.jsx
│   │   ├── IncentiveBoard.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── ScoreSummary.jsx
│   │   ├── TaskList.jsx
│   │── firebase/
│   │   ├── config.js
│   │   ├── firebaseConfig.js
│   │   ├── firebaseService.js
│   │── incentive/
│   │   ├── incentiveService.js
│   │── pages/
│   │   ├── login.js 
│   │   ├── Signup.js  
│   │ ── styles/
│   │   ├── App.css
│   │   ├── incentive.css
│   │   ├── leaderboard.css
│   │   ├── login.css
│   ├── utils/
│   │   ├── badge.js 
│   │   ├── normalizeUsers.js   
│   │
│   ├── App.js
│   ├── index.js
│
├── package.json
├── README.md

## 👩‍💻 Team Contributions

The development of the Roommate Chore Tracking System was divided into three main modules to ensure clear responsibility, efficient collaboration, and smooth integration of all features.

---

### Khusbu Bhandari — Tracking System

Khusbu was responsible for developing the **tracking system**, which forms the foundation of the application by managing all chore-related data.

**Key Contributions:**
- Designed and implemented the **core task tracking functionality**
- Developed features for **creating, updating, and deleting chores**
- Managed assignment of tasks to specific roommates
- Ensured proper handling of task lifecycle (creation → update → completion)
- Maintained consistent data flow for task operations across the application

**Outcome:**
This module enables users to efficiently manage and track household chores in a structured and organized manner.

---

### Chahat Thakur — Scoring System

Chahat was responsible for the **scoring system**, which calculates and manages user points based on task completion.

**Key Contributions:**
- Implemented the **points allocation logic for tasks**
- Developed automatic score updates upon task completion
- Built and maintained the **leaderboard ranking system**
- Ensured real-time synchronization of scores across the application
- Integrated scoring logic with task tracking functionality

**Outcome:**
This module ensures accurate performance tracking and introduces a competitive element through real-time scoring and rankings.

---

### Dixika Thapa — Incentive System

Dixika was responsible for the **incentive system**, which enhances user engagement through rewards and motivational features.

**Key Contributions:**
- Designed and implemented the **badge-based reward system**
- Defined performance tiers (Good Contributor, Top Performer, Weekly Champion)
- Linked incentive levels with total accumulated user points
- Ensured automatic badge updates based on performance thresholds
- Added motivational feedback to encourage user participation

**Outcome:**
This module increases user engagement by providing meaningful rewards and recognition for consistent participation.

---

## Collaboration Summary

The project was developed through continuous collaboration and integration among all team members. Each module was independently developed and then combined into a unified system.

- Khusbu focused on task tracking functionality  
- Chahat handled scoring and leaderboard logic  
- Dixika implemented the incentive and reward system  

Regular coordination ensured that all components worked seamlessly together, resulting in a fully functional and integrated application.