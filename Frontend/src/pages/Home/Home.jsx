import React, { useEffect, useState } from "react";
import { HeaderBar, Footer, Sidebar } from "../../components/molecules";
import Lottie from "lottie-react";
import { Animations } from "../../constants";
import AnimatedText from "animated-text-letters";
import "animated-text-letters/index.css";
import { useNavigate } from "react-router";

const Home = () => {
  const [headerAnimData, setHeaderAnimData] = useState(null);
  const [contactAnimData, setContactAnimData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const Navigation = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(JSON.parse(storedUserData));
      setUserType(parsedData.userType);
    }
  }, []);

  useEffect(() => {
    // Fetch both animation files
    Promise.all([
      fetch(Animations.headerAnim).then((response) => response.json()),
      fetch(Animations.contactAnim).then((response) => response.json()),
    ])
      .then(([headerData, contactData]) => {
        setHeaderAnimData(headerData);
        setContactAnimData(contactData);
      })
      .catch((error) => console.error("Failed to load animations:", error));
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
        <div className={`flex-1 mt-10 md:mt-0 ${userData ? "md:ml-60" : ""}`}>
          <title>PharmLanka - Home</title>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center bg-gray-100 px-10 py-10 md:justify-center gap-10 md:gap-20">
            <p className="text-center text-3xl lg:text-6xl font-bold">
              {headerAnimData && contactAnimData && (
                <AnimatedText
                  text="WE TAKE CARE OF YOUR HEALTH"
                  animation="pop-up"
                  delay={32}
                  easing="ease-in-out"
                  transitionOnlyDifferentLetters={true}
                  animationDuration={1000}
                />
              )}
            </p>
            {headerAnimData && contactAnimData ? (
              <Lottie
                animationData={headerAnimData}
                loop={true}
                className="w-64 md:w-80 lg:w-[500px]"
                style={{ background: "transparent" }}
              />
            ) : (
              <p></p>
            )}
          </div>
          {/* Contact Section */}

          {contactAnimData ? (
            <div className="flex flex-col-reverse md:flex-row mb-10 items-center justify-center px-10 py-10 gap-10 md:gap-40">
              <Lottie
                animationData={contactAnimData}
                loop={true}
                className="w-64 md:w-80 lg:w-[500px]"
                style={{ background: "transparent" }}
              />
              <button
                onClick={() => Navigation("/contact")}
                className="md:mr-10 mr-0 px-3 py-3 min-w-[400px] cursor-pointer hover:bg-blue-500 duration-300 hover:text-slate-200 text-xl font-semibold bg-blue-400 rounded-lg"
              >
                Contact Us
              </button>
            </div>
          ) : (
            <p></p>
          )}

          {/* Footer Section */}
          <div className="w-full absolute bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
