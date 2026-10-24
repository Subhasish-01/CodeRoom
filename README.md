# CodeRoom 💻

**CodeRoom** is a real-time collaborative coding platform where users can join a common room, write code together, and collaborate with other participants in real time.

The project uses a React-based frontend and a Node.js backend with Socket.IO for real-time communication.

## 🚀 Live Demo

[CodeRoom](https://code-room-ruby.vercel.app/)

## ✨ Features

- 👥 Create and join coding rooms
- 💻 Real-time collaborative code editor
- ⚡ Real-time code synchronization
- 🔌 WebSocket communication using Socket.IO
- 📝 Integrated code editor
- 👨‍💻 Multiple users can collaborate in the same room
- 🌐 Separate frontend and backend architecture

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- CodeMirror
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO
- WebSockets

### Tools

- Git
- GitHub
- VS Code
- npm

## 📁 Project Structure

```text
CodeRoom/
│
├── backend/
│
├── frontend/
│   └── vite-project/
│
├── .gitignore
│
└── README.md
```

## 🔄 How CodeRoom Works

```text
User 1
   │
   │
   ▼
┌──────────────────┐
│     Frontend     │
│  React + Editor  │
└────────┬─────────┘
         │
         │ Socket.IO
         ▼
┌──────────────────┐
│     Backend      │
│ Node + Socket.IO │
└────────┬─────────┘
         │
         │ Socket.IO
         ▼
┌──────────────────┐
│     Frontend     │
│  React + Editor  │
└──────────────────┘
         ▲
         │
       User 2
```

When users join the same room, the backend manages the real-time communication between them. Changes made by one user can be shared with the other participants through Socket.IO.

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Subhasish-01/CodeRoom.git
cd CodeRoom
```

### 2. Start the Backend

```bash
cd backend
npm install
```

Start the backend using the command configured in the backend's `package.json`.

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend/vite-project
npm install
npm run dev
```

The Vite development server will provide the local URL in the terminal.

## 🔌 Real-Time Communication

CodeRoom uses **Socket.IO** to provide real-time communication between connected users.

The application handles events such as:

- **JOIN** — User joins a coding room
- **JOINED** — Handles a new participant joining
- **CODE_CHANGE** — Synchronizes code changes
- **DISCONNECTED** — Handles a participant leaving

This allows users in the same room to collaborate on code in real time.

## 🎯 Use Cases

### 👨‍💻 Collaborative Coding

Developers can work together on the same coding problem from different locations.

### 🎓 Coding Practice

Students can use CodeRoom for practicing programming problems with friends.

### 🧑‍🏫 Technical Interviews

The platform can be used as a foundation for collaborative coding interviews.

### 👥 Pair Programming

Two developers can work together on the same piece of code in real time.

## 🔮 Future Improvements

- [ ] Code execution and output
- [ ] Support for multiple programming languages
- [ ] User authentication
- [ ] Persistent rooms
- [ ] Chat system
- [ ] Room history
- [ ] File sharing
- [ ] Coding problem library
- [ ] Improved editor features

## 📚 Learning Outcomes

Through this project, I gained practical experience with:

- React.js
- Vite
- Node.js
- Express.js
- Socket.IO
- WebSocket-based communication
- Real-time application development
- Client-server architecture
- Code editor integration
- Git and GitHub
- Full-stack development

