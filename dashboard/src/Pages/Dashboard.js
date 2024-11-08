"use client";
import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faBell, faUser, faHome, faUsers } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../Store/slices/authSlices"; // Import the logout action




function Dashboard() {

  const [darkMode, setDarkMode] = React.useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchFriends = async () => {
      if (!user || !user.friends || user.friends.length === 0) {
        setLoading(false); // No friends, exit
        return;
      }

      try {
        // Fetch each friend's data
        const friendsData = await Promise.all(
          user.friends.map((friendId) =>
            axios.get(`http://localhost:5000/api/auth/users/${friendId}`)
          )
        );

        // Store the friends data in state
        setFriends(friendsData.map((response) => response.data));
      } catch (error) {
        setError("Failed to load friends");
      } finally {
        setLoading(false);
      }
    };

    // Fetch friends if user is available
    if (user) {
      fetchFriends();
    }
  }, [user]);
 
  const activities = user ? user.activities : [];

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
             
              {user.profilePicture ? (
                      <img
                        src={`http://localhost:5000/${user.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} size="2x" className="text-gray-500" />
                    )}
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
                onClick={() => navigate("/profile")}
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
            <h2 className="text-xl font-semibold mb-6">Activity Feed</h2>
            <div className="space-y-4">
            {activities.length === 0 ? (
            <p>No activities found</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity._id}
                className={`p-4 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                  </div>
                </div>
              )))}
            </div>

            <h2 className="text-xl font-semibold mb-6 mt-8">Friends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.length === 0 ? (
            <p>No friends found</p>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className={`p-4 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {friend.profilePicture ? (
                      <img
                        src={`http://localhost:5000/${friend.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} size="2x" className="text-gray-500" />
                    )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-gray-500">
                        {friend.status === "online" ? "Online" : "Offline"}
                      </p>
                      </div>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;