import { useEffect, useState } from "react";
import API from "../services/API";
import ListingCard from "../components/ListingCard";

export default function BrowseListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await API.get("/listings");
      setListings(res.data);
    };
    fetchListings();
  }, []);

  return (
    <div>
      <h2>Listings</h2>
      {listings.map((l) => (
        <ListingCard key={l._id} listing={l} />
      ))}
    </div>
  );
}
