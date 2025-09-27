import React, { useState, useEffect } from "react";
import { HeaderBar, Footer, Sidebar } from "../../components/molecules";

const About = () => {
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(JSON.parse(storedUserData));
      setUserType(parsedData.userType);
    }
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
          <div className="w-64 fixed  hidden md:block h-full">
            <Sidebar links={links} />
          </div>
        )}
        <div className={`flex-1 min-h-[600px] ${userData ? "md:ml-60" : ""}`}>
          <title>PharmLanka - About</title>

          {/* About Section */}
          <div className="w-full flex mt-15 items-center justify-center px-10 py-10">
            <div className="flex flex-col relative px-8 py-5 items-center lg:min-h-[33vh] w-full lg:w-2/3 h-full bg-slate-300 rounded-lg shadow-lg">
              <span className="text-xl lg:text-3xl font-bold text-center text-green-800 mb-4">
                About PharmLanka
              </span>
              <p className="text-center text-gray-700 leading-relaxed">
                Welcome to <strong>PharmLanka</strong>, your trusted partner in
                health and wellness. Our mission is to provide high-quality
                pharmaceutical products and services, ensuring the well-being of
                our customers through expert care and advice.
                <br />
                <br />
                Established with a commitment to excellence, we pride ourselves
                on our customer-centric approach, ensuring that every individual
                receives personalized attention and care. Our team of
                experienced pharmacists is dedicated to guiding you on your
                health journey, offering professional advice and support.
                <br />
                <br />
                At PharmLanka, we believe that health is a right, not a
                privilege. We continuously strive to make healthcare accessible
                and affordable to everyone. Thank you for choosing us as your
                healthcare partner.
              </p>
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

export default About;
