import "./App.css";
import {
  About,
  Contact,
  Home,
  Login,
  Register,
  Stock,
  Users,
  Search,
  ViewProfile,
  EditProfile,
  Orders,
} from "./pages";
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/users" element={<Users />} />
        <Route path="/search" element={<Search />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
}

export default App;
