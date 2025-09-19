import { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch user info from backend
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2"><strong>Username:</strong> {user.name}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}