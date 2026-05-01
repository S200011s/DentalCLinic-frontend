import React, { useState } from "react";
import "../Shared.css";
import "boxicons/css/boxicons.min.css";
import ButtonSubmit from "../../../components/Buttons/ButtonSubmit";
import { Link, useNavigate } from "react-router";
import axios from "../../../api/axiosInstance";

export function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setSuccessMessage("");
  };

  const handleBlur = () => {
    if (!email.trim()) {
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const res = await axios.post("/auth/forget-password", { email });
      setSuccessMessage(res.data.message);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
            <h3>Password Recovery</h3>
            <p>
              <span>"</span>&nbsp;No worries — it happens! Just enter your email
              address below, and we'll send you a secure link to reset your
              password. Your smile is just a few steps away.&nbsp;<span>"</span>
            </p>
          </div>
        </div>
        <div className="_FormContainer">
          <form className="_Form" onSubmit={handleSubmit}>
            <div className="_field _emailField">
              <div className="_Title">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAAAXNSR0IArs4c6QAABVhJREFUaEPtmH9sE2UYx7/PtRs4mKKJYIgYEP8wYXfDCMOIf8xIYG1xMUZCULAQA2oMOhBNRq/uQq+AyECDGkHkV6byh4lE1w4W/8A/JEEzoS1ECb+MvxJITAxzE7br+8jbtaZZ2vXuVmYwu//ae97nPu/nnnvveY9wkx50k3JjFHyk79yo8f+FcV8o8RARLWfCRIUpFjPVj8o9sbKWyhPGiQl9lud9AEsGgZ5RSFncHqlJlGsCZQNv0JN+BZBm75JwTFitkDjLaeUDEKZmgAlmPKKFywE/bPDG13+s7q/s20FAMAvUlSYRPBKZeVr+nr8uMa5irPIWg1+Q6ASctkgszp13O4lhgQf05DwB7CdgMoBrYBh1FeoWwyAxGGihnqoXzHuz9vvB2NBb8cfmo8ajlht4V+DSomcMbSPCqpxlAX7msFl7ZiiIRWuO3dJbNX4LE17KFA6QEODFpcYVyukY3Bc+NZdYfApgCoCrxBSeXVGzrZDlYpPI5BCiLWv/GsDhOq/W6iSHbfACto6nvZ6lR4wZ59zcapmvZ1z1JoBXA1AAOMpnC9wfTsyBoINZQ38DCNV51XecGCo2OZmbBLUx4T4AvWBqjkdrdgDEQwkZErzeuDh2nHXFZNCaASv8TdrrXe7WcjEQeZ2qdHcUjKbcdSxWlnRG1V+KjSkKHggnH4TAwayJHgI1x8yad0uZcFM2uTH59gn4i4F1cVPbafvhfFxPTEuDLgwMoLMeiAVfmrUXhwNld2zGvtUt374rBt5Z9HLMVHcMHl/Q+MLQyTpByvFsMIN5p3UN6zq31vbYBXAbFwglgkz0NoAJ2bft5nhEa3YKLmtsPIDbAfxKwIqYqX3lFmqocY0t30+2hHc3GL5snOxragHeFDdr19sCbwifmq2w+BbAYU5bz8Lj3U1A48Ctw4eevspXv9hyf3e5JhDQU88xuBXAbcQ4xwovBdPM632P7HPsG88Hj5taxoBPTzxFoPcATGTgdwUIDtf+/FBqipd4D4B5ANIgtPZ6qluOGtOu+vXk847BczXOTEc6ompDzuwC4/QdHistH5SnM/YZezz9lU1u7AfCyVXM2AqgWjZeIARjEa3r3xWmnOC5pL71SR8p2AtgklP70rKH+AAB9QAsWQqXLvVt6No1qz+/9MpqPD9xZtPQ79kOwnL5PwP7x3jTTYeMB/4sXPtMgXDyRTC9yQMPfEIhJVhsc3HDwHNwsrVlQNapbLouscCKjo1aRz58g3FiqmIpbQDNBdAHRqRUS+sKPPdwDq7xYquI3EykK/taGViZXXk+7vfy2k6j9nIglGhiok0AxgLoItCymKn+UGpF8unJldf7/F1EtDEWUUO2lsNiD2epiw3aLOSHX2VGy5wKdavdxmxEjOcTZtrVqvGvZGv/TgBxBhkdpnq+1MTzz4+ocSdgpWJdGXdbKqVgnJwfBXdiqxyxroz7Q6lZIP4OQGfc1BaUA8Rpjhw4g6IdpqrbWg4DRvJetnAejAvxqDbd6UXLEe/Xk9sAyC3j2ripbbcFLoP8evKKbIAUFne3R2f+Vg4YJzn8elL24xoT6jsi2tdOwD+RHy8J+CxmaoucXHS4sf5QahmIDwC4HDe1SYXyFd0sL2w5dY9IixSAW4vV2XABC40P6IlGBu2Tuy6F6cn2qPq5I3AZ3PBG4jGPoEPZbu4iAccE6CeCcPW9b6iJEmgyAzOuLwgPZ/odptdiUVX26wWPkh+EfHpqugLsY/AjN8JwgZw/K6Bgu6keHXqiNmkynyyYNCKuYaDC5jCbYQrLFQwKn4xHNFmeJY+Sxktm+I8CRsFHWvyo8ZE2/g/nJYhNwUIGYwAAAABJRU5ErkJggg=="
                  alt="email icon"
                  className="Iconsss"
                />
              </div>
              <div className="_inputField">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`_Email ${error ? "input-error" : ""}`}
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {error && (
                <span className="_error password-error">
                  <i
                    className={`bx bx-error-circle error-icon ${
                      error ? "error-iconBlur" : ""
                    }`}
                  ></i>
                  <p className="error-text">{error}</p>
                </span>
              )}
              {successMessage && (
                <p className="success-text">{successMessage}</p>
              )}
            </div>
            <div className="_inputField _button">
              <ButtonSubmit name={"Submit"} disabled={!email.trim()} />
            </div>
            <div className="_Link">
              <Link id="_GoToLogin" to="/login">
                Have An Account
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

export default ForgetPassword;
