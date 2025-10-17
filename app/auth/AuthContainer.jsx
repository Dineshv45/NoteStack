'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* ✨ Glowing animated background divider */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-700 blur-3xl opacity-30"
        animate={{
          x: isLogin ? 200 : -200,
          rotate: isLogin ? 45 : -45,
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="relative w-full max-w-4xl h-[600px] flex rounded-3xl overflow-hidden shadow-2xl bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              className="flex w-full"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {/* Left - Blue Design */}
              <div className="flex-1 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex flex-col justify-center items-center p-10">
                <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                <p className="text-center max-w-xs text-gray-200">
                  Login to manage your notes efficiently.
                </p>
                <button
                  onClick={() => setIsLogin(false)}
                  className="mt-6 px-6 py-2 bg-gray-900 hover:bg-gray-800 rounded-md transition"
                >
                  Register
                </button>
              </div>

              {/* Right - Login Form */}
              <div className="flex-1 bg-gray-800 p-10 flex flex-col justify-center">
                <LoginForm />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              className="flex w-full flex-row-reverse"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {/* Right - Blue Design (same as login) */}
              <div className="flex-1 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex flex-col justify-center items-center p-10">
                <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                <p className="text-center max-w-xs text-gray-200">
                  Register to start creating rich notes instantly.
                </p>
                <button
                  onClick={() => setIsLogin(true)}
                  className="mt-6 px-6 py-2 bg-gray-900 hover:bg-gray-800 rounded-md transition"
                >
                  Login
                </button>
              </div>

              {/* Left - Register Form */}
              <div className="flex-1 bg-gray-800 p-10 flex flex-col justify-center">
                <RegisterForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
