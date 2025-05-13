import React, { useEffect } from "react";

import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);
  console.log(token);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        console.log(data);
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        navigate("/login");
      }
    });

  return <div>{children}</div>;
};

export default UserProtectedWrapper;
