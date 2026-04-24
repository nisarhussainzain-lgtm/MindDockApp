// Central state management and utility functions for StudyHub

const STORAGE_KEYS = {
  USERS: 'studyhub_users',
  NOTES: 'studyhub_notes',
  ANNOUNCEMENTS: 'studyhub_announcements',
  CURRENT_USER: 'studyhub_current_user',
  REMINDERS: 'studyhub_reminders',
  SUBJECTS: 'studyhub_subjects'
};

// Default subjects with icons, colors, and descriptions
const DEFAULT_SUBJECTS = [
  { name: 'Probability and Statistics', icon: '📊', color: '#6c63ff', bgColor: 'rgba(108,99,255,0.15)', description: 'Data analysis & probability theory' },
  { name: 'Information Security', icon: '🔐', color: '#ff6584', bgColor: 'rgba(255,101,132,0.15)', description: 'Cryptography & cyber security' },
  { name: 'Software Engineering', icon: '🛠️', color: '#00E676', bgColor: 'rgba(0,230,118,0.15)', description: 'SDLC, design & development' },
  { name: 'Computer Network', icon: '🌐', color: '#00bcd4', bgColor: 'rgba(0,188,212,0.15)', description: 'Protocols, TCP/IP & networking' },
  { name: 'Data Structure', icon: '🌳', color: '#ffd700', bgColor: 'rgba(255,215,0,0.15)', description: 'Arrays, trees, graphs & algorithms' },
  { name: 'Artificial Intelligence', icon: '🤖', color: '#ff8c00', bgColor: 'rgba(255,140,0,0.15)', description: 'ML, neural networks & AI logic' }
];

// Icon options for subject creation/editing
const SUBJECT_ICONS = ['📊', '🔐', '🛠️', '🌐', '🌳', '🤖', '💻', '📐', '🧮', '📡', '🔬', '📝', '🎮', '⚙️', '🧠', '📱', '🖥️', '🗄️', '🔧', '📈', '🎯', '💡', '🔭', '📚', '🧪', '🏗️', '🎨', '🔑', '⚡', '🌟'];

// Color palette for subjects
const SUBJECT_COLORS = ['#6c63ff', '#ff6584', '#00E676', '#00bcd4', '#ffd700', '#ff8c00', '#e040fb', '#ff5252', '#448aff', '#69f0ae', '#ffc107', '#7c4dff', '#18ffff', '#ff6e40', '#b388ff'];

// ===== FIREBASE SETUP =====
const firebaseConfig = {
  apiKey: "AIzaSyCuI8YE3pjHvKkDsccJ_zddRzjWYg89R44",
  authDomain: "studyhub-193f5.firebaseapp.com",
  projectId: "studyhub-193f5",
  storageBucket: "studyhub-193f5.firebasestorage.app",
  messagingSenderId: "1098651436817",
  appId: "1:1098651436817:web:5f132892e9c6b53507aeb0",
  measurementId: "G-EDDS97YM5G"
};

// Initialize Firebase only if the script is loaded
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;

// ===== DATABASE WRAPPER =====
async function getDBData(key) {
  if (!db) return null;
  try {
    const doc = await db.collection('StudyHubStore').doc(key).get();
    return doc.exists ? doc.data().value : null;
  } catch (e) {
    console.error("Error reading from Firestore:", e);
    return null;
  }
}

async function setDBData(key, value) {
  if (!db) return;
  try {
    await db.collection('StudyHubStore').doc(key).set({ value });
  } catch (e) {
    console.error("Error writing to Firestore:", e);
  }
}

// ===== CORE LOGIC =====

async function initDB() {
  if (!db) return;

  let users = await getDBData(STORAGE_KEYS.USERS);
  if (!users) {
    // Add default admin account
    const newUsers = [{
      id: 'admin',
      name: 'Site Admin',
      rollNumber: '0250',
      password: 'APSTNDP@0250',
      role: 'admin'
    }];
    await setDBData(STORAGE_KEYS.USERS, newUsers);
  } else {
    // Force update admin credentials if they already exist
    let admin = users.find(u => u.role === 'admin');
    if (admin) {
        admin.rollNumber = '0250';
        admin.password = 'APSTNDP@0250';
        await setDBData(STORAGE_KEYS.USERS, users);
    }
  }
  
  if (!await getDBData(STORAGE_KEYS.NOTES)) {
    await setDBData(STORAGE_KEYS.NOTES, []);
  }
  
  if (!await getDBData(STORAGE_KEYS.ANNOUNCEMENTS)) {
    await setDBData(STORAGE_KEYS.ANNOUNCEMENTS, []);
  }
  
  if (!await getDBData(STORAGE_KEYS.REMINDERS)) {
    await setDBData(STORAGE_KEYS.REMINDERS, []);
  }

  if (!await getDBData(STORAGE_KEYS.SUBJECTS)) {
    await setDBData(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
  }
}

async function getSubjects() {
  const subjects = await getDBData(STORAGE_KEYS.SUBJECTS);
  return subjects || DEFAULT_SUBJECTS;
}

async function saveSubjects(subjects) {
  await setDBData(STORAGE_KEYS.SUBJECTS, subjects);
}

// Helper: get subject names array
async function getSubjectNames() {
  const subjects = await getSubjects();
  return subjects.map(s => s.name);
}

// Helper: find subject object by name
async function getSubjectByName(name) {
  const subjects = await getSubjects();
  return subjects.find(s => s.name === name) || { name, icon: '📚', color: '#6c63ff', bgColor: 'rgba(108,99,255,0.15)', description: '' };
}

async function getData(key) {
  return await getDBData(key) || [];
}

async function saveData(key, data) {
  await setDBData(key, data);
}

function getCurrentUser() {
  // Keep current user in localStorage for synchronous access on page load
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  window.location.href = 'index.html';
}

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function requireAuth(role = null) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  
  if (role && user.role !== role) {
    window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
    return null;
  }
  
  return user;
}

async function getLiveStats() {
  const users = (await getData(STORAGE_KEYS.USERS)).filter(u => u.role === 'student');
  const notes = (await getData(STORAGE_KEYS.NOTES)).filter(n => n.type === 'official');
  const subjects = await getSubjects();
  return {
    students: users.length,
    notes: notes.length,
    subjects: subjects.length
  };
}

// Ensure DB is initialized
initDB();
