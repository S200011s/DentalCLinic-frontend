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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name] && value.trim().length > 0) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const handleBlur = (field) => {
    const errors = validateForm();
    if (errors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: errors[field] }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = true;
    }
    if (!formData.password.trim()) {
      errors.password = true;
    }
    return errors;
  };

  const handleCheck = () => {
    return !formData.email.trim() || !formData.password.trim();
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
      const msg = err.response?.data?.message || "Login failed";
      setServerError(msg);
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
                  onBlur={() => handleBlur("email")}
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
              <div className="_inputField">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`_Password ${
                    formErrors.password ? "input-error" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                />
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
              <ButtonSubmit name={"Sign In"} disabled={handleCheck()} />
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
