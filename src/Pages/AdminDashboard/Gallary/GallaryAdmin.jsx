import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import AdminTables from "../AdminTables";
import PopupsAddGallary from "../../../components/Popups/PopupsAddGallary";

const columns = [
  { label: "Image", key: "imageUrl", minWidth: 150 },
  { label: "ID", key: "_id", minWidth: 200 },
  { label: "Public ID", key: "publicId", minWidth: 200 },
  { label: "Actions", key: "actions", minWidth: 100, align: "right" },
];

const GalleryAdmin = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

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
      await axios.delete(`/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRows((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted successfully");
    } catch (err) {
      toast.error("Failed to delete image");
      console.error(err);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <main className="h-full overflow-y-auto bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container px-6 mx-auto grid">
        <h2
          className="my-6 text-2xl font-semibold"
          style={{ color: "#10244b" }}
        >
          Gallery
        </h2>
        <div className="mb-6 flex justify-end " style={{ width: "100%" }}>
          <PopupsAddGallary
            open={open}
            setOpen={setOpen}
            onClose={() => setOpen(false)}
            onSuccess={() => {
              getAllImages();
              setOpen(false);
            }}
          />
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <AdminTables
            columns={columns}
            rows={rows}
            DeleteById={DeleteById}
            showEdit={false}
          />
        </div>
      </div>
    </main>
  );
};

export default GalleryAdmin;
