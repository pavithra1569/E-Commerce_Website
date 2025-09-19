import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate password reset for demo
    setTimeout(() => {
      toast.success("Password reset email sent!");
      setEmailSent(true);
      setLoading(false);
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Try Different Email
            </button>
            <Link
              to="/login"
              className="block w-full text-blue-600 py-2 px-4 border border-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
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