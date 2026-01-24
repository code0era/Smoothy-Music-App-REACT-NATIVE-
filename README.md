

## ✅ Features

### 🎧 Core
- **Home Screen (Spotify-style sections)**
  - Section-wise UI: *Recently Played*, *Artists*, *Most Played*
  - Real API data (no mock)
  - Song cards with cover images
- **Search**
  - Real-time search for Songs / Artists / Albums via JioSaavn API
  - **Song results show image + artist info**
- **Global Music Player**
  - **Mini Player** persistent across screens
  - Full Player with: **Play/Pause**, **Next/Prev**, **Seek bar**
- **Queue**
  - Add / remove songs
  - Reorder queue (no worklets dependency to keep Expo Go compatible)
- **Settings**
  - **Dark/Light mode toggle** (affects all pages)
  - Audio quality: High / Medium / Low (bitrate selection from API downloadUrl)

### ⭐ Bonus
- Shuffle and Repeat controls (if enabled in your store/service)
- State persistence ready (Recently played / Settings)

---
APP link :https://expo.dev/accounts/codeera/projects/lokal-music/builds/745368bb-e838-45f4-944e-26806d945682


<table>
  <tr>
    <td align="center">
      <b>Home Screen</b><br/>
      <img src="https://github.com/user-attachments/assets/f92d2447-83d2-421d-8de5-64a8d63f3a3f" width="250"/>
    </td>
    <td align="center">
      <b>Search Screen</b><br/>
      <img src="https://github.com/user-attachments/assets/bfd65441-5a7a-4116-8db4-731e07f1690a" width="250"/>
    </td>
    <td align="center">
      <b>Player Screen</b><br/>
      <img src="https://github.com/user-attachments/assets/07cf23e5-4e98-4467-b75c-550c702898ff" width="250"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Mini Player</b><br/>
      <img src="https://github.com/user-attachments/assets/1acc4869-aa47-4b22-80b5-81c30c27a9cd" width="250"/>
    </td>
    <td align="center">
      <b>Queue Screen</b><br/>
      <img src="https://github.com/user-attachments/assets/6afd192e-baf8-4add-90b5-d8d521fef9bb" width="250"/>
    </td>
    <td align="center">
      <b>Settings Screen</b><br/>
      <img src="https://github.com/user-attachments/assets/74676200-40cf-4e5d-bf0f-1270769b70c7" width="250"/>
    </td>
  </tr>
</table>
<table>
  <tr>
    <td align="center">
      <b>Home – Light Mode</b><br/>
      <img src="https://github.com/user-attachments/assets/15edbe19-34e2-478d-9507-42498e75ab40" width="250"/>
    </td>
    <td align="center">
      <b>Search – Light Mode</b><br/>
      <img src="https://github.com/user-attachments/assets/801b796f-46cb-4d89-a9b4-9b15593929ce" width="250"/>
    </td>
  
  </tr>
</table>

VEDIO::


https://drive.google.com/file/d/1X6zR__ZOAi5wB9sVQzvLR6bNlf_HAWDK/view?usp=sharing

---




## 🧱 Architecture (High Level)

```

src/
api/           -> axios client + JioSaavn endpoints + types
components/    -> reusable UI (SongRow, MiniPlayer, Cards, Tabs)
navigation/    -> React Navigation (Bottom Tabs + Stack Modals)
screens/       -> Home, Search, Player, Queue, Settings, Album
services/      -> audioService (expo-av), storage helpers
store/         -> Zustand stores (playerStore, settingsStore)
theme/         -> colors + theme hooks

```

### Why this structure?
- Keeps UI separate from **API**, **audio engine**, and **state layer**
- Makes it easy to scale (Playlist, Downloads, Auth, Backend) without rewriting the app
- Helps in interview evaluation: **clean separation of concerns**

---

## 🧠 State Management (Zustand)

### `playerStore`
- `activeSong`
- `queue`
- `positionMs`, `durationMs`, `isPlaying`
- `recentlyPlayed`
- `shuffle`, `repeat`
- methods: `setQueueAndPlay`, `next`, `prev`, `seek`, etc.

### `settingsStore`
- `themeMode` (dark/light)
- `quality` (high/medium/low)
- methods: `toggleThemeMode`, `setQuality`

> Mini Player and Full Player use the SAME global store => always in sync.

---

## 🌐 API Used (JioSaavn)
Base URL:
```

[https://saavn.sumit.co/](https://saavn.sumit.co/)

```

Examples:
- Search Songs:
```

GET /api/search/songs?query=arijit

````

Docs:
- https://saavn.sumit.co/docs

---

## ⚙️ Tech Stack

- **Expo (SDK 52)**
- **React Native + TypeScript**
- **React Navigation v6** (no Expo Router)
- **Zustand** for global state
- **expo-av** for audio playback
- **Axios** for API calls
- **AsyncStorage/MMKV** (optional) for persistence
- **Ionicons** for icons

---

## 🚀 Setup & Run

### 1) Clone
```bash
git clone <your-repo-url>
cd music-player
````

### 2) Install dependencies

```bash
npm install
```

### 3) Start Expo

```bash
npx expo start
```

### 4) Run

* Press `a` → Android emulator
* Scan QR → Expo Go (physical device)

### Clean start (recommended if cache issues)

```bash
npx expo start -c
```



## 🧪 What was tested

* Switching tabs while playing → **Mini Player stays updated**
* Going to Player Screen → same song, same position, same state
* Search results → play directly → queue updates correctly
* Theme toggle → updates UI across Home/Search/Settings/Player

---

## 🔧 Trade-offs / Notes

### Why no drag-drop reorder?

Some drag libraries require **Worklets native module**, which is not available in **Expo Go** by default.
To keep it **build-free and evaluation-friendly**, queue reorder is done via up/down controls.

✅ This keeps the app:

* stable on Expo Go
* compatible with SDK 52
* easy to review

### Background Playback

Expo AV supports audio playback, but full background playback reliability can differ between:

* Expo Go
* EAS Dev Build
* Production build

If needed, next step is a **custom dev build** using EAS.

---

## 🛣️ Future Scope

* Offline downloads + local file caching
* Playlist creation & management
* Artist/Album detail screens with full tracklists
* Auth + backend (favorites, playlists sync)
* Better recommendation feed using user history

---

## 📦 Deliverables Checklist (Assignment)

* ✅ GitHub Repository
* ✅ APK (EAS build if required)
* ✅ README (this file)
* ✅ Demo video (2–3 minutes)

---

## 👤 Author

**SMOOTHY Music Player**
Built with ❤️ using React Native + Expo SDK 52.

```

If you want, I can also generate:
- `screenshots/` folder creation commands
- a ready **README with badges + feature table**
- a **2–3 min demo video script** (what to show + what to say)
::contentReference[oaicite:0]{index=0}
```
