import React, { useEffect, useState } from "react";

import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const [isLoading, setIsLoading ] = React.useState(true);
  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }
  }, [token]);

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        setIsLoading(false);
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/captain-login");
      }
      else{
        navigate("/captain-login");
      }
    });

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return <div>{children}</div>;
};

export default CaptainProtectedWrapper;
