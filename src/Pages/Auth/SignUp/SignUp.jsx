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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.trim().length > 0 && formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field) => {
    const errors = validateForm();
    if (errors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: errors[field] }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = true;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = true;
    }
    if (!formData.email.trim()) {
      errors.email = true;
    }
    if (!formData.password.trim()) {
      errors.password = true;
    }
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = true;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleCheck = () => {
    return (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    );
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
      await axios.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account Created Successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error("Feild Account Create ");

      const data = err.response?.data;

      if (data?.message) {
        setServerError(data.message);
      }

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
          } else {
            setServerError(msg);
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
                  onBlur={() => handleBlur("firstName")}
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
                  onBlur={() => handleBlur("lastName")}
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
                  onBlur={() => handleBlur("email")}
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
              <div className="_inputField">
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  className={`_Password ${
                    formErrors.password ? "input-error" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                />
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
              <div className="_inputField">
                <input
                  type="password"
                  placeholder="Confirm password"
                  className={`_confiermPassword ${
                    formErrors.confirmPassword ? "input-error" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  name="confirmPassword"
                />
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
              <ButtonSubmit name={"Sign Up"} disabled={handleCheck()} />
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
