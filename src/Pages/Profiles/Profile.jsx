import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen ">
      <Sidebar
        isSideMenuOpen={isSidebarOpen}
        closeSideMenu={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 w-full">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Profile;
