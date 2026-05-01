import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Shared.css";
import "boxicons/css/boxicons.min.css";
import ButtonSubmit from "../../../components/Buttons/ButtonSubmit";
import { MdOutlinePassword } from "react-icons/md";
import axios from "../../../api/axiosInstance";

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      formData.password !== formData.confirmPassword
    );
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
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword: formData.password,
      });

      setSuccessMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      setServerError(msg);
    }
  };

  return (
    <div className="_mainContainer">
      <div className="_Container">
        <div className="_image">
          <div className="_Ima">
            <img src="/src/assets/images/c2.webp" alt="teeth image" />
          </div>
          <div className="_Title">
            <h3>Reset Password</h3>
            <p>
              <span>"</span>&nbsp;Please enter and confirm your new password to
              continue your smile journey.&nbsp;<span>"</span>
            </p>
          </div>
        </div>

        <div className="_FormContainer">
          <form className="_Form" onSubmit={handleSubmit}>
            <div className="_Title">
              <MdOutlinePassword className="text-5xl Iconsss" />
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

            <div className="_field confirm-password">
              <div className="_inputField">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className={`_confiermPassword ${
                    formErrors.confirmPassword ? "input-error" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                />
              </div>
              {formErrors.confirmPassword && (
                <span className="_error password-error">
                  <i
                    className={`bx bx-error-circle error-icon ${
                      formErrors.confirmPassword ? "error-iconBlur" : ""
                    }`}
                  ></i>{" "}
                  <p className="error-text">{formErrors.confirmPassword}</p>
                </span>
              )}
            </div>

            {serverError && (
              <span className="_error password-error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{serverError}</p>
              </span>
            )}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <div className="_inputField _button">
              <ButtonSubmit name={"Reset Now"} disabled={handleCheck()} />
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

export default ResetPassword;
