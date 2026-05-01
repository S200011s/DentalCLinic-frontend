import AdminTables from "../AdminTables";
import PopupsAddClients from "../../../components/Popups/PopupsAddClients";
import axios from "../../../api/axiosInstance";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const columns = [
  { label: "ID", key: "_id", minWidth: 200 },
  { label: "First Name", key: "firstName", minWidth: 150 },
  { label: "Last Name", key: "lastName", minWidth: 150 },
  { label: "Email", key: "email", minWidth: 150 },
  { label: "Phone", key: "phone", minWidth: 150 },
  { label: "Role", key: "role", minWidth: 150 },
  { label: "Address", key: "address", minWidth: 250 },
  { label: "Age", key: "age", minWidth: 70, align: "right" },
  { label: "Client Work", key: "clientWork", minWidth: 150, align: "right" },
  { label: "Actions", key: "actions", minWidth: 150, align: "right" },
];

function Clients() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setOpen(true);
  };

  const DeleteById = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data.users);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <main className="h-full overflow-y-auto bg-white">
      <div className="container px-6 mx-auto grid">
        <h2
          className="my-6 text-2xl font-semibold"
          style={{ color: "#10244b" }}
        >
          Clients
        </h2>

        <div className="mb-6 flex justify-end" style={{ width: "100%" }}>
          <PopupsAddClients
            open={open}
            setOpen={setOpen}
            isEdit={isEdit}
            userData={selectedUser}
            onClose={() => {
              setOpen(false);
              setIsEdit(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              getAllUsers();
              setOpen(false);
              setIsEdit(false);
              setSelectedUser(null);
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
  );
}

export default Clients;
