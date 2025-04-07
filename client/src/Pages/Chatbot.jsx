import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

import user from "../assets/user2.png";
import bot from "../assets/assistant.png";
import { FiSend } from "react-icons/fi";
import Navbar from '../components/Navbar';

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    useEffect(() => {
        const layoutElement = document.querySelector(".layout");
        if (layoutElement) {
            layoutElement.scrollTop = layoutElement.scrollHeight;
        }
    }, [posts]);

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

    const autoTypingBotResponse = (text) => {
        let index = 0;
        let interval = setInterval(() => {
            if (index < text.length) {
                setPosts((prevState) => {
                    let lastItem = prevState.pop();
                    if (lastItem.type !== "bot") {
                        prevState.push({
                            type: "bot",
                            post: text.charAt(index - 1),
                        });
                    } else {
                        prevState.push({
                            type: "bot",
                            post: lastItem.post + text.charAt(index - 1),
                        });
                    }
                    return [...prevState];
                });
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);
    };

    const onSubmit = () => {
        if (input.trim() === "" || isLoading) return; // Prevent sending if loading
        setIsLoading(true); // Set loading to true
        updatePosts(input);
        updatePosts("loading...", false, true);
        setInput("");
        fetchBotResponse().then((res) => {
            updatePosts(res.bot.trim(), true);
            setIsLoading(false); // Reset loading after response
        });
    };

    const updatePosts = (post, isBot, isLoading) => {
        if (isBot) {
            autoTypingBotResponse(post);
        } else {
            setPosts((prevState) => [
                ...prevState,
                {
                    type: isLoading ? "loading" : "user",
                    post,
                },
            ]);
        }
    };

    const onKeyUp = (e) => {
        if (e.key === "Enter" || e.which === 13) {
            onSubmit();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-blue-50">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full layout">
                <AnimatePresence>
                    {posts.length === 0 && (
                        <motion.div
                            className="text-center flex flex-col items-center justify-center mt-[25vh]  "
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-3xl font-bold text-[#1B4A7E]">Welcome to LinguaLatvia</h1>
                            <p className="mt-4 text-lg text-gray-700">
                                Discover the beauty of the Latvian language with LinguaLatvia.
                                Ask questions, learn phrases, and explore the culture through language.
                                Start your journey now!
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {posts.map((post, index) => (
                    <motion.div
                        key={index}
                        className={`flex ${post.type === "user" ? "justify-end" : "justify-start"} w-full`}
                        initial={{ opacity: 0, y: 20 }} // Start hidden and below
                        animate={{ opacity: 1, y: 0 }} // Transition to visible at its position
                        transition={{ duration: 0.3, delay: index * 0.1 }} // Delay for sequential appearance
                    >
                        <div className={`flex items-end max-w-2xl ${post.type === "user" ? "ml-auto" : "mr-auto"}`}>
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
                                        ? "bg-gray-100 text-gray-800 rounded-bl-none"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                            >
                                {post.type === "loading" ? (
                                    <div className="flex space-x-1">
                                        {[0, 1, 2].map((dot) => (
                                            <motion.div
                                                key={dot}
                                                className="w-2 h-2 bg-[#1B4A7E] rounded-full"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: dot * 0.2,
                                                }}
                                            ></motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="leading-relaxed">{post.post}</p>
                                )}
                            </div>
                            {post.type === "user" && (
                                <div className="w-12 h-12 rounded-full bg-white p-1 ml-3 flex-shrink-0">
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
                        onChange={(e) => setInput(e.target.value)} // Allow typing
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
                        disabled={isLoading} // Prevent sending while loading
                    >
                        <FiSend className="w-6 h-6" />
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
