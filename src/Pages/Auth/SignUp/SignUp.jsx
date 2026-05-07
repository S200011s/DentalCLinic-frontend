import React, { useState } from "react";
import "../Shared.css";
import "boxicons/css/boxicons.min.css";
import ButtonSubmit from "../../../components/Buttons/ButtonSubmit";
import axios from "../../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = "Email must be valid (e.g. user@example.com)";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)
    ) {
      errors.password =
        "Password must contain uppercase, lowercase, number and special character";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});

    const localErrors = validateForm();
    if (Object.keys(localErrors).length > 0) {
      setFormErrors(localErrors);
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Account Created Successfully");
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/layout");
        } else if (user.role === "doctor") {
          navigate("/doctor/appointments");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      const data = err.response?.data;
      const errorMessage = data?.message || "Failed to create account";
      toast.error(errorMessage);
      setServerError(errorMessage);

      if (Array.isArray(data?.errors)) {
        const fieldErrors = {};
        data.errors.forEach((msg) => {
          const lower = msg.toLowerCase();
          if (lower.includes("first name")) {
            fieldErrors.firstName = msg;
          } else if (lower.includes("last name")) {
            fieldErrors.lastName = msg;
          } else if (lower.includes("email")) {
            fieldErrors.email = msg;
          } else if (lower.includes("password")) {
            fieldErrors.password = msg;
          } else if (lower.includes("confirm")) {
            fieldErrors.confirmPassword = msg;
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
            <h3>Create your account</h3>
            <p>
              <span>"</span>&nbsp;Rediscover your smile in a place where care
              feels natural, and every detail is crafted with comfort and
              confidence in mind. Dental wellness with a touch of
              elegance.&nbsp;<span>"</span>
            </p>
          </div>
        </div>
        <div className="_FormContainer">
          <form className="_Form" onSubmit={handleSubmit}>
            <div className="_Title">Sign Up</div>

            <div className="_field _nameField">
              <div className="_inputField">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`_Name ${
                    formErrors.firstName ? "input-error" : ""
                  }`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {formErrors.firstName && (
                  <span className="_error password-error">
                    <i
                      className={`bx bx-error-circle error-icon ${
                        formErrors.firstName ? "error-iconBlur" : ""
                      }`}
                    ></i>
                    <p className="error-text">{formErrors.firstName}</p>
                  </span>
                )}
              </div>
            </div>
            <div className="_field _nameField">
              <div className="_inputField">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`_Name ${
                    formErrors.lastName ? "input-error" : ""
                  }`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {formErrors.lastName && (
                  <span className="_error password-error">
                    <i
                      className={`bx bx-error-circle error-icon ${
                        formErrors.lastName ? "error-iconBlur" : ""
                      }`}
                    ></i>
                    <p className="error-text">{formErrors.lastName}</p>
                  </span>
                )}
              </div>
            </div>
            <div className="_field _emailField">
              <div className="_inputField">
                <input
                  type="text"
                  name="email"
                  placeholder="Your email"
                  className={`_Email ${formErrors.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>{" "}
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
                  placeholder="Create password"
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
              </div>{" "}
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
            <div className="_field confirm-password">
              <div className="_inputField" style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className={`_confiermPassword ${
                    formErrors.confirmPassword ? "input-error" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  style={{ paddingRight: "40px" }}
                />
                <i
                  className={`bx ${showConfirmPassword ? "bx-show" : "bx-hide"}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              </div>{" "}
              {formErrors.confirmPassword && (
                <span className="_error password-error">
                  <i
                    className={`bx bx-error-circle error-icon ${
                      formErrors.confirmPassword ? "error-iconBlur" : ""
                    }`}
                  ></i>
                  <p className="error-text">{formErrors.confirmPassword}</p>
                </span>
              )}
            </div>
            {serverError && <p className="error-text">{serverError}</p>}
            <div className="_inputField _button">
              <ButtonSubmit name={"Sign Up"} />
            </div>
            <div className="_Link">
              <Link id="_GoToLogin" to="/login">
                Have an account?
              </Link>
            </div>
            <div className="_footerCopyRight">
              <div className="_text">
                Copyright &copy; 2025 Generic Wihte Teeth
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
