# 📒 NoteNest

NoteNest is a simple and intuitive note-taking web app built with React and JSON Server. It allows users to create, categorize, and edit notes in a clean interface inspired by NoteKeeper.

## 🚀 Features

- 📝 Create and edit notes with titles and full content
- 📂 Organize notes into categories like Personal, Work, Ideas, etc.
- 🔍 Filter notes by category using the sidebar
- 💾 Notes are persisted using JSON Server (REST API)
- ⚡ Instant updates and intuitive UI

## 📸 Demo

### 🖼️ Home View  
![Home View](https://raw.githubusercontent.com/BHARATHMM562/NoteNest/main/Screenshot%202025-05-06%20223951.png)

### 📝 Create New Note  
![Create New Note](https://raw.githubusercontent.com/BHARATHMM562/NoteNest/main/Screenshot%202025-05-06%20224008.png)

### ✏️ Edit Note  
![Edit Note](https://raw.githubusercontent.com/BHARATHMM562/NoteNest/main/Screenshot%202025-05-06%20224025.png)



## 📁 Project Structure
notekeeper/

├── db.json # JSON Server backend data

├── notekeeper-frontend/ # React frontend application

## HOW TO RUN THE CODE
## Install dependencies for the frontend:
cd notekeeper-frontend
npm install


## Return to the root folder and install JSON Server (if not installed globally):
npm install json-server

## Running the Application
Start the JSON Server (from the root folder):
npm run server


## Start the React frontend (from the notekeeper-frontend folder):
npm start
