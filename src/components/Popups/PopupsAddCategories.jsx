import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

function PopupAddCategory({
  open,
  setOpen,
  isEdit = false,
  categoryData = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit && categoryData) {
      setFormData({
        name: categoryData.name || "",
        description: categoryData.description || "",
      });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [isEdit, categoryData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = {};
      if (!isEdit || formData.name.trim()) payload.name = formData.name.trim();
      if (!isEdit || formData.description.trim())
        payload.description = formData.description.trim();

      const url = isEdit ? `/category/${categoryData._id}` : "/category";
      const method = isEdit ? "put" : "post";

      await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        isEdit
          ? "Category updated successfully"
          : "Category created successfully"
      );
      onSuccess();
      setOpen(false);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        toast.error(serverErrors.map((e) => e.message).join(" | "));
      } else {
        toast.error("Error submitting category");
      }
    }
  };

  return (
    <div>
      {!isEdit && (
        <div className="w-full">
          <ButtonSubmit
            name={"+ Add New Category"}
            onClick={() => setOpen(true)}
          />
        </div>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEdit ? "Edit Category" : "Add New Category"}
          <IconButton
            onClick={() => setOpen(false)}
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
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isEdit}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required={!isEdit}
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

export default PopupAddCategory;
