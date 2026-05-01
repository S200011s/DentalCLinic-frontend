import { useNavigate } from "react-router-dom";
import ButtonSubmit from "../../components/Buttons/ButtonSubmit";
import axios from "../../api/axiosInstance";

const LogOut = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <ButtonSubmit name="LogOut" onClick={handleLogout} />;
};

export default LogOut;
