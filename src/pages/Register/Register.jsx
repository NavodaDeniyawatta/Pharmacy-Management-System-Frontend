import React, { useEffect, useState } from "react";
import { Footer, HeaderBar } from "../../components/molecules";
import { useBaseUrl } from "../../contexts/BaseUrl";
import { useNavigate } from "react-router";
import axios from "axios";

const Register = () => {
  const savedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
  const Token = savedUserData.accessToken;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    telephone: "",
    birthday: "",
    address: "",
    password: "",
  });
  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (Token) {
      navigate("/");
    }
  }, []);

  const RegisterUser = async () => {
    if (
      !userData.address ||
      !userData.birthday ||
      !userData.email ||
      !userData.name ||
      !userData.password ||
      !userData.telephone
    ) {
      alert("Fill all user details fields!");
      return;
    }

    const confirmRegister = window.confirm("Are you sure to continue?");
    if (!confirmRegister) return;

    const data = {
      name: userData.name,
      email: userData.email,
      birthday: userData.birthday,
      address: userData.address,
      telephone: userData.telephone,
      userType: "NewUser",
      password: userData.password,
    };

    await axios
      .post(`${baseUrl}/users/register`, data)
      .then((response) => {
        if (!response.data.status) {
          const errorMessage =
            response.data?.error?.message || "Registration failed.";
          alert(errorMessage);
        } else {
          alert(response.data.success.message);
          navigate("/login");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error?.message ||
          "Something went wrong. Please try again.";
        alert(errorMessage);
      });
  };

  return (
    <div className="flex flex-col">
      <HeaderBar />
      {/* Registration Section */}
      <div className=" w-full flex items-center min-h-[100vh] mt-25 justify-center px-10 py-10">
        <div className="flex flex-col px-8 py-5 items-center min-h-[350px] w-full lg:w-1/3 h-full bg-slate-300 rounded-lg shadow-lg">
          <span className="text-xl lg:text-2xl font-semibold text-center mb-6">
            Register to The System
          </span>

          {/* Name */}
          <div className="w-full flex flex-col">
            <label className="text-lg font-semibold mb-2">Name:</label>
            <input
              type="text"
              className="bg-white w-full px-4 py-3 rounded-lg"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Enter Name"
            />
          </div>

          {/* Email */}
          <div className="w-full flex flex-col mt-4">
            <label className="text-lg font-semibold mb-2">Email Address:</label>
            <input
              type="email"
              className="bg-white w-full px-4 py-3 rounded-lg"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Enter Email Address"
            />
          </div>

          {/* Birthday */}
          <div className="w-full flex flex-col mt-4">
            <label className="text-lg font-semibold mb-2">Birthday:</label>
            <input
              type="date"
              value={userData.birthday}
              onChange={(e) =>
                setUserData({ ...userData, birthday: e.target.value })
              }
              className="bg-white w-full px-4 py-3 rounded-lg"
            />
          </div>

          {/* Address */}
          <div className="w-full flex flex-col mt-4">
            <label className="text-lg font-semibold mb-2">Address:</label>
            <input
              type="address"
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              className="bg-white w-full px-4 py-3 rounded-lg"
              placeholder="Enter Address"
            />
          </div>

          {/* Phone Number */}
          <div className="w-full flex flex-col mt-4">
            <label className="text-lg font-semibold mb-2">Phone Number:</label>
            <input
              type="tel"
              value={userData.telephone}
              onChange={(e) =>
                setUserData({ ...userData, telephone: e.target.value })
              }
              className="bg-white w-full px-4 py-3 rounded-lg"
              placeholder="Enter Phone Number"
            />
          </div>

          {/* Password */}
          <div className="w-full flex flex-col mt-4">
            <label className="text-lg font-semibold mb-2">Password:</label>
            <input
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="bg-white w-full px-4 py-3 rounded-lg"
              placeholder="Enter Password"
            />
          </div>

          {/* Register Button */}
          <button
            onClick={RegisterUser}
            className="px-4 py-3 w-full mt-6 rounded-lg cursor-pointer text-lg font-semibold bg-blue-500 hover:bg-blue-400 duration-300"
          >
            Register
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Register;
