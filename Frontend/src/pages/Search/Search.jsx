import React, { useState, useEffect } from "react";
import { Footer, HeaderBar, Sidebar } from "../../components/molecules";
import { Animations } from "../../constants";
import Lottie from "lottie-react";
import { PageTitle, CardPopup } from "../../components/atoms";
import { Images } from "../../constants";
import { useBaseUrl } from "../../contexts/BaseUrl";
import axios from "axios";
import { useNavigate } from "react-router";

const Search = () => {
  const [userData, setUserData] = useState(null);
  const [medicineData, setMedicineData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAnimation, setSearchAnimation] = useState(null);
  const [cart, setCart] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;
  const UserType = storedUser ? JSON.parse(storedUser).userType : null;
  const navigate = useNavigate();

  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (!Token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    SearchMedicine();
  }, [searchQuery]);

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

  // Function to get medicines by searching
  const SearchMedicine = async () => {
    if (searchQuery.trim() === "") {
      setMedicineData([]);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/medicines/search`, {
        headers: {
          token: `Bearer ${Token}`,
        },
        params: { name: searchQuery },
      });
      console.log("responce: ", response);
      if (response.data.status) {
        setMedicineData(response.data.medicines);
      } else {
        setMedicineData([]);
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
      setMedicineData([]);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) setUserData(JSON.parse(storedUserData));

    const storedCart = localStorage.getItem("cart");
    console.log("StoredCard:", storedCart);
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    fetch(Animations.searchAnim)
      .then((response) => response.json())
      .then((data) => setSearchAnimation(data))
      .catch((error) => console.error("Failed to load animation:", error));
  }, []);

  const handleAddToCart = (medicine) => {
    const exists = cart.find((item) => item._id === medicine._id);
    if (!exists) {
      const updatedCart = [...cart, { ...medicine, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handlePrescriptionUpload = (e) => {
    setPrescription(e.target.files[0]);
  };

  const HandelPayButton = () => {
    if (!prescription) {
      alert("Enter your prescription before click pay button!");
      return;
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-100">
      <HeaderBar />
      <div className="flex flex-1 pt-16">
        {userData && (
          <div className="w-64 fixed hidden md:block h-full">
            <Sidebar links={links} />
          </div>
        )}
        <div
          className={`flex-1 overflow-auto mt-5 md:mt-10 ${
            userData ? "md:ml-60" : ""
          }`}
        >
          <title>PharmLanka - Search Medicines</title>
          <div className="px-8 py-6 mt-10 md:mt-5">
            <PageTitle title={"Search Medicines"} />
          </div>

          <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 mb-20">
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 space-y-4">
              <input
                type="text"
                placeholder="Search for a medicine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-lg p-3 border border-gray-300 rounded-md focus:ring-blue-500"
              />

              <div className="w-full max-w-lg">
                <Lottie
                  animationData={searchAnimation}
                  loop
                  className="w-full"
                />
              </div>
            </div>

            {searchQuery && (
              <div className="bg-white shadow-md rounded-lg p-4 mt-6">
                {medicineData.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {medicineData.map((medicine) => (
                      <li key={medicine.id} className="py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                medicine.image
                                  ? medicine.image
                                  : Images.unknownMedicine
                              }
                              alt={medicine.medicineName}
                              className="w-16 h-16 rounded object-cover border"
                            />
                            <div>
                              <p className="text-lg font-semibold">
                                {medicine.medicineName}
                              </p>
                              <p className="text-sm text-gray-600">
                                $ {Number(medicine.salePrice).toFixed(2)}
                              </p>
                              <p
                                className={`text-sm ${
                                  medicine.status === "Available"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {medicine.status}
                              </p>
                              {medicine.status !== "Out of Stock" && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium text-gray-700">
                                    In stock:
                                  </span>{" "}
                                  {medicine.currentCount}
                                </p>
                              )}
                            </div>
                          </div>
                          {medicine.status === "Available" && (
                            <button
                              onClick={() => handleAddToCart(medicine)}
                              className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded hover:bg-blue-400"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center mt-4 text-red-500 text-lg">
                    No medicines found
                  </div>
                )}
              </div>
            )}

            {cart.length > 0 && (
              <div className="bg-white shadow-lg rounded-lg p-6 mt-10">
                <h2 className="text-xl font-bold mb-4">Cart</h2>
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li
                      key={item._id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.medicineName}</p>
                        <p className="text-sm text-gray-600">
                          Price: $ {Number(item.salePrice).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-sm">Qty:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const updatedCart = cart.map((med) =>
                                med._id === item._id
                                  ? {
                                      ...med,
                                      quantity: parseInt(e.target.value),
                                    }
                                  : med
                              );
                              setCart(updatedCart);
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(updatedCart)
                              );
                            }}
                            className="w-16 border px-2 py-1 rounded"
                          />
                        </div>
                        <p className="text-sm mt-1">
                          Net: ${" "}
                          {(
                            Number(item.quantity) * Number(item.salePrice)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const updatedCart = cart.filter(
                            (med) => med._id !== item._id
                          );
                          setCart(updatedCart);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart)
                          );
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right font-semibold text-lg">
                  Total: ${" "}
                  {cart
                    .reduce(
                      (total, item) =>
                        Number(total) +
                        Number(item.salePrice) * Number(item.quantity),
                      0
                    )
                    .toFixed(2)}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Prescription
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePrescriptionUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0 file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {prescription && (
                    <p className="mt-2 text-green-600 text-sm">
                      Selected: {prescription.name}
                    </p>
                  )}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setCart([]);
                      localStorage.removeItem("cart");
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-400 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={HandelPayButton}
                    className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-400 hover:text-black"
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </div>

          {showPayment ? (
            <CardPopup
              amount={cart.reduce(
                (total, item) => total + item.salePrice * item.quantity,
                0
              )}
              onClose={() => {
                setShowPayment(false);
                setCart([]);
                localStorage.removeItem("cart");
                setPrescription(null);
              }}
              cart={cart}
              pdf={prescription}
            />
          ) : null}

          <div className="w-full absolute bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
