import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    // Check if user already exists in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find(user => user.email === email);
    
    if (existingUser) {
      toast.error("Email already exists. Please use a different email or login.");
      return;
    }

    // Create new user
    const newUser = {
      name: name,
      email: email,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Add to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Set current user session
    const token = 'user_token_' + Date.now();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    toast.success(`Welcome to ShopSphere, ${name}!`);
    
    // Dispatch custom event to update navbar
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    navigate("/");
  };

  const handleGoogleSuccess = (data) => {
    // Dispatch custom event to update navbar
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            buttonText="Sign up with Google"
          />
        </form>
        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
