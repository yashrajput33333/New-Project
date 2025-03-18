import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Logo({ width = "100px" }) {
  const authStatus = useSelector((state) => state.auth.status);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user", { withCredentials: true });
        if (response.data.success) {
          setAvatar(response.data.data.avatar); // ✅ Set user avatar
        }
      } catch (error) {
        console.error("Failed to fetch user avatar", error);
      }
    };

    if (authStatus) {
      fetchUserAvatar();
    }
  }, [authStatus]);

  return (
    <div className="flex items-center">
      {authStatus && avatar ? (
        <img
          src={avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-lg object-cover"
          style={{ width, height: width }}
        />
      ) : (
        <h1 className="text-xl font-bold text-gray-800"></h1> // Default Logo Text
      )}
    </div>
  );
}

export default Logo;
