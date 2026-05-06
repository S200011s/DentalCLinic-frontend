import React, { useState } from "react";
import "../Shared.css";
import "boxicons/css/boxicons.min.css";
import ButtonSubmit from "../../../components/Buttons/ButtonSubmit";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = "Email must be valid (e.g. user@example.com)";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("login successfully");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      toast.error("login failed");
      const data = err.response?.data;
      const msg = data?.message || "Login failed";
      setServerError(msg);

      if (Array.isArray(data?.errors)) {
        const fieldErrors = {};
        data.errors.forEach((msg) => {
          const lower = msg.toLowerCase();
          if (lower.includes("email")) {
            fieldErrors.email = msg;
          } else if (lower.includes("password")) {
            fieldErrors.password = msg;
          }
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="_mainContainer">
      <div className="_Container">
        <ToastContainer position="top-right" autoClose={2000} />

        <div className="_image">
          <div className="_Ima">
            <img src="/src/assets/images/c2.webp" alt="teeth image" />
          </div>
          <div className="_Title">
            <h3>Welcome Back</h3>
            <p>
              <span>"</span>&nbsp;Your smile journey continues here — login to
              your account for personalized care.&nbsp;<span>"</span>
            </p>
          </div>
        </div>
        <div className="_FormContainer">
          <form className="_Form" onSubmit={handleSubmit}>
            <div className="_Title">Sign In</div>
            <div className="_field _emailField">
              <div className="_inputField">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`_Email ${formErrors.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {formErrors.email && (
                <span className="_error password-error">
                  <i
                    className={`bx bx-error-circle error-icon ${
                      formErrors.email ? "error-iconBlur" : ""
                    }`}
                  ></i>
                  <p className="error-text">{formErrors.email}</p>
                </span>
              )}
            </div>

            <div className="_field create-password">
              <div className="_inputField" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`_Password ${
                    formErrors.password ? "input-error" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingRight: "40px" }}
                />
                <i
                  className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#707070",
                    zIndex: 10,
                  }}
                ></i>
              </div>
              {formErrors.password && (
                <span className="_error password-error">
                  <i
                    className={`bx bx-error-circle error-icon ${
                      formErrors.password ? "error-iconBlur" : ""
                    }`}
                  ></i>
                  <p className="error-text">{formErrors.password}</p>
                </span>
              )}
            </div>

            {serverError && (
              <span className="_error password-error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{serverError}</p>
              </span>
            )}

            <div className="_inputField _button">
              <ButtonSubmit name={"Sign In"} />
            </div>

            <div className="_Link">
              <Link to="/forgetpassword">Forget Password?</Link>
              <Link to="/register">Create an Account</Link>
            </div>

            <div className="_footerCopyRight">
              <div className="_text">
                Copyright &copy; 2025 Generic White Teeth
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
