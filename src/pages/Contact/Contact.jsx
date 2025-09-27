import React, { useState, useEffect } from "react";
import { HeaderBar, Footer, Sidebar } from "../../components/molecules";
import { Map } from "../../components/atoms";

const Contact = () => {
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null); // holds lat/lng
  const [userType, setUserType] = useState("");

  useEffect(() => {
    // Get user data
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(JSON.parse(storedUserData));
      setUserType(parsedData.userType);
    }

    // Simulate fetching or computing lat/lng
    const fetchLocation = () => {
      // You can fetch from API or compute here
      const lat = 6.9271;
      const lng = 79.8612;
      setLocation({ lat, lng });
    };

    fetchLocation();
  }, []);

  const links = [
    { title: "Search", path: "/search" },
    ...(userType === "Admin" || userType === "Moderator"
      ? [
          { title: "Stock", path: "/stock" },
          { title: "Users", path: "/users" },
        ]
      : []),
    {
      title: userType === "Customer" ? "My Orders" : "Orders",
      path: "/orders",
    },
  ];

  return (
    <div className="flex flex-col relative min-h-screen">
      <HeaderBar />
      <div className="flex flex-1 pt-16">
        {userData && (
          <div className="w-64 hidden md:block fixed h-full">
            <Sidebar links={links} />
          </div>
        )}
        <div className={`flex-1 min-h-[600px] ${userData ? "md:ml-60" : ""}`}>
          <title>PharmLanka - Contact</title>

          {/* Contact Section */}
          <div className="w-full flex items-center mt-15 justify-center px-10 py-10">
            <div className="flex flex-col relative px-8 py-5 items-center min-h-auto w-full lg:w-2/3 h-full bg-slate-300 rounded-lg shadow-lg">
              <span className="text-xl lg:text-3xl font-bold text-center text-green-800 mb-4">
                Contact PharmLanka
              </span>
              <p className="text-center text-gray-700 mb-4">
                Email:{" "}
                <a
                  href="mailto:info@pharmlanka.com"
                  className="text-blue-600 hover:underline"
                >
                  pharmlanka2000@gmail.com
                </a>
              </p>
              <p className="text-center text-gray-700 mb-4">
                Contact Number:{" "}
                <a
                  href="tel:+94112345678"
                  className="text-blue-600 hover:underline"
                >
                  +94 11 234 5678
                </a>
              </p>
              <p className="text-center text-gray-700 mb-4">
                Address: 123 Wellness Avenue, Colombo, Sri Lanka
              </p>
              <div className="w-full h-[250px]">
                {location ? (
                  <Map lat={location.lat} lng={location.lng} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span>Loading map...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Footer Section */}
          <div className="w-full absolute bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
