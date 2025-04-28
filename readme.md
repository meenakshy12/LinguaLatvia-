# 🗣️ **LiguaLativa Chatbot**

**LiguaLativa** is an interactive bilingual chatbot designed to help users practice and improve their Latvian language skills. Powered by **OpenAI** and **DeepL**, the chatbot facilitates smooth communication between English and Latvian, providing translation and grammar correction while maintaining a friendly, informal tone.

---

## 🌐 **Features**

- **Firebase Authentication** with email verification
- **Chatbot** powered by **OpenAI** for natural, friendly conversations
- **Translation** of messages between English and Latvian using **DeepL API**
- **Grammar correction** and sentence improvement suggestions
- **Level Tracker** to track student progress and learning levels
- **Games for Learning**:

     1. **Word Meaning Game**: Learn the meaning of words in both Latvian and English, with integrated **Text-to-Speech (TTS)** for pronunciation.
     2. **Fill in the Blanks Game**: Test vocabulary and sentence structure by completing missing words.
     3. **Word Matching Game**: Match Latvian words with their English counterparts.

- **MERN Stack** architecture (MongoDB, Express.js, React.js, Node.js)
- **Language toggle** to switch between English and Latvian
- **User-friendly** interface with chat options and language translation features

---

## 🛠️ **Technologies Used**

### **Frontend:**

- **React.js** for building the user interface
- **Firebase Authentication** for user sign-up and login
- **Tailwind CSS** for responsive design and styling
- **Axios** for making API calls

### **Backend:**

- **Node.js** and **Express.js** for the server-side logic
- **OpenAI API** (for chatbot responses)
- **DeepL API** (for language translation)

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
PORT=4000
OPENAI_API_KEY=your_openai_api_key
DEEPL_API_KEY=your_deepl_api_key
```

Replace the values with your actual API keys.

#### Start the Backend Server

Run the following command to start the backend server:

```bash
nodemon server.js
```

The backend server will run on `http://localhost:4000`.

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
VITE_SERVER_URL=http://localhost:4000
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

- **Sign up** or **log in** using your email and verify your account via the verification email sent by Firebase.
- Start **chatting** with the chatbot. You can write messages in **Latvian**.
- Use the **Translate** button to see the response in the alternate language.
- The chatbot will **correct** any grammar mistakes and provide suggestions to improve your Latvian.
- Play games to further enhance your learning:

    1. Word Meaning Game: Match words with their meanings in both Latvian and English.
    2. Fill in the Blanks: Complete sentences by filling in missing words.
    3. Word Matching: Match Latvian words with their corresponding English phrases.

- Track your learning progress with the Level Tracker to see how much you have advanced in your studies.

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

You can now use this `README.md` file to publish your **LiguaLativa** chatbot project on GitHub. Let me know if you need further assistance or modifications!
