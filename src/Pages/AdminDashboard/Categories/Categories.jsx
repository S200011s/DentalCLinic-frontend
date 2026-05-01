import { useEffect, useState } from "react";
import PopupAddCategory from "../../../components/Popups/PopupsAddCategories";
import AdminTables from "../AdminTables";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";

const columns = [
  { label: "ID", key: "_id", minWidth: 150 },
  { label: "Name", key: "name", minWidth: 200 },
  { label: "Description", key: "description", minWidth: 300 },
  { label: "Actions", key: "actions", minWidth: 150, align: "right" },
];

const Categories = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/category");
      const categories = Array.isArray(data) ? data : data.categories || [];
      const mapped = categories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        description: cat.description,
      }));
      setRows(mapped);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching categories");
    }
  };

  const DeleteById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRows((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEdit(true);
    setOpen(true);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <main className="h-full overflow-y-auto bg-white">
        <div className="container px-6 mx-auto grid">
          <h2
            className="my-6 text-2xl font-semibold"
            style={{ color: "#10244b" }}
          >
            Categories
          </h2>

          <div className="mb-6 flex justify-end w-full">
            <PopupAddCategory
              open={open}
              setOpen={setOpen}
              isEdit={isEdit}
              categoryData={selectedCategory}
              onClose={() => {
                setOpen(false);
                setIsEdit(false);
                setSelectedCategory(null);
              }}
              onSuccess={() => {
                getAllCategories();
                setOpen(false);
                setIsEdit(false);
                setSelectedCategory(null);
              }}
            />
          </div>

          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <AdminTables
              columns={columns}
              rows={rows}
              DeleteById={DeleteById}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Categories;
