import React, { useState, useRef, useEffect } from "react";
import { Footer, HeaderBar } from "../../components/molecules";
import { useNavigate } from "react-router";
import { EmailValidation } from "../../helpers";
import axios from "axios";
import { useBaseUrl } from "../../contexts/BaseUrl";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    try {
      return storedUser ? JSON.parse(storedUser).email || "" : "";
    } catch {
      return "";
    }
  });

  const storedUser = localStorage.getItem("userData");
  const Token = storedUser ? JSON.parse(storedUser).accessToken : null;

  useEffect(() => {
    if (Token) {
      navigate("/");
    }
  }, [Token, navigate]);

  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isChecking, setIsChecking] = useState(false);
  const { baseUrl } = useBaseUrl();
  const [userData, setUserData] = useState({
    id: "",
    accessToken: "",
    name: "",
    userType: "",
    email: "",
    image: "",
  });
  const inputsRef = useRef([]);

  // Handle login button click
  const HandleLoginButton = () => {
    if (!email) {
      alert(
        "Please enter your email address before clicking the Login button!"
      );
      return;
    }
    if (!password) {
      alert("Please enter your password before clicking the Login button!");
      return;
    }
    const ValidEmail = EmailValidation(email);
    if (!ValidEmail) {
      alert("Enter valid email address!");
      return;
    }
    Login();
  };

  // ---------- Handle Login button ----------
  const Login = async () => {
    const data = {
      email: email,
      password: password,
    };

    await axios
      .post(`${baseUrl}/users/login`, data)
      .then((response) => {
        if (!response.data.status) {
          const errorMessage = response.data?.error?.message || "Login failed.";
          alert(errorMessage);
        } else {
          const newUser = {
            id: response.data.id,
            accessToken: response.data.accessToken,
            name: response.data.name,
            userType: response.data.userType,
            image: response.data.image ? response.data.image : "",
            email: email,
          };
          console.log("newUser", newUser);
          setUserData(newUser);
          setShowOTP(true);
          GetOTPCode();
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error?.message ||
          "Something went wrong. Please try again.";
        alert(errorMessage);
      });
  };

  console.log(userData);

  // --------- Get OTP code ---------
  const GetOTPCode = async () => {
    const data = {
      email: email,
    };

    await axios
      .post(`${baseUrl}/otp/create`, data)
      .then((response) => {
        if (!response.data.status) {
          const errorMessage =
            response.data?.error?.message || "Something went wrong.";
          alert(errorMessage);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error?.message ||
          "Something went wrong. Please try again.";
        alert(errorMessage);
      });
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if current input is filled
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }

    // Auto check after last digit
    if (index === 3 && value) {
      setIsChecking(true);
      setTimeout(() => {
        checkOtp(newOtp.join(""));
        setIsChecking(false);
      }, 1000);
    }
  };

  // Check OTP after last digit
  const checkOtp = (enteredOtp) => {
    const data = {
      email: email,
      otp: enteredOtp,
    };

    axios
      .post(`${baseUrl}/otp/validate`, data)
      .then((res) => {
        if (res.data.status) {
          alert("✅ OTP is correct! Login successful!");

          // Save the user data as JSON in localStorage
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/");
        } else {
          alert("❌ Invalid OTP. Please try again.");
          setOtp(["", "", "", ""]);
          inputsRef.current[0].focus();
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.error?.message ||
          "Something went wrong. Please try again.";
        alert(errorMessage);
        setOtp(["", "", "", ""]);
        inputsRef.current[0].focus();
      });
  };

  return (
    <div>
      <title>PharmLanka - Login</title>
      <HeaderBar />
      {/* Login Section */}
      <div className="w-full h-full min-h-[100vh] flex items-center justify-center px-10 py-10">
        <div className="flex flex-col relative px-8 py-5 items-center min-h-[350px] w-full lg:w-1/3 h-full bg-slate-300 rounded-lg shadow-lg">
          <span className="text-xl lg:text-2xl font-semibold text-center">
            Login to The System
          </span>
          {!showOTP && (
            <div className="absolute top-15 flex items-center justify-center space-x-2">
              <span className="text-[17px] font-semibold cursor-default">
                Don't have an account?
              </span>
              <button
                onClick={() => navigate("/register")}
                className="text-[17px] font-semibold cursor-pointer text-green-700"
              >
                Register
              </button>
            </div>
          )}

          {/* Email & Password Inputs */}
          {!showOTP && (
            <>
              <input
                className="bg-white w-full px-4 py-3 rounded-lg mt-15"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                required
              />
              <input
                type="password"
                className="bg-white w-full px-4 py-3 rounded-lg mt-5"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                onClick={HandleLoginButton}
                className="px-4 py-3 w-full mt-10 rounded-lg cursor-pointer text-lg font font-semibold bg-blue-500 hover:bg-blue-400 duration-300"
              >
                Login
              </button>
            </>
          )}

          {/* OTP Validation Section */}
          {showOTP && (
            <>
              <span className="text-lg font-semibold text-center mt-5">
                Enter OTP Code
              </span>
              <div className="flex justify-center items-center space-x-3 mt-5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>

              {/* Loading Indicator */}
              {isChecking && (
                <span className="text-blue-500 mt-3 text-lg">Checking...</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="fixed left-0 bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
