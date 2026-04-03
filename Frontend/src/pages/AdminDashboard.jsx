import { useEffect, useState } from "react";
import API from "../../../Backend/services/API";

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    API.get("/listings").then((res) => setListings(res.data));
  }, []);

  const deleteListing = async (id) => {
    await API.delete(`/admin/listings/${id}`);
    setListings(listings.filter((l) => l._id !== id));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {listings.map((l) => (
        <div key={l._id}>
          {l.title}
          <button onClick={() => deleteListing(l._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
