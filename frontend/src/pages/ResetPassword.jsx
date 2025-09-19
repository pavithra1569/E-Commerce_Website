import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successful!");
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-bold mb-4 text-green-600">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to login page...
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-6 text-center">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}