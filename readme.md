# 🗣️ **LiguaLativa Chatbot**

**LiguaLativa** is an interactive bilingual chatbot designed to help users practice and improve their Latvian language skills. Powered by **OpenAI** and **DeepL**, the chatbot facilitates smooth communication between English and Latvian, providing translation and grammar correction while maintaining a friendly, informal tone.

---

## 🌐 **Features**

- **Firebase Authentication** with email verification
-  **Chatbot** powered by **OpenAI** for natural, friendly conversations
-  **Translation** of messages between English and Latvian using **DeepL API**
-  **Grammar correction** and sentence improvement suggestions
-  **MERN Stack** architecture (MongoDB, Express.js, React.js, Node.js)
-  **Language toggle** to switch between English and Latvian
-  **User-friendly** interface with chat options and language translation features

---

## 🛠️ **Technologies Used**

### **Frontend:**
- **React.js** for building the user interface
- **Firebase Authentication** for user sign-up and login
- **Tailwind CSS** for responsive design and styling
- **Axios** for making API calls

### **Backend:**
- **Node.js** and **Express.js** for the server-side logic
- **MongoDB** for storing user data and chat history
- **OpenAI API** (for chatbot responses)
- **DeepL API** (for language translation)

---

## 🧠 **AI Personality & Prompt**

The chatbot in **LiguaLativa** is powered by **OpenAI** and has a custom-designed persona to make conversations feel natural and engaging. Below is the **system prompt** used to guide the chatbot's behavior:

> **System Prompt:**
> 
> You are a friendly Latvian language partner named **LinguaLatvia**. You chat naturally with the user in an informal and friendly tone, like a native Latvian friend helping someone practice their Latvian.
> 
> The user is learning Latvian and may make grammar mistakes or write awkward sentences. Your job is to:
> 
> 1. Understand what they’re trying to say (even if it’s a bit incorrect).  
> 2. Reply with a friendly message in English (to be translated to Latvian).  
> 3. Gently point out and correct any grammar or sentence structure mistakes they made, if any.  
> 4. Optionally, explain a better way to say the sentence naturally in Latvian.  
> 
> Be encouraging and supportive. Make the conversation feel natural and not like a classroom. Use casual tone, slang, or cultural references if appropriate.  
> 
> Your main goals are:
> - Help the user improve their Latvian.  
> - Keep the conversation flowing like a real friend.  
> - **Avoid repeating the same suggestion or correction multiple times.**  
> - **Ensure your responses are varied and do not repeat the same sentences or phrases. Keep it fresh and engaging.**

This design ensures a personalized, supportive, and conversational experience for the user.

---

## 📁 **Folder Structure**

The project structure is divided into two main parts: the **frontend** (React) and **backend** (Node.js).

```
/client       -> React frontend
  /src
    /components    -> Reusable UI components
    /pages         -> Page views
    /config        -> firebase configuration
    /assets        -> Assets used in project
    .env           -> .env file of frontend
/api       -> Node.js backend
  /config        -> config
  server.js   ->  Main Logic for API calls and Controllers
  .env          -> Environment variables for both server

README.md
```

---

## 🚀 **Getting Started**

### 1. Clone the Repository

Start by cloning the repository to your local machine.

```bash
git clone https://github.com/apsdeveloper461/LinguaLatvia.git
cd LinguaLatvia
```

---

### 2. Setup Backend (Server)

#### Install Dependencies

Navigate to the `api` folder and install dependencies.

```bash
cd api
npm install
```

#### Create `.env` File for Backend

Create a `.env` file in the `api/` folder and add the following environment variables:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
DEEPL_API_KEY=your_deepl_api_key
```

Replace the values with your actual API keys.

#### Start the Backend Server

Run the following command to start the backend server:

```bash
nodemon server.js
```

The backend server will run on `http://localhost:5000`.

---

### 3. Setup Frontend (Client)

#### Install Dependencies

Navigate to the `client` folder and install dependencies.

```bash
cd client
npm install
```

#### Create `.env` File for Frontend

Create a `.env` file in the `client/` folder and add the following environment variables:

```env
VITE_FB_API_KEY=your_firebase_api_key
VITE_FB_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FB_PROJECT_ID=your_firebase_project_id
VITE_FB_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FB_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FB_APP_ID=your_firebase_app_id
VITE_SERVER_URL=http://localhost:5000
```

Replace the Firebase API keys with your own credentials.

#### Start the React App

To start the React app,open terminal in LinguaLatvia folder and run:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## ✅ **Usage**

1. **Sign up** or **log in** using your email and verify your account via the verification email sent by Firebase.
2. Start **chatting** with the chatbot. You can write messages in **Latvian**.
3. Use the **Translate** button to see the response in the alternate language.
4. The chatbot will **correct** any grammar mistakes and provide suggestions to improve your Latvian.

---

## 🎯 **Future Improvements**

- **Chat History**: Allow users to save their conversations for future reference.
- **Additional Language Support**: Add support for other languages like Spanish, French, etc.
- **Voice Integration**: Implement voice recognition and text-to-speech capabilities.
- **User Profile**: Implement user profiles to track progress and improvement over time.

---

## 🙌 **Acknowledgements**

- [OpenAI](https://openai.com/)
- [DeepL Translator API](https://www.deepl.com/docs-api)
- [Firebase](https://firebase.google.com/)
- [MERN Stack](https://www.mongodb.com/mern-stack)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

### Explanation:
- **Technologies Used**: Lists the main tech stack for both frontend and backend.
- **Setup Instructions**: Provides detailed steps for setting up both the frontend and backend, including the creation of `.env` files for configuration.
- **Folder Structure**: Breaks down the project folder structure to make it easy for others to understand how the project is organized.
- **Usage**: Explains the user workflow and functionality of the chatbot.
- **Future Improvements**: Suggestions for additional features you may want to add to the project.
- **Acknowledgements**: Credit to external resources like OpenAI, Firebase, and DeepL.
  
You can now use this `README.md` file to publish your **LiguaLativa** chatbot project on GitHub. Let me know if you need further assistance or modifications!
