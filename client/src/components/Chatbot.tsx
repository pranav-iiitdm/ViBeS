// "use client"

// import type React from "react"
// import { useEffect, useRef, useState } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { format } from "date-fns"
// import { Send, Minimize2, Maximize2, Trash2, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Avatar } from "@/components/ui/avatar"
// import { Textarea } from "@/components/ui/textarea"
// import { cn } from "@/lib/utils"
// import { TypingIndicator } from "./typing-indicator"
// import { CitationButton } from "./citation-button"
// // Removed the useMobile import

// interface Message {
//   id: string
//   text: string
//   type: "user" | "bot"
//   timestamp: Date
// }

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// export function Chatbot() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       text: "Welcome to the ViBeS Research Assistant. I can help you find publications, research data, methodologies, and answer questions about our lab's work. How may I assist your research today?",
//       type: "bot",
//       timestamp: new Date(),
//     },
//   ])
//   const [input, setInput] = useState("")
//   const [isMinimized, setIsMinimized] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)
//   const [showScrollButton, setShowScrollButton] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const messagesContainerRef = useRef<HTMLDivElement>(null)
//   // Removed the isMobile variable

//   const scrollToBottom = (behavior: "auto" | "smooth" = "smooth") => {
//     messagesEndRef.current?.scrollIntoView({ behavior })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   useEffect(() => {
//     const container = messagesContainerRef.current
//     if (!container) return

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = container
//       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
//       setShowScrollButton(!isNearBottom)
//     }

//     container.addEventListener("scroll", handleScroll)
//     return () => container.removeEventListener("scroll", handleScroll)
//   }, [])

//   const sendMessage = async () => {
//     if (!input.trim()) return

//     const userMessage = input.trim()
//     setInput("")

//     // Add user message
//     const newUserMessage: Message = {
//       id: Date.now().toString(),
//       text: userMessage,
//       type: "user",
//       timestamp: new Date(),
//     }
//     setMessages((prev) => [...prev, newUserMessage])

//     // Show typing indicator
//     setIsTyping(true)
//     scrollToBottom()

//     try {
//       const response = await fetch(`${API_BASE_URL}/chatbot`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: userMessage }),
//       })

//       const data = await response.json()

//       // Add a small delay to make the typing indicator more realistic
//       setTimeout(() => {
//         setIsTyping(false)

//         const botMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           text: data.response,
//           type: "bot",
//           timestamp: new Date(),
//         }

//         setMessages((prev) => [...prev, botMessage])
//       }, 1000)
//     } catch (error) {
//       console.error("Chat error:", error)

//       setTimeout(() => {
//         setIsTyping(false)

//         const errorMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           text: "Sorry, I encountered an error. Please try again later.",
//           type: "bot",
//           timestamp: new Date(),
//         }

//         setMessages((prev) => [...prev, errorMessage])
//       }, 1000)
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       sendMessage()
//     }
//   }

//   const clearChat = () => {
//     setMessages([
//       {
//         id: Date.now().toString(),
//         text: "Welcome to the ViBeS Research Assistant. I can help you find publications, research data, methodologies, and answer questions about our lab's work. How may I assist your research today?",
//         type: "bot",
//         timestamp: new Date(),
//       },
//     ])
//   }

//     return (
//         <div
//         className={cn(
//             "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
//             isMinimized ? "w-14 h-14" : "w-[380px] h-[600px]"
//         )}
//         >
//         {isMinimized ? (
//             <button
//             className="w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform duration-200"
//             onClick={() => setIsMinimized(false)}
//             aria-label="Open chat"
//             >
//             <MessageCircle className="h-6 w-6" />
//             </button>
//         ) : (
//             <div className="flex flex-col w-full h-full rounded-2xl shadow-2xl border bg-white dark:bg-gray-900 overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-700 to-teal-500 text-white p-3 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                 <Avatar className="h-9 w-9 bg-white/20 text-white font-bold text-sm ring-2 ring-white/30">
//                     <AvatarImage src="/assistant-avatar.png" alt="Assistant" />
//                     <AvatarFallback>RA</AvatarFallback>
//                 </Avatar>
//                 <div>
//                     <h2 className="text-sm font-semibold">ViBeS Assistant</h2>
//                     <p className="text-xs text-blue-100">Online</p>
//                 </div>
//                 </div>
//                 <div className="flex gap-1">
//                 <Button variant="ghost" size="icon" onClick={clearChat} className="hover:bg-white/10 rounded-full" title="Clear chat">
//                     <Trash2 className="w-4 h-4 text-white" />
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="hover:bg-white/10 rounded-full" title="Minimize">
//                     <Minimize2 className="w-4 h-4 text-white" />
//                 </Button>
//                 </div>
//             </div>
    
//             {/* Chat messages */}
//             <div
//                 ref={messagesContainerRef}
//                 className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-900"
//             >
//                 {messages.length === 0 && (
//                 <div className="flex flex-col items-center justify-center h-full text-center opacity-70 space-y-3 px-6">
//                     <Bot className="h-12 w-12 text-teal-500" />
//                     <h3 className="font-medium text-gray-700 dark:text-gray-300">Welcome to ViBeS Research Assistant</h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Ask questions about your research data, methodology, or team information.</p>
//                 </div>
//                 )}
                
//                 <AnimatePresence initial={false}>
//                 {messages.map((msg) => (
//                     <motion.div
//                     key={msg.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className={cn(
//                         "flex",
//                         msg.type === "user" ? "justify-end" : "justify-start"
//                     )}
//                     >
//                     {msg.type !== "user" && (
//                         <Avatar className="h-8 w-8 mr-2 mt-1 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 ring-2 ring-teal-50 dark:ring-teal-800">
//                         <AvatarFallback>RA</AvatarFallback>
//                         </Avatar>
//                     )}
//                     <div
//                         className={cn(
//                         "px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm",
//                         msg.type === "user"
//                             ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
//                             : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700"
//                         )}
//                     >
//                         <div className="whitespace-pre-wrap">{msg.text}</div>
//                         <div className="text-[10px] mt-1 text-gray-300 dark:text-gray-500 text-right">
//                         {format(msg.timestamp, "h:mm a")}
//                         </div>
//                     </div>
//                     {msg.type === "user" && (
//                         <Avatar className="h-8 w-8 ml-2 mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-50 dark:ring-blue-800">
//                         <AvatarFallback>ME</AvatarFallback>
//                         </Avatar>
//                     )}
//                     </motion.div>
//                 ))}
//                 {isTyping && (
//                     <motion.div 
//                     initial={{ opacity: 0 }} 
//                     animate={{ opacity: 1 }} 
//                     className="flex items-start gap-2"
//                     >
//                     <Avatar className="h-8 w-8 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 ring-2 ring-teal-50 dark:ring-teal-800">
//                         <AvatarFallback>RA</AvatarFallback>
//                     </Avatar>
//                     <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
//                         <TypingIndicator />
//                     </div>
//                     </motion.div>
//                 )}
//                 </AnimatePresence>
//                 <div ref={messagesEndRef} />
//             </div>
    
//             {/* Quick Buttons */}
//             <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-wrap gap-2">
//                 {[
//                 { label: "Latest Publications", icon: <BookOpen className="w-3 h-3 mr-1" /> },
//                 { label: "Research Methods", icon: <FlaskConical className="w-3 h-3 mr-1" /> },
//                 { label: "Access Data", icon: <Database className="w-3 h-3 mr-1" /> },
//                 { label: "Research Team", icon: <Users className="w-3 h-3 mr-1" /> }
//                 ].map((item) => (
//                 <Button
//                     key={item.label}
//                     variant="outline"
//                     size="sm"
//                     className="text-xs border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
//                     onClick={() => {
//                     setInput(item.label);
//                     setTimeout(sendMessage, 100);
//                     }}
//                 >
//                     {item.icon}
//                     {item.label}
//                 </Button>
//                 ))}
//             </div>
    
//             {/* Input */}
//             <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
//                 <div className="flex gap-2 items-end relative">
//                 <Textarea
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     placeholder="Ask something about research..."
//                     className="flex-1 resize-none min-h-[48px] max-h-[100px] text-sm pr-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
//                 />
//                 <Button
//                     onClick={sendMessage}
//                     disabled={!input.trim()}
//                     size="icon"
//                     className="absolute right-2 bottom-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-sm transition-colors duration-200"
//                 >
//                     <Send className="h-4 w-4" />
//                 </Button>
//                 </div>
//                 <div className="text-xs text-gray-400 mt-1 flex justify-between px-1">
//                 <span>{input.length > 0 ? `${input.length}/500` : ""}</span>
//                 <span className="flex items-center"><Keyboard className="w-3 h-3 mr-1" /> Shift+Enter for newline</span>
//                 </div>
//             </div>
//             </div>
//         )}
//         </div>
//     );

// //   return (
// //     // <div
// //     //   className={cn(
// //     //     "fixed z-50 transition-all duration-300 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
// //     //     isMinimized
// //     //       ? "bottom-6 right-6 w-14 h-14"
// //     //       : "bottom-6 right-6 w-[400px] h-[550px] sm:w-full sm:bottom-0 sm:right-0 sm:h-[70vh] md:w-[400px] md:bottom-6 md:right-6 md:h-[550px]",
// //     //   )}
// //     // >
// //     <div
// //     className={cn(
// //         "fixed z-50 flex flex-col transition-all duration-300 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
// //         isMinimized
// //         ? "bottom-6 right-6 w-14 h-14"
// //         : "bottom-6 right-6 w-[400px] h-[550px] sm:w-full sm:bottom-0 sm:right-0 sm:h-[70vh] md:w-[400px] md:bottom-6 md:right-6 md:h-[550px]",
// //     )}
// //     >
// //       {/* Chat Header */}
// //       <div className="bg-gradient-to-r from-blue-800 to-teal-700 text-white p-4 flex justify-between items-center">
// //         {!isMinimized && (
// //           <>
// //             <div className="flex items-center gap-2">
// //               <Avatar className="h-8 w-8 bg-white/20">
// //                 <span className="text-xs font-bold">RA</span>
// //               </Avatar>
// //               <h3 className="text-sm font-semibold">Research Assistant</h3>
// //             </div>
// //             <div className="flex gap-1">
// //               <Button
// //                 variant="ghost"
// //                 size="icon"
// //                 className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
// //                 onClick={clearChat}
// //                 title="Clear chat"
// //               >
// //                 <Trash2 className="h-4 w-4" />
// //               </Button>
// //               <Button
// //                 variant="ghost"
// //                 size="icon"
// //                 className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
// //                 onClick={() => setIsMinimized(true)}
// //                 title="Minimize"
// //               >
// //                 <Minimize2 className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </>
// //         )}
// //         {isMinimized && (
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-800 to-teal-700 text-white hover:opacity-90"
// //             onClick={() => setIsMinimized(false)}
// //           >
// //             <Maximize2 className="h-6 w-6" />
// //           </Button>
// //         )}
// //       </div>

// //       {!isMinimized && (
// //         <>
// //           {/* Messages Container */}
// //           <div
// //             ref={messagesContainerRef}
// //             className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900"
// //             style={{ height: "calc(100% - 170px)" }}
// //           >
// //             <AnimatePresence initial={false}>
// //               {messages.map((message) => (
// //                 <motion.div
// //                   key={message.id}
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   transition={{ duration: 0.3 }}
// //                   className={cn("mb-4 flex", message.type === "user" ? "justify-end" : "justify-start")}
// //                 >
// //                   {message.type === "bot" && (
// //                     <Avatar className="h-8 w-8 mr-2 mt-1 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
// //                       <span className="text-xs font-bold">RA</span>
// //                     </Avatar>
// //                   )}
// //                   <div className="flex flex-col max-w-[75%]">
// //                     <div
// //                       className={cn(
// //                         "p-3 rounded-lg",
// //                         message.type === "user"
// //                           ? "bg-blue-600 text-white rounded-br-none"
// //                           : "bg-white dark:bg-gray-800 shadow-sm rounded-bl-none",
// //                       )}
// //                     >
// //                       <p className="text-sm whitespace-pre-wrap">{message.text}</p>
// //                     </div>
// //                     <div
// //                       className={cn(
// //                         "flex items-center mt-1",
// //                         message.type === "user" ? "justify-end" : "justify-start",
// //                       )}
// //                     >
// //                       <span className="text-xs text-gray-500">{format(message.timestamp, "h:mm a")}</span>
// //                       {message.type === "bot" && <CitationButton text={message.text} />}
// //                     </div>
// //                   </div>
// //                   {message.type === "user" && (
// //                     <Avatar className="h-8 w-8 ml-2 mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
// //                       <span className="text-xs font-bold">You</span>
// //                     </Avatar>
// //                   )}
// //                 </motion.div>
// //               ))}
// //               {isTyping && (
// //                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex mb-4">
// //                   <Avatar className="h-8 w-8 mr-2 mt-1 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
// //                     <span className="text-xs font-bold">RA</span>
// //                   </Avatar>
// //                   <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm rounded-bl-none">
// //                     <TypingIndicator />
// //                   </div>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //             <div ref={messagesEndRef} />
// //           </div>

// //           {/* Add quick action buttons for common research queries */}
// //           <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-3">
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               className="text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
// //               onClick={() => {
// //                 setInput("What are the latest publications?")
// //                 setTimeout(sendMessage, 100)
// //               }}
// //             >
// //               Latest Publications
// //             </Button>
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               className="text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
// //               onClick={() => {
// //                 setInput("What research methodologies do you use?")
// //                 setTimeout(sendMessage, 100)
// //               }}
// //             >
// //               Research Methods
// //             </Button>
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               className="text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
// //               onClick={() => {
// //                 setInput("How can I access research data?")
// //                 setTimeout(sendMessage, 100)
// //               }}
// //             >
// //               Access Data
// //             </Button>
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               className="text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
// //               onClick={() => {
// //                 setInput("Who are the principal investigators?")
// //                 setTimeout(sendMessage, 100)
// //               }}
// //             >
// //               Research Team
// //             </Button>
// //           </div>

// //           {/* Scroll to bottom button */}
// //           <AnimatePresence>
// //             {showScrollButton && (
// //               <motion.div
// //                 initial={{ opacity: 0, scale: 0.8 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 exit={{ opacity: 0, scale: 0.8 }}
// //                 className="absolute bottom-[170px] right-4"
// //               >
// //                 <Button
// //                   size="icon"
// //                   variant="secondary"
// //                   className="rounded-full shadow-md h-8 w-8"
// //                   onClick={() => scrollToBottom()}
// //                 >
// //                   <ChevronDown className="h-4 w-4" />
// //                 </Button>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>

// //           {/* Input Area */}
// //           <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
// //             <div className="flex gap-2 items-end">
// //               <Textarea
// //                 value={input}
// //                 onChange={(e) => setInput(e.target.value)}
// //                 onKeyDown={handleKeyPress}
// //                 placeholder="Ask about research papers, methodologies, or data..."
// //                 className="flex-1 min-h-[60px] max-h-[120px] resize-none focus-visible:ring-teal-500"
// //                 maxLength={500}
// //               />
// //               <Button
// //                 onClick={sendMessage}
// //                 disabled={!input.trim()}
// //                 size="icon"
// //                 className="h-10 w-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white"
// //               >
// //                 <Send className="h-4 w-4" />
// //               </Button>
// //             </div>
// //             <div className="flex justify-between mt-1 text-xs text-gray-500">
// //               <span>{input.length > 0 ? `${input.length}/500` : ""}</span>
// //               <span>Press Shift+Enter for new line</span>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   )
  
// }



// export default Chatbot;


"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { format } from "date-fns"
import { 
  Send, 
  Minimize2, 
  Maximize2, 
  Trash2, 
  ChevronDown, 
  MessageCircle, 
  BookOpen, 
  Database, 
  Users, 
  Bot, 
  FlaskConical,
  Keyboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { TypingIndicator } from "./typing-indicator"
import { CitationButton } from "./citation-button"

interface Message {
  id: string
  text: string
  type: "user" | "bot"
  timestamp: Date
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to the ViBeS Research Assistant. I can help you find publications, research data, methodologies, and answer questions about our lab's work. How may I assist your research today?",
      type: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: "auto" | "smooth" = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      type: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    // Show typing indicator
    setIsTyping(true)
    scrollToBottom()

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userMessage }),
      })

      const data = await response.json()

      // Add a small delay to make the typing indicator more realistic
      setTimeout(() => {
        setIsTyping(false)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          type: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      }, 1000)
    } catch (error) {
      console.error("Chat error:", error)

      setTimeout(() => {
        setIsTyping(false)

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an error. Please try again later.",
          type: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMessage])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Welcome to the ViBeS Research Assistant. I can help you find publications, research data, methodologies, and answer questions about our lab's work. How may I assist your research today?",
        type: "bot",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "w-14 h-14" : "w-[380px] h-[600px]"
      )}
    >
      {isMinimized ? (
        <button
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform duration-200"
          onClick={() => setIsMinimized(false)}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      ) : (
        <div className="flex flex-col w-full h-full rounded-2xl shadow-2xl border bg-white dark:bg-gray-900 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-teal-500 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-white/20 text-white font-bold text-sm ring-2 ring-white/30">
                <AvatarFallback>RA</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-semibold">ViBeS Assistant</h2>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={clearChat} className="hover:bg-white/10 rounded-full" title="Clear chat">
                <Trash2 className="w-4 h-4 text-white" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="hover:bg-white/10 rounded-full" title="Minimize">
                <Minimize2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
  
          {/* Chat messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-900 relative"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70 space-y-3 px-6">
                <Bot className="h-12 w-12 text-teal-500" />
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Welcome to ViBeS Research Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ask questions about your research data, methodology, or team information.</p>
              </div>
            )}
            
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    msg.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.type !== "user" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 ring-2 ring-teal-50 dark:ring-teal-800 flex-shrink-0">
                      <AvatarFallback>RA</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm",
                      msg.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-[10px] text-gray-300 dark:text-gray-500">
                        {format(msg.timestamp, "h:mm a")}
                      </div>
                      {msg.type === "bot" && <CitationButton text={msg.text} />}
                    </div>
                  </div>
                  {msg.type === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-50 dark:ring-blue-800 flex-shrink-0">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-start gap-2"
                >
                  <Avatar className="h-8 w-8 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 ring-2 ring-teal-50 dark:ring-teal-800 flex-shrink-0">
                    <AvatarFallback>RA</AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
            
            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-4 right-4"
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full shadow-md h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                    onClick={() => scrollToBottom()}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
  
          {/* Quick Buttons */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-wrap gap-2">
            {[
              { label: "Latest Publications", icon: <BookOpen className="w-3 h-3 mr-1" /> },
              { label: "Research Methods", icon: <FlaskConical className="w-3 h-3 mr-1" /> },
              { label: "Access Data", icon: <Database className="w-3 h-3 mr-1" /> },
              { label: "Research Team", icon: <Users className="w-3 h-3 mr-1" /> }
            ].map((item) => (
              <Button
                key={item.label}
                variant="outline"
                size="sm"
                className="text-xs border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                onClick={() => {
                  setInput(item.label);
                  setTimeout(sendMessage, 100);
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>
  
          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex gap-2 items-end relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask something about research..."
                className="flex-1 resize-none min-h-[48px] max-h-[100px] text-sm pr-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                maxLength={500}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim()}
                size="icon"
                className="absolute right-2 bottom-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-sm transition-colors duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-400 mt-1 flex justify-between px-1">
              <span>{input.length > 0 ? `${input.length}/500` : ""}</span>
              <span className="flex items-center"><Keyboard className="w-3 h-3 mr-1" /> Shift+Enter for newline</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;