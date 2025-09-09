import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home/Home";
import OTPVerification from "./components/Auth/OTPVerification";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/forgot-password";
import ResetPassword from "./components/Auth/ResetPassword";
import { Toaster } from "react-hot-toast";
import CreateTeam from "./pages/CreateTeam/CreateTeam";
import Navbar from "./components/Home/Navbar";
import TeamDetails from "./pages/TeamDetails/TeamDetails";
import Header from "./pages/TeamDetails/Header";
import PricingSection from "./pages/Pricing";
import ScoreKeeperPage from "./components/Game/FootballPage";
import { AnimatedThemeToggler } from "./components/magicui/animated-theme-toggler";

// Example About component
const About = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <h1 className="text-3xl font-bold">About Page</h1>
    <p className="mt-4 text-gray-600">
      This is the About page of the application.
    </p>
  </div>
);

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);
  const [theme, setTheme] = useState("light");

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

   useEffect(() => {
    document.documentElement.className = theme; // adds "light" or "dark" to <html>
  }, [theme]);

  // Simple AI response logic
  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { text: input, isUser: true, timestamp: new Date() },
    ]);

    // AI response logic
    let response = "Sorry, I don't understand. Try asking something else!";
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      response = "Hey there! How can I assist you today? 😊";
    } else if (lowerInput.includes("help") || lowerInput.includes("support")) {
      response =
        "I'm here to help! Ask me anything about our services or features.";
    }

    // Add AI response with slight delay for natural feel
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false, timestamp: new Date() },
      ]);
    }, 800);

    setInput("");
  };

  // Animation variants for bouncing AI symbol
  const bounceVariants = {
    bounce: {
      y: [-10, 0, -10],
      transition: { repeat: Infinity, duration: 1, ease: "easeInOut" },
    },
  };

  // Animation variants for chatbot modal
  const modalVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
       
   
        {/* Routes */}
   
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/createteam" element={<CreateTeam />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/team/:id" element={<Header />} />
           <Route path="/pricing" element={<PricingSection />} />
           <Route path="/f" element={<ScoreKeeperPage />} />
        </Routes>

        <Toaster />

        {/* Bouncing AI Symbol */}
        <motion.div
          className="fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-full cursor-pointer shadow-lg"
          variants={bounceVariants}
          animate="bounce"
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Chat with AI Assistant"
        >
          <Bot size={24} />
        </motion.div>

        {/* Chatbot Modal */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="fixed bottom-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex justify-between items-center p-4 bg-black text-white rounded-t-lg">
                <h3 className="font-semibold">AI Assistant</h3>
                <button onClick={() => setIsChatOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div
                ref={chatContainerRef}
                className="h-64 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              >
                {messages.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Ask me anything to get started!
                  </p>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        msg.isUser
                          ? "bg-amber-100  text-gray-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {msg.text}
                      <div className="text-xs mt-1 opacity-75">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your question..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-black text-white p-2 rounded-lg"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
