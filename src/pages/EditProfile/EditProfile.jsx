import React, { useEffect, useState } from "react";
import { Footer, HeaderBar, Sidebar } from "../../components/molecules";
import { PageTitle } from "../../components/atoms";
import FileUpload from "../../helpers/FileUpload";
import FileDelete from "../../helpers/FileDelete";
import { useBaseUrl } from "../../contexts/BaseUrl";
import axios from "axios";
import { useNavigate } from "react-router";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    email: "",
    birthday: "",
    name: "",
    telephone: "",
    image: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const UserId = storedUser ? JSON.parse(storedUser).id : null;
  const UserType = storedUser ? JSON.parse(storedUser).userType : null;
  const [profileImage, setProfileImage] = useState(null);
  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Token) {
      navigate("/login");
    } else {
      FetchUserData();
    }
  }, []);

  let sessionExpiredHandled = false;

  // Function to Fetch User Data
  const FetchUserData = async () => {
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  // Clear form
  const handleClear = () => {
    setUserData({
      email: "",
      birthday: "",
      name: "",
      telephone: "",
      image: "",
      address: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setProfileImage("");
  };

  const handleSave = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!confirmed) return;

    if (
      userData.currentPassword ||
      userData.newPassword ||
      userData.confirmPassword
    ) {
      if (
        !userData.currentPassword ||
        !userData.newPassword ||
        !userData.confirmPassword
      ) {
        alert("Please fill in all password fields.");
        return;
      }
      if (userData.newPassword !== userData.confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
      }
      await updateUserPassword();
      await updateUserData();
    } else {
      await updateUserData();
    }
  };

  // FUnction to update user basic data
  const updateUserData = async () => {
    try {
      if (profileImage) {
        // Step 1: Delete old image if it exists
        if (userData.image) {
          const oldFileName = userData.image.split("/").pop();
          try {
            await FileDelete(oldFileName, baseUrl);
            console.log("Old image deleted successfully.");
          } catch (error) {
            console.warn("Old image delete failed (continuing anyway).");
          }
        }

        // Step 2: Upload new image
        const uploadResponse = await FileUpload(profileImage, baseUrl);
        if (!uploadResponse) {
          alert("Image upload failed. Please try again.");
          return;
        }

        // Step 3: Update userData.image
        userData.image = `http://localhost:3300/uploads/${uploadResponse}`;
        console.log("Image uploaded successfully:", uploadResponse);
      }
      const response = await axios.put(
        `${baseUrl}/users/update/${UserId}`,
        userData,
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      );

      console.log("response", response.data);
      if (response.data.status) {
        alert("Profile updated successfully!");
        FetchUserData();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  // Function to Update User Password
  const updateUserPassword = async () => {
    const data = {
      currentPassword: userData.currentPassword,
      newPassword: userData.newPassword,
    };

    try {
      const response = await axios.put(
        `${baseUrl}/users/update/auth/${UserId}`,
        data,
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.status) {
        alert("Password updated successfully! Login again to continue.");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error.message);
      } else {
        alert("An error occurred while updating your password.");
      }
    }
  };

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
          className={`flex-1 overflow-auto mt-5 md:mt-10 ${
            userData ? "md:ml-60" : ""
          }`}
        >
          <title>PharmLanka - Edit Profile Details</title>
          <div className="px-8 py-6 mt-10 md:mt-5">
            <PageTitle title={"Edit Profile Details"} />
          </div>
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
            <div className="flex flex-col  bg-white shadow-lg rounded-lg p-6 space-y-6">
              {/* User Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">User Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-gray-500 text-sm">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/* Image */}
                  <div>
                    <label className="text-gray-500 text-sm">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                    />
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="text-gray-500 text-sm">Birthday</label>
                    <input
                      type="date"
                      name="birthday"
                      value={userData.birthday}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-gray-500 text-sm">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Telephone */}
                  <div>
                    <label className="text-gray-500 text-sm">
                      Telephone Number
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={userData.telephone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-gray-500 text-sm">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Authentication Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Authentication Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Password */}
                  <div>
                    <label className="text-gray-500 text-sm">
                      Current Password
                    </label>
                    <input
                      type="text"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="sm:visible hidden"></div>
                  {/*  New Password */}
                  <div>
                    <label className="text-gray-500 text-sm">
                      New Password
                    </label>
                    <input
                      type="text"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-gray-500 text-sm">
                      Confirm Password
                    </label>
                    <input
                      type="text"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 w-full">
                <button
                  onClick={handleClear}
                  className="bg-gray-300 w-full hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Clear
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 w-full hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-5 w-full absolute bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
