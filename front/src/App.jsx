import "react-toastify/dist/ReactToastify.css";

import NavBar from "@/components/NavBar";
import HomePage from "./Pages/HomePage";
import NewCard from "./Pages/NewCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UpdateCard from "./Pages/UpdateCard";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ToastContainer position="bottom-right" autoClose={4000} newestOnTop closeOnClick theme="dark" pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-card" element={<NewCard />} />
        <Route path="/update-card/:idCarte" element={<UpdateCard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
