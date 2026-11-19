# Notes App

A secure, dark-themed notes app built with **React Native (Expo)**, **Expo Router** and **TypeScript**.
Users can register, log in, and manage their own notes (with categories, search and sorting).
All data is stored on the device using **AsyncStorage**.

---

## Table of contents
1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Setup from the ZIP (first time)](#setup-from-the-zip-first-time)
6. [Putting the project on GitHub](#putting-the-project-on-github)
7. [Cloning and running the project](#cloning-and-running-the-project)
8. [Opening the app on your phone or emulator](#opening-the-app-on-your-phone-or-emulator)
9. [Using the app](#using-the-app)
10. [How it works](#how-it-works)
11. [Troubleshooting](#troubleshooting)

---

## Features

**User management**
- Register with email, username and password
- Log in with email and password
- Protected routing: logged-out users only see login/register; logged-in users never see them
- Profile page to update email, username and password (current password required)
- Passwords are stored as SHA-256 hashes, never as plain text

**Notes**
- **Create** notes with text, category, optional title and the date added
- **Read** all of your own notes (other users' notes are never shown)
- **Update** notes; edited notes show an "edited" timestamp
- **Delete** notes (from the card with a long-press, or inside the edit screen)
- **Search:** every word you type must appear in the note's title or text
- **Sort** by date added, newest first or oldest first
- **Categories:** Work, Study, Personal, plus an "All Notes" view

## Tech stack

| Purpose | Tool |
|---|---|
| Framework | React Native with Expo |
| Language | TypeScript |
| Navigation / routing | Expo Router (file-based) |
| Storage | `@react-native-async-storage/async-storage` |
| Password hashing | `expo-crypto` |
| Icons | `@expo/vector-icons` |

## Project structure

```
notes-app/
├── app/
│   ├── _layout.tsx          # Root layout + route guard (protected routing)
│   ├── note.tsx             # Add / edit a note (modal screen)
│   ├── (auth)/              # Screens for logged-out users
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (app)/               # Screens for logged-in users (bottom tabs)
│       ├── _layout.tsx      # Tab bar: Home, "+", Profile
│       ├── index.tsx        # Home: search, sort, categories, notes grid
│       ├── add.tsx          # Placeholder for the "+" tab (opens note.tsx)
│       └── profile.tsx      # Update credentials, log out
├── components/
│   └── Field.tsx            # Reusable dark text input
├── context/
│   ├── AuthContext.tsx      # Register, login, logout, profile update
│   └── NotesContext.tsx     # Create, read, update, delete notes
├── theme.ts                 # Colours and category names
├── types.ts                 # Shared TypeScript types
├── tsconfig.json
└── README.md
```

## Prerequisites

Install these before you start:

1. **Node.js (LTS version):** download from https://nodejs.org. Check it worked:
   ```
   node -v
   npm -v
   ```
2. **Git:** download from https://git-scm.com. Check it worked:
   ```
   git --version
   ```
3. **A way to view the app (pick one):**
   - **Phone (easiest):** install the **Expo Go** app from the Google Play Store or Apple App Store
   - **Android emulator:** install Android Studio and create a virtual device
   - **iOS simulator:** requires a Mac with Xcode

---

## Setup from the ZIP (first time)

The ZIP contains only the app's source files. You first need to create an Expo project around them.
Skip to [Cloning and running the project](#cloning-and-running-the-project) if you already have a repository that contains a `package.json`.

All commands below are for **PowerShell / Terminal**.

**1. Unzip** `notes-app.zip`, then rename the extracted folder to `notes-src` so it does not clash with the project you are about to create.

**2. Create a blank Expo TypeScript project** in the folder where you keep your code:
```
npx create-expo-app@latest notes-app --template blank-typescript
cd notes-app
```
Check that `package.json`, `app.json` and `node_modules` exist (`dir` on Windows, `ls` on Mac/Linux).

**3. Install the dependencies:**
```
npx expo install expo-router expo-linking expo-constants expo-crypto expo-status-bar @react-native-async-storage/async-storage @expo/vector-icons react-native-safe-area-context react-native-screens
```

**4. Copy the source files** from `notes-src` into your new `notes-app` folder:
`app/`, `components/`, `context/`, `theme.ts`, `types.ts`, `tsconfig.json` (replace the existing `tsconfig.json` when asked).

**5. Delete the template files** `App.tsx` and `index.ts` in the project root. Expo Router replaces them.

**6. Edit `package.json`** so the `main` field says:
```json
"main": "expo-router/entry"
```

**7. Edit `app.json`** and add a `scheme` inside the `expo` object:
```json
{
  "expo": {
    "scheme": "notes",
    "name": "notes-app"
  }
}
```
(Keep the other fields already in the file; only add the `"scheme"` line.)

**8. Start the app:**
```
npx expo start -c
```

---

## Putting the project on GitHub

Do this once your project runs, so you (or anyone else) can clone it later.

1. Create an **empty** repository on https://github.com (no README, no .gitignore).
2. In your `notes-app` project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit: notes app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
   Replace the URL with your own repository's URL.

The Expo template already includes a `.gitignore` that keeps `node_modules` out of the repository.

## Cloning and running the project

1. **Clone the repository:**
   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO
   ```
2. **Install the dependencies** (this reads `package.json` and recreates `node_modules`):
   ```
   npm install
   ```
3. **Start the development server:**
   ```
   npx expo start -c
   ```
   The `-c` flag clears the cache, which avoids many odd errors on a first run.

A QR code and a short menu appear in the terminal. Leave this terminal running while you use the app.

## Opening the app on your phone or emulator

**On a real phone (Expo Go)**
1. Make sure the phone and the computer are on the **same Wi-Fi network**.
2. **Android:** open Expo Go and tap **Scan QR code**, then scan the QR code in the terminal.
3. **iPhone:** open the normal **Camera** app, point it at the QR code, and tap the banner that appears.
4. The app builds and opens. Saving a file in your editor reloads it automatically.

If the phone cannot connect (for example on a school, work or guest network), use tunnel mode:
```
npx expo start --tunnel
```
Say yes if it asks to install `@expo/ngrok`.

**On an Android emulator:** start your virtual device in Android Studio, then press **`a`** in the terminal.

**On an iOS simulator (Mac only):** press **`i`** in the terminal.

**In a web browser (quick preview only):** press **`w`**. Some features are designed for mobile, so use a phone or emulator for the real experience. Web also needs `react-dom` and `react-native-web`, which you can install with `npx expo install react-dom react-native-web`.

## Using the app

1. **Register:** on the login screen tap **Create an account**. Enter an email, a username and a password of at least 6 characters.
2. **Home screen:** you see a greeting, a search bar, category tabs and your notes as coloured cards.
3. **Add a note:** tap the yellow **+** button in the bottom bar. Write your text, pick a category, optionally add a title, then tap **Add note**.
4. **Edit a note:** tap a card, change it, then tap **Save changes**. The card now shows an "edited" date.
5. **Delete a note:** long-press a card and confirm, or open the note and tap **Delete note**.
6. **Search:** type words in the search bar. A note appears only if it contains all the words.
7. **Sort:** tap **Newest / Oldest** at the right of the search bar to flip the order.
8. **Categories:** tap **All Notes**, **Work**, **Study** or **Personal** to filter.
9. **Profile:** tap the person icon. Change your email, username or password (you must enter your current password), or tap **Log out**.

## How it works

- **Protected routing:** `app/_layout.tsx` watches the logged-in user. If there is none, it redirects to `/login`. If there is one, it keeps them out of `(auth)` and sends them to the home screen.
- **Auth:** `context/AuthContext.tsx` saves users in AsyncStorage under `users` and the active session under `session`. Passwords are hashed with SHA-256 before saving.
- **Notes:** `context/NotesContext.tsx` saves all notes under `notes` and filters them by the logged-in user's id, so each user only sees their own.
- **Theme:** all colours live in `theme.ts`, so login, register and the rest of the app stay consistent. Change a colour there and it updates everywhere.
- **Categories:** edit the `CATEGORIES` array in `theme.ts` to add or rename categories.

**Good to know:** data lives only on the device. Uninstalling the app or clearing Expo Go's storage deletes it. This is a learning project; a production app would use a backend with salted password hashing.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Project root directory not found` | You are not inside an Expo project. Make sure `package.json` exists in your current folder (`dir` / `ls`). |
| `Unable to resolve module ...` | Stop the server, run `npm install`, then `npx expo start -c`. |
| Phone cannot load the app | Same Wi-Fi? If so, try `npx expo start --tunnel`. |
| Blank or white screen | Check that `package.json` has `"main": "expo-router/entry"` and that `App.tsx` and `index.ts` are deleted. |
| Links or routes do not work | Check that `app.json` contains `"scheme": "notes"`. |
| Expo Go says the project is incompatible | Update Expo Go from your app store, or run `npx expo install --fix`. |
| `npx` or `npm` not recognised | Reinstall Node.js, then close and reopen the terminal. |
| PowerShell blocks scripts | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then try again. |
| Strange errors after changing files | Stop the server and run `npx expo start -c`. |
| Check for TypeScript errors | Run `npx tsc --noEmit`. |
