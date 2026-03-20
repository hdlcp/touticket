import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import HeaderAdmin from "./HeaderAdmin";

export default function AdminLayout() {
  return (
    <>
      <HeaderAdmin />
      <Outlet />
      <Footer />
    </>
  );
}
