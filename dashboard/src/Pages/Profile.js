import axios from "axios";
import { useSelector } from "react-redux";
import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faBell, faUser, faHome, faUsers } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../Store/slices/authSlices"; // Import the logout action
import { useDispatch } from "react-redux";




const Profile = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
  const user = useSelector((state) => state.auth.user); // Get the user data from Redux
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("profile");
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await axios.patch(
        "https://dashboaard-pro.onrender.com/api/auth/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add the token to request headers
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/"); // Redirect to login page
  };

  return (
    <div
    className={`min-h-screen ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`}
  >
    <nav className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-roboto font-bold">User Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <i><FontAwesomeIcon icon={darkMode ? faSun : faMoon} /></i>
          </button>
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <i><FontAwesomeIcon icon={faBell} /></i>
            </button>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md col-span-1`}
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
           
                    <img
                      src={`https://dashboaard-pro.onrender.com/${user.profilePicture}`}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                 
            </div>
            <h2 className="mt-4 font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-500 mt-2">
              Last login: {user.lastLogin}
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "dashboard"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
             <FontAwesomeIcon icon={faHome} className="mr-2" /> Dashboard
            </button>
            <button
              onClick={() => navigate("/profile") }
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
               <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "friends"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" /> Logout
            </button>
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md col-span-1 md:col-span-3`}
        >
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Update Profile</h2>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleProfileUpdate}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="mt-2 w-full text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 p-2 bg-blue-500 text-white font-semibold rounded-md focus:outline-none hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  </div>
  </div>
  </div>
  </div>
  );
};

export default Profile;
