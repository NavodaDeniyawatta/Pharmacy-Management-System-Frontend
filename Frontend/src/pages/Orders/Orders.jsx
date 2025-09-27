import React, { useState, useEffect } from "react";
import {
  Footer,
  HeaderBar,
  Sidebar,
  DataTable,
} from "../../components/molecules";
import { PageTitle, EditOrder } from "../../components/atoms";
import { useBaseUrl } from "../../contexts/BaseUrl";
import axios from "axios";
import { useNavigate } from "react-router";
import FileDelete from "../../helpers/FileDelete";

const Orders = () => {
  const [userData, setUserData] = useState(null);
  const [isOpenUploadPrescriptionForm, setIsOpenUploadPrescriptionForm] =
    useState(false);

  const [orders, setOrders] = useState([]); // State to hold orders data
  let sessionExpiredHandled = false; // To handle session expiration only once

  const [editingRow, setEditingRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [medicines, setMedicines] = useState([]); // State to hold medicines data
  const [users, setUsers] = useState([]); // State to hold users data

  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const UserType = storedUser ? JSON.parse(storedUser).userType : null;
  const UserId = storedUser ? JSON.parse(storedUser).id : null;

  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (!Token) {
      navigate("/login");
    } else {
      LoadAllData();
    }
  }, []);

  const LoadAllData = async () => {
    try {
      // Fetch medicines
      const medRes = await axios.get(`${baseUrl}/medicines/all`, {
        headers: { token: `Bearer ${Token}` },
      });
      const meds = medRes.data?.medicines || [];
      setMedicines(meds);

      let userList = [];

      // Fetch users
      if (UserType !== "Customer") {
        const userRes = await axios.get(`${baseUrl}/users/all`, {
          headers: { token: `Bearer ${Token}` },
        });
        userList = userRes.data?.users || [];
        setUsers(userList);
      }

      const url =
        UserType === "Customer"
          ? `${baseUrl}/order/all/${UserId}`
          : `${baseUrl}/order/all`;

      // Now safely fetch orders
      const orderRes = await axios.get(url, {
        headers: { token: `Bearer ${Token}` },
      });

      const transformedOrders = orderRes.data.orders.map((order) => {
        const user = userList.find(
          (u) => u._id?.toString?.() === order.userId?.toString?.()
        );

        const itemDescriptions = (order.items || []).map((item) => {
          const med = meds.find(
            (m) => m._id?.toString?.() === item.itemId?.toString?.()
          );
          return med
            ? `${med.medicineName} (x${item.count}) - Rs. ${med.salePrice}`
            : `Item ${item.itemId}`;
        });

        return {
          id: order._id,
          orderId: order.orderId,
          userName: user ? user.name : "Unknown User",
          address: user ? user.address : "",
          telephone: user ? user.telephone : "",
          items: order.items,
          total: `$ ${order.total}`,
          itemsData: itemDescriptions.join(", "),
          paymentStatus: order.paymentStatus,
          deliveryStatus: order.deliveryStatus,
          pdf: order.pdf,
          dateCreated: `${order.dateCreated} - ${order.timeCreated}`,
        };
      });

      setOrders(transformedOrders);
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
      }
    }
  };

  const HandleEdit = (row) => {
    setEditingRow(row);
    setOpenModal(true);
    console.log("Row: ", row);
  };

  // Function to update order status
  const UpdateOrderStatus = async () => {
    const windowConfirm = window.confirm(
      "Are you sure you want to update this data?"
    );

    if (!windowConfirm || !editingRow) return;

    const payload = {
      id: editingRow.id,
      deliveryStatus: editingRow.deliveryStatus,
    };

    try {
      const responce = await axios.put(`${baseUrl}/order/update`, payload, {
        headers: {
          token: `Bearer ${Token}`,
        },
      });
      if (responce.data.status) {
        alert(`Order ${editingRow.deliveryStatus} Successfully!`);
        LoadAllData();
        setOpenModal(false);
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
        alert(error.response.data.error.message);
      }
    }
  };

  const HandleDelete = async (id) => {
    const deleteOrder = orders.find((order) => order.id === id);
    const windowConfirm = window.confirm(
      "Are you sure you want to delete this data?"
    );

    if (!windowConfirm) return;

    try {
      if (deleteOrder?.pdf) {
        const fileName = deleteOrder.pdf.split("/").pop(); // Extract file name
        await FileDelete(fileName, baseUrl);
      }

      // Delete the order from backend
      const response = await axios.delete(`${baseUrl}/order/delete/${id}`, {
        headers: {
          token: `Bearer ${Token}`,
        },
      });

      if (response.data.status) {
        alert("Order deleted successfully!");
        LoadAllData();
      } else {
        alert("Failed to delete order.");
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
        console.error("Delete error:", error);
        alert("An error occurred while deleting the order.");
      }
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

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

  const isCustomer = UserType === "Customer";

  const columns = [
    { field: "orderId", headerName: "Order Id" },
    ...(!isCustomer
      ? [
          { field: "userName", headerName: "User Name" },
          { field: "address", headerName: "Address" },
          { field: "telephone", headerName: "Telephone" },
        ]
      : []),
    {
      field: "pdf",
      headerName: "Prescription",
      renderCell: (params) => {
        const pdfUrl = params.row?.pdf;

        if (!pdfUrl) {
          return <span className="text-red-500">No PDF</span>;
        }

        return (
          <button
            onClick={() => window.open(pdfUrl, "_blank")}
            className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
          >
            View PDF
          </button>
        );
      },
    },

    {
      field: "itemsData",
      headerName: "Order Items",
      renderCell: (params) => {
        const itemsArray = params.row.itemsData?.split(", ") || [];

        return (
          <ul className="list-disc pl-4">
            {itemsArray.map((item, idx) => (
              <li key={idx} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        );
      },
    },

    { field: "total", headerName: "Total" },
    { field: "paymentStatus", headerName: "Payment Status" },
    { field: "deliveryStatus", headerName: "Delivery Status" },
    { field: "dateCreated", headerName: "Created Date" },
  ];

  return (
    <div className="flex flex-col relative min-h-screen bg-gray-100">
      {" "}
      <HeaderBar />{" "}
      <div className="flex flex-1 pt-16">
        {userData && (
          <div className="w-64 fixed hidden md:block h-full">
            <Sidebar links={links} />
          </div>
        )}{" "}
        <div
          className={`flex-1 overflow-auto mt-5 md:mt-10 min-h-[600px] ${
            userData ? "md:ml-60" : ""
          }`}
        >
          <title>PharmLanka - Orders Managements</title>
          <div className="px-8 py-6 mt-10 md:mt-5 flex items-center justify-between">
            <PageTitle title={"Orders managements"} />
          </div>

          {isOpenUploadPrescriptionForm && (
            <div className="fixed inset-0 bg-black/15 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4">
                  Upload Prescription
                </h2>
                <input
                  type="file"
                  className="mb-4 px-4 py-3 bg-gray-200 w-full rounded-lg"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsOpenUploadPrescriptionForm(false)}
                    className="px-4 py-2 bg-red-300 rounded text-white hover:bg-red-400 hover:text-black transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Add upload logic here
                      setIsOpenUploadPrescriptionForm(false);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 hover:text-black transition-all"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="px-5 max-h-[150px]">
            <DataTable
              columns={columns}
              rows={orders}
              onEdit={HandleEdit}
              onDelete={HandleDelete}
            />
          </div>

          <div>
            <EditOrder
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              onSave={() => {
                UpdateOrderStatus();
              }}
              formData={editingRow}
              setFormData={setEditingRow}
            />
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="w-full absolute bottom-0 left-0">
        <Footer />
      </div>
    </div>
  );
};

export default Orders;
