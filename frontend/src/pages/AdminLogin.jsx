import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple admin check
    if (email === "admin@shopsphere.com" && password === "admin123") {
      const adminUser = {
        name: "Administrator",
        email: "admin@shopsphere.com",
        role: "admin"
      };
      
      const adminToken = 'admin_token_' + Date.now();
      
      localStorage.setItem('token', adminToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      
      toast.success("Welcome Administrator!");
      navigate("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          Admin Login
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Access the admin dashboard
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Login as Admin
          </button>
        </form>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo Credentials:</strong><br />
            Email: admin@shopsphere.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
