import "./Information.css";
import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../components/Loader/Loader";
const Information = () => {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setUserData(user);
        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          age: user.age || "",
          phone: user.phone || "",
          clientWork: user.clientWork || "",
          image: "",
          address: user.address || {
            country: "",
            city: "",
            street: "",
            postalCode: "",
          },
        });
        setImagePreview(user.image);
      } catch {
        toast.error("Failed to load user data");
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  const validateForm = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.age) errors.age = "Age is required";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    if (!form.address?.country?.trim()) errors.country = "Country is required";
    if (!form.address?.city?.trim()) errors.city = "City is required";
    if (!form.address?.street?.trim()) errors.street = "Street is required";
    if (!form.address?.postalCode?.trim())
      errors.postalCode = "Postal Code is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (["city", "street", "country", "postalCode"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix form errors");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "address") {
          Object.entries(value).forEach(([k, v]) => {
            formData.append(`address[${k}]`, v);
          });
        } else {
          formData.append(key, value);
        }
      });

      const res = await axios.put(`/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");

      const updatedUser = res.data.user;
      setUserData(updatedUser);
      setImagePreview(updatedUser.image);
      console.log(true);
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    }
  };

  if (!form) return <Loader />;

  const cancelEdit = () => {
    setForm({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      age: userData.age || "",
      phone: userData.phone || "",
      clientWork: userData.clientWork || "",
      image: "",
      address: userData.address || {},
    });
    setImagePreview(userData.image);
    setFormErrors({});
    setIsEditing(false);
  };

  return (
    <div className="_ContainerDisplayInfo">
      <h2 className="my-6 text-2xl font-semibold" style={{ color: "#10244b" }}>
        Information
      </h2>

      <div className="_FormContainer">
        <div className="_field mb-10">
          <img
            src={imagePreview}
            alt="User"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          {isEditing && (
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        <form className="_Form" onSubmit={handleSubmit}>
          <div className="_field _nameField">
            <div className="_inputField">
              <label className="_label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.firstName ? "input-error" : ""}
              />
            </div>
            {formErrors.firstName && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.firstName}</p>
              </span>
            )}
          </div>

          <div className="_field _emailField">
            <div className="_inputField">
              <label className="_label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.lastName ? "input-error" : ""}
              />
            </div>
            {formErrors.lastName && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.lastName}</p>
              </span>
            )}
          </div>

          <div className="_field _emailField">
            <div className="_inputField">
              <label className="_label">Client Work</label>
              <input
                type="text"
                name="clientWork"
                value={form.clientWork}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.clientWork ? "input-error" : ""}
              />
            </div>
            {formErrors.clientWork && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.clientWork}</p>
              </span>
            )}
          </div>

          <div className="_field age">
            <div className="_inputField">
              <label className="_label">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.age ? "input-error" : ""}
              />
            </div>
            {formErrors.age && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.age}</p>
              </span>
            )}
          </div>

          <div className="_field phone">
            <div className="_inputField">
              <label className="_label">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.phone ? "input-error" : ""}
              />
            </div>
            {formErrors.phone && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.phone}</p>
              </span>
            )}
          </div>

          <div className="_field Country">
            <div className="_inputField">
              <label className="_label">Country</label>
              <input
                type="text"
                name="country"
                value={form.address?.country || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.country ? "input-error" : ""}
              />
            </div>
            {formErrors.country && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.country}</p>
              </span>
            )}
          </div>

          <div className="_field City">
            <div className="_inputField">
              <label className="_label">City</label>
              <input
                type="text"
                name="city"
                value={form.address?.city || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.city ? "input-error" : ""}
              />
            </div>
            {formErrors.city && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.city}</p>
              </span>
            )}
          </div>

          <div className="_field Street">
            <div className="_inputField">
              <label className="_label">Street</label>
              <input
                type="text"
                name="street"
                value={form.address?.street || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.street ? "input-error" : ""}
              />
            </div>
            {formErrors.street && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.street}</p>
              </span>
            )}
          </div>

          <div className="_field PostalCode">
            <div className="_inputField">
              <label className="_label">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={form.address?.postalCode || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={formErrors.postalCode ? "input-error" : ""}
              />
            </div>
            {formErrors.postalCode && (
              <span className="_error">
                <i className="bx bx-error-circle error-icon"></i>
                <p className="error-text">{formErrors.postalCode}</p>
              </span>
            )}
          </div>
          <div className="_Buttons"></div>
          {isEditing && (
            <div className="_field _button">
              <button type="submit" className="_btn">
                Save Changes
              </button>
              <button
                type="button"
                className="_btn"
                onClick={cancelEdit}
                style={{ background: "gray" }}
              >
                Cancel
              </button>
            </div>
          )}
          {!isEditing && (
            <div className="_field _button">
              <div style={{ marginBottom: "1rem" }}>
                <button
                  type="button"
                  className="_btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Information;
