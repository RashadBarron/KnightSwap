import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
// import Register from "./pages/Register"
import BrowseListings from "./pages/BrowseListings"
// import CreateListing from "./pages/CreateListing"
import Favorites from "./pages/Favorites"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/listings" element={<BrowseListings />} />
        {/* <Route path="/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} /> */}
        <Route path="/favorites" element={<ProtectedRoute> <Favorites /></ProtectedRoute> } />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>

  );
}

export default App;
