import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import "../css/Favorites.css"

const MyFavorites = ({ user }) => {
  const [favorites, setFavorites] = useState([])
  const [refreshPage, setRefreshPage] = useState(false)

  // Fetch user's favorites
  const fetchFavorites = async () => {
    if (!user?._id) return

    try {
      const res = await fetch(`http://localhost:3000/api/favorites/user/${user._id}`)
      const data = await res.json()

      const listings = data
        .map(fav => fav.listingId)
        .filter(listing => listing)

      setFavorites(listings)
    } catch (err) {
      console.log("Error fetching favorites:", err)
    }
  }

  // Remove favorite with confirmation
  const removeFavorite = async (listingId) => {
    const confirmed = window.confirm("Are you sure you want to remove this favorite? ❤️")
    if (!confirmed) return

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `http://localhost:3000/api/favorites/${user._id}/${listingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to remove favorite")
      }

      setFavorites(prev => prev.filter(item => item._id !== listingId))

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [refreshPage, user])

  return (
    <div className="my-listings-page">
      <h1>My Favorites</h1>

      <section className="listing-list">
        {favorites.length ? (
          favorites.map(item => (
            <div key={item._id} className="listing-card">

              <div className="listing-header">
                <h2 className="listing-title">{item.title}</h2>
                <Link
                  className="listing-seller"
                  to={`/profile/${item?.sellerId?._id}`}
                >
                  @{item?.sellerId?.username || "unknown"}
                </Link>
              </div>

              <div className="listing-body">
                <p>{item.description}</p>
              </div>

              <div className="listing-meta">
                <span className="listing-price">${item.price}</span>
                <span className={`listing-condition condition-${item.condition?.replace(" ", "-")}`}>
                  {item.condition}
                </span>
                <span className="listing-category">
                  {item?.categoryId?.name || "Uncategorized"}
                </span>
              </div>

              <div className="listing-actions">
                <button
                  className="delete-btn"
                  onClick={() => removeFavorite(item._id)}
                >
                  ❤️ Remove
                </button>
              </div>

            </div>
          ))
        ) : (
          <p>No favorites yet.</p>
        )}
      </section>
    </div>
  )
}

export default MyFavorites