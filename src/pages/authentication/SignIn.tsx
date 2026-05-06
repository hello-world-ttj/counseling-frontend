import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Logo from "../../images/schoolLogo.png";
import { login, sendOtp, verifyOtp } from "../../api/authApi"; // Add OTP APIs

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const [showforgotpassword, setshowforgotpassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response?.data?.token) {
        localStorage.setItem("423455ehgwhh", response.data.token);
        localStorage.setItem("hgyywgywgdydwgy", response.data.userType);

        navigate("/dashboard");
      } else {
        toast.error("Invalid login credentials");
      }
    } catch (err: any) {
      const msg =
        typeof err?.message === "string" && err.message.trim()
          ? err.message.trim()
          : "Unable to sign in. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
    setLoading(true);
    try {
      await sendOtp({ email });
      setOtpSent(true);
    } catch (error: any) {
      const msg =
        typeof error?.message === "string" && error.message.trim()
          ? error.message.trim()
          : "Unable to send OTP. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp || !newPassword) {
      toast.error("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email, otp, password: newPassword });

      setForgotPassword(false);
      setOtpSent(false);
    } catch (error: any) {
      const msg =
        typeof error?.message === "string" && error.message.trim()
          ? error.message.trim()
          : "Unable to reset password. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white h-screen">
      <div className="w-full xl:w-1/2 border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-lg">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <div className="mb-3.5 flex justify-center">
            <img
              className="dark:block"
              src={Logo}
              alt="Logo"
              width={80}
              height={80}
            />
          </div>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 flex justify-center">
            Login to ABLE
          </h2>

          {!forgotPassword ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-12 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-opacity-90"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white text-center mb-4">
                Reset Password
              </h3>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full rounded-lg bg-primary p-4 text-white hover:bg-opacity-90 transition"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none"
                    />
                  </div>
                  <div className="mb-4 relative">
                    <input
                      type={showforgotpassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setshowforgotpassword(!showforgotpassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                    >
                      {showforgotpassword ? (
                        <AiOutlineEyeInvisible size={22} />
                      ) : (
                        <AiOutlineEye size={22} />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full rounded-lg bg-primary p-4 text-white hover:bg-opacity-90 transition"
                  >
                    {loading ? "Verifying..." : "Reset Password"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
