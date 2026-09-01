// ════════════════════════════════════════════════════════════════════════════
// CES ENTERPRISE OPERATIONS SYSTEM — firebase-config.js
// ════════════════════════════════════════════════════════════════════════════
// SETUP STEPS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "CES Operations 2026" → Create
// 3. Click the Web icon </> → Register app as "CES Web App" → Continue
// 4. Copy the firebaseConfig values below and paste them here
// 5. In Firebase Console → Firestore Database → Create database → Test mode
// 6. In Firebase Console → Hosting → Get started → follow steps to deploy
// ════════════════════════════════════════════════════════════════════════════

const CES_FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDxOwRG9kurpGSUwpaw-bcjePj4S9dxuko",
  authDomain:        "ces---eos-2026.firebaseapp.com",
  projectId:         "ces---eos-2026",
  storageBucket:     "ces---eos-2026.firebasestorage.app",
  messagingSenderId: "927512326473",
  appId:             "1:927512326473:web:41bd35d4f64ff8596d6a98",
  measurementId:     "G-5STQ8DJ6HT"
};

// Set to false to run in offline/demo mode (no Firebase)
window.CES_FIREBASE_ENABLED = (CES_FIREBASE_CONFIG.apiKey !== "PASTE_YOUR_API_KEY_HERE");
