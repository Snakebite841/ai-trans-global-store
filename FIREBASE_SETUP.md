# Firebase Setup Guide

## 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com).
2. Click "Add Project" and follow the prompts.
3. Enable Google Analytics (Optional).

## 2. Enable Authentication
1. Go to **Build > Authentication**.
2. Click **Get Started**.
3. Under **Sign-in method**, enable **Email/Password**.

## 3. Enable Cloud Firestore
1. Go to **Build > Firestore Database**.
2. Click **Create database**.
3. Start in **Test Mode** (temporarily) or **Production Mode** and update rules later.

### Firestore Security Rules

Deploy these rules to secure your data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admins can read/write everything
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Users Collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if isAdmin();
    }

    // Products Collection
    match /products/{productId} {
      allow read: if true; // public
      allow write: if isAdmin();
    }

    // Orders Collection
    match /orders/{orderId} {
      // Users can see their own orders, and create them.
      // But they cannot modify properties arbitrarily via client side (better done with backend).
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
      allow read: if isAdmin();
    }
  }
}
```

## 4. Get Firebase Config Values
1. Go to **Project Settings** (Gear icon top left).
2. Scroll to **Your apps**, click the web icon `</>`.
3. Register your app, and copy the `firebaseConfig` keys.
4. Paste them inside `frontend/.env`.

## 5. Get Firebase Admin Credentials for Backend
1. Go to **Project Settings > Service accounts**.
2. Click **Generate new private key**.
3. Move the downloaded JSON file to your backend directory (ensure it's ignored in `.gitignore`).
4. Link it in `backend/server.js` or via environment variables.
