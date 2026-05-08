import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import AdminTables from "../AdminTables";
import PopupsAddGallery from "../../../components/Popups/PopupsAddGallery";

const columns = [
  { label: "Image", key: "imageUrl", minWidth: 150 },
  { label: "Actions", key: "actions", minWidth: 100, align: "right" },
];

const GalleryAdmin = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const getAllImages = async () => {
    try {
      const { data } = await axios.get("/gallery");
      const mapped = data.map((img) => ({
        _id: img._id,
        imageUrl: img.imageUrl,
        publicId: img.publicId,
      }));
      setRows(mapped);
    } catch (err) {
      toast.error("Failed to fetch images");
      console.error(err);
    }
  };

  const DeleteById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`dashboard/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted successfully");
    } catch (err) {
      toast.error("Failed to delete image");
      console.error(err);
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setIsEdit(true);
    setOpen(true);
  };

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <main className="h-full overflow-y-auto bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold" style={{ color: "#10244b" }}>
          Gallery
        </h2>
        <div className="mb-6 flex justify-end" style={{ width: "100%" }}>
          <PopupsAddGallery
            open={open}
            setOpen={setOpen}
            isEdit={isEdit}
            imageData={selectedImage}
            onClose={() => {
              setOpen(false);
              setIsEdit(false);
              setSelectedImage(null);
            }}
            onSuccess={() => {
              getAllImages();
              setOpen(false);
              setIsEdit(false);
              setSelectedImage(null);
            }}
          />
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <AdminTables
            columns={columns}
            rows={rows}
            DeleteById={DeleteById}
            onEdit={handleEdit}
            showEdit={true}
          />
        </div>
      </div>
    </main>
  );
};

export default GalleryAdmin;