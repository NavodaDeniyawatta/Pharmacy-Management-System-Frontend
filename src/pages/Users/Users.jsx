import React, { useState, useEffect } from "react";
import {
  DataTable,
  Footer,
  HeaderBar,
  Sidebar,
} from "../../components/molecules";
import { PageTitle, ManageUser } from "../../components/atoms";
import { useBaseUrl } from "../../contexts/BaseUrl";
import FileDelete from "../../helpers/FileDelete";
import axios from "axios";
import { useNavigate } from "react-router";

const Users = () => {
  const [userData, setUserData] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateNewUserForm, setOpenCreateNewUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    birthday: "",
    address: "",
    telephone: "",
    userType: "New User", // optional default
  });
  const [users, setUsers] = useState([]);

  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const UserId = storedUser ? JSON.parse(storedUser).id : null;
  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (!Token) {
      navigate("/login");
    } else {
      FetchUsers();
    }
  }, []);

  let sessionExpiredHandled = false;

  // Function to get all users
  const FetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/users/all/${UserId}`, {
        headers: {
          token: `Bearer ${Token}`,
        },
      });
      if (response.data.status && Array.isArray(response.data.users)) {
        const transformedUsers = response.data.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          telephone: user.telephone,
          birthday: user.birthday,
          userType: user.userType,
          address: user.address,
        }));

        setUsers(transformedUsers);
      } else {
        alert(response.data.error.message || "Failed to fetch users.");
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
        alert("An error occurred while updating data.");
      }
    }
  };

  const HandleEdit = (row) => {
    setEditingRow(row);
    setOpenModal(true);
  };

  const HandleDelete = async (id) => {
    const deleteUser = users.find((user) => user.id === id);

    const windowConfirm = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (windowConfirm) {
      if (deleteUser.image) {
        // If the user has an image, delete it first
        await FileDelete(deleteUser.image.split("/").pop(), baseUrl);
      }
      await axios
        .delete(`${baseUrl}/users/delete/${id}`, {
          headers: {
            token: `Bearer ${Token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            alert("User deleted successfully!");
            FetchUsers();
          } else {
            alert("Failed to delete user.");
          }
        })
        .catch((error) => {
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
            alert("An error occurred while updating data.");
          }
        });
    }
  };

  const links = [
    { title: "Search", path: "/search" },
    { title: "Stock", path: "/stock" },
    { title: "Users", path: "/users" },
    { title: "Orders", path: "/orders" },
  ];

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "email",
      headerName: "Email Address",
    },
    {
      field: "birthday",
      headerName: "Birthday",
    },
    {
      field: "address",
      headerName: "Address",
    },
    {
      field: "telephone",
      headerName: "Phone Number",
    },
    {
      field: "userType",
      headerName: "User Type",
    },
  ];

  // FUnction to create new user
  const HandleCreateNewUser = async () => {
    const { name, email, birthday, address, telephone, userType } = newUserData;

    if (!name || !email || !birthday || !address || !telephone) {
      alert("Please fill in all fields.");
      return;
    }

    await axios
      .post(
        `${baseUrl}/users/register`,
        {
          name,
          email,
          birthday,
          address,
          image: "",
          telephone,
          userType,
          password: "123456",
        },
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          alert("User created successfully!");
          setOpenCreateNewUserForm(false);
          FetchUsers();
        } else {
          alert("Failed to create user.");
        }
      })
      .catch((error) => {
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
          alert("An error occurred while updating data.");
        }
      });
  };

  // Function to handel update user data
  const UpdateUser = async () => {
    const { name, email, birthday, address, telephone, userType } = editingRow;

    if (!name || !email || !birthday || !address || !telephone) {
      alert("Please fill in all fields.");
      return;
    }

    await axios
      .put(
        `${baseUrl}/users/update/${editingRow.id}`,
        {
          name,
          email,
          birthday,
          address,
          telephone,
          userType,
        },
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          alert("User updated successfully!");
          setOpenModal(false);
          FetchUsers();
        } else {
          alert("Failed to update user.");
        }
      })
      .catch((error) => {
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
          alert("An error occurred while updating data.");
        }
      });
  };

  return (
    <div className="flex flex-col relative min-h-screen bg-gray-100">
      <HeaderBar />
      <div className="flex flex-1 pt-16">
        {userData && (
          <div className="w-64 fixed hidden md:block h-full">
            <Sidebar links={links} />
          </div>
        )}
        <div
          className={`flex-1 overflow-auto mt-5 md:mt-10 min-h-[600px] ${
            userData ? "md:ml-60" : ""
          }`}
        >
          <title>PharmLanka - Users Managements</title>

          <div className="px-8 py-6 mt-10 md:mt-5 flex items-center justify-between">
            <PageTitle title={"Users Management"} />
            <buttonon
              onClick={() => setOpenCreateNewUserForm(true)}
              className="px-4 py-2 bg-green-400 text-white cursor-pointer hover:bg-green-300 rounded-lg hover:text-black"
            >
              Create New User
            </buttonon>
          </div>

          <div className="px-5">
            <DataTable
              columns={columns}
              rows={users}
              onEdit={HandleEdit}
              onDelete={HandleDelete}
            />
          </div>

          {openCreateNewUserForm ? (
            <div>
              <ManageUser
                isEdit={false}
                isOpen={openCreateNewUserForm}
                onClose={() => setOpenCreateNewUserForm(false)}
                onSave={() => {
                  // You can add save logic here
                  HandleCreateNewUser();
                }}
                setFormData={setNewUserData}
                formData={newUserData}
              />
            </div>
          ) : null}

          <div>
            <ManageUser
              isEdit={true}
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              onSave={() => {
                // You can add save logic here
                UpdateUser();
              }}
              formData={editingRow}
              setFormData={setEditingRow}
            />
          </div>

          {/* Footer section */}
          <div className="mt-5 w-full absolute bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
