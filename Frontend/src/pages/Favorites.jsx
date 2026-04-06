import { useEffect, useState } from "react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavs = async () => {
      // const res = await API.get("/favorites");
      setFavorites(res.data);
    };
    fetchFavs();
  }, []);

  return (
    <div>
      <h2>Favorites</h2>
      {favorites.map((f) => (
        <div key={f._id}>{f.listingId.title}</div>
      ))}
    </div>
  );
}
