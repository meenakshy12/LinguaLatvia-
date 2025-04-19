import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import user from "../assets/woman.svg";
import bot from "../assets/assistant.png";
import { FiSend } from "react-icons/fi";
// import Navbar from "../components/Navbar";
import ChatgptTextRender from "../components/ChatgptTextRender";
import TypingLoader from "../components/TypingLoader";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}`,
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const autoTypingBotResponse = (text, lang = "lt", messageId) => {
    let index = 0;
    const targetText = text[lang];

    let interval = setInterval(() => {
      setPosts((prevState) => {
        return prevState.map((message) => {
          if (message.id === messageId && message.type === "bot") {
            if (index < targetText.length) {
              message.post[lang] = targetText.substring(0, index + 1);
            } else {
              clearInterval(interval);
            }
          }
          return message;
        });
      });
      index++;
    }, 30); // Ensures smooth typing for the entire text
  };

  const onSubmit = () => {
    if (input.trim() === "" || isLoading) return;
    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      type: "user",
      post: { lt: input, en: input, currentLang: "lt" },
    };

    setPosts((prevState) => [...prevState, userMessage]);
    setInput("");

    // Add a loading message in the response box
    const loadingMessage = {
      id: Date.now() + 1,
      type: "bot",
      post: { lt: "", en: "", currentLang: "lt" },
      isLoading: true,
    };
    setPosts((prevState) => [...prevState, loadingMessage]);
    setTimeout(() => {
      const layoutElement = document.querySelector(".layout");
      if (layoutElement) {
        layoutElement.scrollTop = layoutElement.scrollHeight;
      }
    }, 100);
    fetchBotResponse()
      .then((res) => {
        setPosts((prevState) => {
          return prevState.map((message) => {
            if (message.id === loadingMessage.id) {
              setTimeout(() => {
                message.isLoading = false;
              }, 500);

              message.post = {
                lt: res.bot.lt.trim(),
                en: res.bot.en.trim(),
                currentLang: "lt",
              };
            }
            return message;
          });
        });

        autoTypingBotResponse(res.bot, "lt", loadingMessage.id);
        setIsLoading(false);
      })
      .catch(() => {
        setPosts((prevState) => {
          return prevState.map((message) => {
            if (message.id === loadingMessage.id) {
              message.isLoading = false;
              message.post = {
                lt: "Kļūda ģenerēšanā. Lūdzu, atsvaidziniet un mēģiniet vēlreiz.",
                en: "Error in generate. Please refresh and try again.",
                currentLang: "lt",
              };
            }
            return message;
          });
        });
        setIsLoading(false);
      });
  };

  const toggleTranslation = (messageId) => {
    setPosts((prevState) => {
      return prevState.map((message) => {
        if (message.id === messageId && message.type === "bot") {
          message.post.currentLang =
            message.post.currentLang === "lt" ? "en" : "lt";
        }
        return message;
      });
    });

    // No scrolling behavior is added here as per your request.
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] relative flex flex-col ">
      <div className="flex-1  overflow-y-auto mt-0.5 p-6 space-y-6 max-w-4xl mx-auto w-full layout">
        <AnimatePresence>
          {posts.length === 0 && (
            <motion.div
              className="text-center flex flex-col items-center justify-center mt-[25vh]  "
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#1B4A7E]">
                Welcome to LinguaLatvia
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                Discover the beauty of the Latvian language with LinguaLatvia.
                Ask questions, learn phrases, and explore the culture through
                language. Start your journey now!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            id={`message-${post.id}`}
            className={`flex ${
              post.type === "user" ? "justify-end" : "justify-start"
            } w-full`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div
              className={`flex items-end max-w-2xl ${
                post.type === "user" ? "ml-auto" : "mr-auto"
              }`}
            >
              {post.type !== "user" && (
                <div className="w-12 h-12 rounded-full bg-white p-1 mr-3 flex-shrink-0">
                  <img src={bot} alt="Bot" className="rounded-full" />
                </div>
              )}
              <div
                className={`px-5 py-3 rounded-3xl text-[15px] ${
                  post.type === "user"
                    ? "bg-[#1B4A7E] text-white rounded-br-none"
                    : post.type === "loading"
                    ? "bg-gray-50 text-gray-800 rounded-bl-none"
                    : "bg-gray-50 text-gray-800 rounded-bl-none"
                }`}
              >
                {post.isLoading ? (
                  <div className=" py-2 pl-5">
                    <TypingLoader />
                  </div>
                ) : (
                  <p className="leading-relaxed">
                    {post.type === "user" ? (
                      post.post[post.post.currentLang]
                    ) : (
                      <ChatgptTextRender
                        text={post.post[post.post.currentLang]}
                      />
                    )}
                  </p>
                )}
                {post.type === "bot" && (
                  <button
                    onClick={() => toggleTranslation(post.id)}
                    className="text-sm text-blue-500 underline mt-2 cursor-pointer"
                  >
                    {post.post.currentLang === "lt"
                      ? "Translate to English"
                      : "Tulkot latviski"}
                  </button>
                )}
              </div>
              {post.type === "user" && (
                <div className="w-12 h-12 rounded-full  p-1 ml-3 flex-shrink-0">
                  <img src={user} alt="User" className="rounded-full" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pb-5 pt-3  drop-shadow-2xl ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex items-center max-w-3xl mx-auto relative px-3"
        >
          <motion.input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Something Else"
            className="flex-1 px-4 py-4 h-full text-[#747474] text-[15px] rounded-full outline-none shadow-md bg-white"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.button
            type="button"
            onClick={onSubmit}
            className={`ml-4 absolute w-12 h-12 cursor-pointer right-3 rounded-full ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1B4A7E]"
            } text-white flex items-center justify-center`}
            whileTap={!isLoading ? { scale: 0.9 } : {}}
            disabled={isLoading}
          >
            <FiSend className="w-6 h-6" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
