import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout() {
  return (
    <div className="h-dvh  flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
