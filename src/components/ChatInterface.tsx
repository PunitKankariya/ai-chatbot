"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, User } from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function StudyMateAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm StudyMate AI. I'm here to help you with your studies. What would you like to learn about today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [mode, setMode] = useState("detailed")

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add loading message
    const loadingMessage: Message = {
      id: "loading",
      content: "Thinking...",
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Call your backend API
      const response = await fetch('http://localhost:5001/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          history: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Remove loading message and add AI response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== 'loading'),
        {
          id: Date.now().toString(),
          content: data.reply,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      // Update loading message to show error
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== 'loading'),
        {
          id: Date.now().toString(),
          content: 'Sorry, I encountered an error. Please try again later.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B4B] to-[#4C1D95]">
        {/* Floating background shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-violet-400/15 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-400/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-purple-300/12 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-white font-sans">StudyMate AI</h1>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-white/20 text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isUser
                  ? "bg-[#8b5cf6] text-white ml-auto"
                  : "bg-white/10 backdrop-blur-sm text-gray-200 mr-auto border border-white/20"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4 border-t border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          {/* Mode Selector */}
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="eli5" className="text-white hover:bg-gray-800">
                ELI5
              </SelectItem>
              <SelectItem value="exam-prep" className="text-white hover:bg-gray-800">
                Exam Prep
              </SelectItem>
              <SelectItem value="detailed" className="text-white hover:bg-gray-800">
                Detailed
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Input Field */}
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything from your syllabus..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 backdrop-blur-sm rounded-full pr-12 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-cyan-400 hover:bg-cyan-500 text-gray-900 rounded-full w-10 h-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/25"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
