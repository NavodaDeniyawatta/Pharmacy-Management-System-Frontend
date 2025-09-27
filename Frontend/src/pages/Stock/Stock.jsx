import React, { useState, useEffect } from "react";
import {
  DataTable,
  Footer,
  HeaderBar,
  Sidebar,
} from "../../components/molecules";
import { PageTitle, ManageStock } from "../../components/atoms";
import { Images } from "../../constants";
import { useBaseUrl } from "../../contexts/BaseUrl";
import FileUpload from "../../helpers/FileUpload";
import FileDelete from "../../helpers/FileDelete";
import axios from "axios";
import { useNavigate } from "react-router";

const Stock = () => {
  const [userData, setUserData] = useState(null);
  const [medicine, setMedicine] = useState({
    medicineCode: "",
    medicineName: "",
    minimumCount: "",
    currentCount: "",
    image: "",
    imageFile: null,
    buyPrice: "",
    salePrice: "",
    status: "",
  });
  const [medicineData, setMedicineData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [OpenCreateNewStockForm, setOpenCreateNewStockForm] = useState(false);
  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (!Token) {
      navigate("/login");
    } else {
      FetchMedicines();
    }
  }, []);

  let sessionExpiredHandled = false;

  // Function to fetch medicines
  const FetchMedicines = async () => {
    try {
      const response = await axios.get(`${baseUrl}/medicines/all`, {
        headers: {
          token: `Bearer ${Token}`,
        },
      });
      if (response.data.status && Array.isArray(response.data.medicines)) {
        const transformedMedicines = response.data.medicines.map(
          (medicine) => ({
            id: medicine._id,
            medicineCode: medicine.medicineCode,
            medicineName: medicine.medicineName,
            minimumCount: medicine.minimumCount,
            currentCount: medicine.currentCount,
            image: medicine.image,
            buyPrice: medicine.buyPrice,
            salePrice: medicine.salePrice,
            status: medicine.status,
          })
        );
        setMedicineData(transformedMedicines);
      } else {
        console.error("Invalid response structure:", response.data);
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
        alert("An error occurred while fetching stock data.");
      }
    }
  };

  // Function to create new medicine stock
  const CreateNewMedicine = async () => {
    const confirm = window.confirm(
      "Are you sure you want to create this new medicine stock?"
    );
    if (!confirm) return;

    if (medicine.imageFile) {
      const uploadResponse = await FileUpload(medicine.imageFile, baseUrl);
      if (!uploadResponse) {
        alert("Image upload failed. Please try again.");
        return;
      }
      medicine.image = `http://localhost:3300/uploads/${uploadResponse}`; // Assuming the response contains the image URL
    }

    try {
      const response = await axios.post(
        `${baseUrl}/medicines/create`,
        medicine,
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      );
      if (response.data.status) {
        alert("New medicine stock created successfully!");
        setOpenCreateNewStockForm(false);
        setMedicine({
          medicineCode: "",
          medicineName: "",
          minimumCount: "",
          currentCount: "",
          image: "",
          imageFile: null,
          buyPrice: "",
          salePrice: "",
          status: "",
        });
        FetchMedicines(); // Refresh the list after creation
      } else {
        alert("Failed to create new medicine stock. Please try again.");
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

  // FUnction to update medicine stock
  const UpdateMedicine = async () => {
    const confirm = window.confirm(
      "Are you sure you want to update this medicine stock?"
    );
    if (!confirm) return;

    if (editingRow.imageFile) {
      const oldImage = editingRow.image.split("/").pop();
      try {
        await FileDelete(oldImage, baseUrl);
        console.log("Old image deleted successfully.");
      } catch (error) {
        console.error("Error deleting old image:", error);
      }

      const uploadResponse = await FileUpload(editingRow.imageFile, baseUrl);
      if (!uploadResponse) {
        alert("Image upload failed. Please try again.");
        return;
      }
      editingRow.image = `http://localhost:3300/uploads/${uploadResponse}`; //
    }
    try {
      const response = await axios.put(
        `${baseUrl}/medicines/update/${editingRow.id}`,
        editingRow,
        {
          headers: {
            token: `Bearer ${Token}`,
          },
        }
      );
      if (response.data.status) {
        alert("Medicine stock updated successfully!");
        setOpenModal(false);
        setEditingRow(null);
        FetchMedicines(); // Refresh the list after update
      } else {
        alert("Failed to update medicine stock. Please try again.");
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
    const confirm = window.confirm(
      "Are you sure you want to delete this medicine stock?"
    );
    if (!confirm) return;
    const deleteMedicine = medicineData.find((med) => med.id === id);

    if (deleteMedicine.image) {
      const oldImage = deleteMedicine.image.split("/").pop();
      try {
        await FileDelete(oldImage, baseUrl);
        console.log("Old image deleted successfully.");
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }
    try {
      const response = await axios.delete(`${baseUrl}/medicines/delete/${id}`, {
        headers: {
          token: `Bearer ${Token}`,
        },
      });
      if (response.data.status) {
        alert("Medicine stock deleted successfully!");
        FetchMedicines(); // Refresh the list after deletion
      } else {
        alert("Failed to delete medicine stock. Please try again.");
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
        alert("An error occurred while deleteing data.");
      }
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
      field: "medicineCode",
      headerName: "Medicine Code",
    },
    {
      field: "medicineName",
      headerName: "Medicine Name",
      renderCell: (params) => (
        <div className="flex items-center">
          <img
            src={params.row.image ? params.row.image : Images.unknownMedicine}
            alt={params.row.medicineName}
            className="w-10 h-10 rounded-full mr-2"
          />
          {params.row.medicineName}
        </div>
      ),
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: true,
      resizable: true,
      headerClassName: "text-center",
      cellClassName: "text-center",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "minimumCount",
      headerName: "Minimum Items Count",
    },
    {
      field: "currentCount",
      headerName: "Current Items Count",
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
    },
    {
      field: "salePrice",
      headerName: "Sale Price",
    },
    {
      field: "status",
      headerName: "Current Status",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-100">
      <HeaderBar />
      <div className="flex flex-1 pt-16">
        {userData && (
          <div className="w-64 fixed  hidden md:block h-full">
            <Sidebar links={links} />
          </div>
        )}
        <div
          className={`flex-1 overflow-auto mt-5 md:mt-10 min-h-[600px] ${
            userData ? "md:ml-60" : ""
          }`}
        >
          <title>PharmLanka - Stock Managements</title>

          <div className="px-8 py-6 mt-10 md:mt-5 flex items-center justify-between ">
            <PageTitle title={"Stock Management"} />
            <button
              onClick={() => setOpenCreateNewStockForm(true)}
              className="px-4 py-2 bg-green-400 text-white cursor-pointer hover:bg-green-300 rounded-lg hover:text-black"
            >
              Create New Item
            </button>
          </div>

          <div className="px-5 ">
            <DataTable
              columns={columns}
              rows={medicineData}
              onEdit={HandleEdit}
              onDelete={HandleDelete}
            />
          </div>

          {OpenCreateNewStockForm ? (
            <div>
              <ManageStock
                isEdit={false}
                isOpen={OpenCreateNewStockForm}
                onClose={() => setOpenCreateNewStockForm(false)}
                onSave={CreateNewMedicine}
                setFormData={setMedicine}
                formData={medicine}
              />
            </div>
          ) : null}

          <div>
            <ManageStock
              isEdit={true}
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              onSave={UpdateMedicine}
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

export default Stock;
