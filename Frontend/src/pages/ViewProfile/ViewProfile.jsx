import React, { useState, useEffect } from "react";
import { Footer, HeaderBar, Sidebar } from "../../components/molecules";
import { Images } from "../../constants";
import { PageTitle } from "../../components/atoms";
import { useBaseUrl } from "../../contexts/BaseUrl";
import axios from "axios";
import { useNavigate } from "react-router";

const ViewProfile = () => {
  const [userData, setUserData] = useState({
    email: "",
    birthday: "",
    name: "",
    telephone: "",
    image: "",
    address: "",
  });

  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const UserId = storedUser ? JSON.parse(storedUser).id : null;
  const UserType = storedUser ? JSON.parse(storedUser).userType : null;
  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (!Token) {
      navigate("/login");
    } else {
      FetchUser();
    }
  }, []);

  let sessionExpiredHandled = false; // move this outside FetchUser

  // Function to fetch user data
  const FetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/users/one/${UserId}`, {
        headers: {
          token: `Bearer ${Token}`,
        },
      });
      if (response.data.status) {
        setUserData(response.data.user);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.error.message ===
          "Your session has expired. Please log in again."
      ) {
        if (!sessionExpiredHandled) {
          sessionExpiredHandled = true;
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("userData");
          navigate("/login");
        }
      } else {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data.");
      }
    }
  };

  const links = [
    { title: "Search", path: "/search" },
    ...(UserType === "Admin" || UserType === "Moderator"
      ? [
          { title: "Stock", path: "/stock" },
          { title: "Users", path: "/users" },
        ]
      : []),
    {
      title: UserType === "Customer" ? "My Orders" : "Orders",
      path: "/orders",
    },
  ];

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading user data...</p>
      </div>
    );
  }

  console.log("userData asdf", userData);

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-100">
      {/* Header */}
      <HeaderBar />

      {/* Main Section */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {userData && (
          <div className="w-64 fixed hidden md:block h-full">
            <Sidebar links={links} />
          </div>
        )}

        {/* Profile Section */}
        <div
          className={`flex-1 overflow-auto relative mt-5 md:mt-10 ${
            userData ? "md:ml-60" : ""
          }`}
        >
          <title>PharmLanka - View Profile Details</title>
          <div className="px-8 py-6 mt-10 md:mt-5">
            <PageTitle title={"View Profile Details"} />
          </div>
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
            <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-6 space-y-6">
              {/* Profile Picture */}
              <div className="w-[130px] h-[130px] flex items-center justify-center rounded-full p-2 border-4 border-gray-300 overflow-hidden">
                <img
                  src={
                    userData.image != "" || userData.image != null
                      ? userData.image
                      : Images.unknownUser
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  style={{ maxWidth: "100%" }}
                />
              </div>

              {/* Profile Title */}
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                {userData.name}
              </h1>

              {/* Profile Details */}
              <div className="w-full max-w-lg bg-gray-50 rounded-lg p-4 shadow-sm space-y-4">
                {/* Email */}
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Email Address</span>
                  <span className="text-lg text-gray-900 font-medium">
                    {userData.email}
                  </span>
                </div>

                {/* Birthday */}
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Birthday</span>
                  <span className="text-lg text-gray-900 font-medium">
                    {userData.birthday}
                  </span>
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Address</span>
                  <span className="text-lg text-gray-900 font-medium">
                    {userData.address}
                  </span>
                </div>

                {/* Telephone */}
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Telephone</span>
                  <span className="text-lg text-gray-900 font-medium">
                    {userData.telephone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-5 w-full absolute bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
