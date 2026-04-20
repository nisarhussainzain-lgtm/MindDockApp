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

function initDB() {
  let users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    // Add default admin account
    const newUsers = [{
      id: 'admin',
      name: 'Site Admin',
      rollNumber: '0250',
      password: 'APSTNDP@0250',
      role: 'admin'
    }];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  } else {
    // Force update admin credentials if they already exist
    let parsedUsers = JSON.parse(users);
    let admin = parsedUsers.find(u => u.role === 'admin');
    if (admin) {
        admin.rollNumber = '0250';
        admin.password = 'APSTNDP@0250';
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
    }
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify([]));
  }

  // Initialize subjects if not present
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
  }
}

function getSubjects() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS)) || DEFAULT_SUBJECTS;
}

function saveSubjects(subjects) {
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
}

// Helper: get subject names array (for backward compatibility)
function getSubjectNames() {
  return getSubjects().map(s => s.name);
}

// Helper: find subject object by name
function getSubjectByName(name) {
  const subjects = getSubjects();
  return subjects.find(s => s.name === name) || { name, icon: '📚', color: '#6c63ff', bgColor: 'rgba(108,99,255,0.15)', description: '' };
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getCurrentUser() {
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
    // Attempted to access restricted page, send to own dashboard
    window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
    return null;
  }
  
  return user;
}

// Get live stats
function getLiveStats() {
  const users = getData(STORAGE_KEYS.USERS).filter(u => u.role === 'student');
  const notes = getData(STORAGE_KEYS.NOTES).filter(n => n.type === 'official');
  const subjects = getSubjects();
  return {
    students: users.length,
    notes: notes.length,
    subjects: subjects.length
  };
}

// Ensure DB is initialized
initDB();
