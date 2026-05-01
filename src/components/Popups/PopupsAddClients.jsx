import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PopupsAddClients({
  isEdit = false,
  userData = null,
  onSuccess,
  onClose,
  open,
  setOpen,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
    age: "",
    clientWork: "",
    address: {
      city: "",
      street: "",
      country: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (isEdit && userData) {
      setFormData({
        ...userData,
        password: "",
        address: {
          city: userData?.address?.city || "",
          street: userData?.address?.street || "",
          country: userData?.address?.country || "",
          postalCode: userData?.address?.postalCode || "",
        },
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: "client",
        age: "",
        clientWork: "",
        address: {
          city: "",
          street: "",
          country: "",
          postalCode: "",
        },
      });
    }
  }, [isEdit, userData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "street", "country", "postalCode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = isEdit
      ? `http://localhost:5000/api/user/${userData._id}`
      : "http://localhost:5000/api/user";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          isEdit ? "User updated successfully" : "User created successfully"
        );
        if (onSuccess) onSuccess();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  return (
    <div>
      {!isEdit && (
        <div className="w-full">
          <ButtonSubmit
            name="  + Add new Client  "
            onClick={() => setOpen(true)}
          />
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {isEdit ? "Edit Client" : "Add New Client"}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoMdClose />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 16,
            }}
          >
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {!isEdit && (
              <>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
            <TextField
              label="Client Work"
              name="clientWork"
              value={formData.clientWork}
              onChange={handleChange}
            />
            <FormControl fullWidth required>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="City"
              name="city"
              value={formData.address.city}
              onChange={handleChange}
              required
            />
            <TextField
              label="Street"
              name="street"
              value={formData.address.street}
              onChange={handleChange}
              required
            />
            <TextField
              label="Country"
              name="country"
              value={formData.address.country}
              onChange={handleChange}
              required
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Update Now" : "Add Now"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopupsAddClients;
