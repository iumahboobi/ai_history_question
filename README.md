# 🏛️ AI History Explorer

A sleek, React-based web application that acts as an intelligent history assistant. Powered by the Minimax AI API, this chat interface allows users to ask complex historical questions and receive accurate, detailed, and context-rich answers in real-time.

## ✨ Features
- **Interactive Chat UI**: Clean, modern, and responsive messaging interface.
- **Minimax AI Integration**: Direct integration with Minimax's Global API (`MiniMax-Text-01` model).
- **Secure Credential Handling**: Users can securely input their API Key and Group ID directly via the UI or through environment variables.
- **Robust Error Handling**: Parses and displays exact API error messages (e.g., invalid keys, insufficient balance) for easy debugging.

## 🚀 Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. *(Windows Users Only)* Set your `ComSpec` environment variable if you encounter an `ERR_INVALID_ARG_TYPE` error:
   ```powershell
   $env:ComSpec = "C:\Windows\System32\cmd.exe"
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Get your API Key from the [Minimax Platform](https://platform.minimax.io/) and enter it in the app!

## 🛠️ Tech Stack
- React + TypeScript
- Vite
- Custom CSS
