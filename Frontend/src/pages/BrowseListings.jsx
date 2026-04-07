import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import CreateListing from "../pages/CreateListing"
import "../css/Listings.css"

const BrowseListings = ({ user, loggedIn }) => {
  const [listing, setListing] = useState([])
  const [refreshPage, setRefreshPage] = useState(false)
  const [showFloat, setShowFloat] = useState(false)
  const [userFavorites, setUserFavorites] = useState([]) // store user's favorites

  // Fetch all listings
  const fetchListing = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/listings")
      const allListings = await res.json()
      setListing(allListings)
    } catch (err) {
      console.log(err)
    }
  }

  // Fetch user favorites and normalize IDs as strings
  const fetchFavorites = async () => {
    if (!user?._id) return setUserFavorites([]) // reset when logged out
    try {
      const res = await fetch(`http://localhost:3000/api/favorites/user/${user._id}`)
      const data = await res.json()
      const favIds = data.map(fav => fav._id.toString())
      setUserFavorites(favIds)
      console.log("Fetched favorites:", favIds) // remove when done
    } catch (err) {
      console.log("Error fetching favorites:", err) // remove when done
      setUserFavorites([])
    }
  }

  // Toggle favorite for a listing
  const toggleFavorite = async (listingId) => {
    if (!user) return alert("Log in to favorite listings")
    const isFavorited = userFavorites.includes(listingId.toString())
    try {
      if (isFavorited) {
        // DELETE favorite
        await fetch(`http://localhost:3000/api/favorites/${user._id}/${listingId}`, { method: "DELETE" })
        setUserFavorites(prev => prev.filter(id => id !== listingId.toString()))
      } else {
        // POST favorite
        await fetch(`http://localhost:3000/api/favorites/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, listingId })
        })
        setUserFavorites(prev => [...prev, listingId.toString()])
      }
    } catch (err) {
      console.log(err)
    }
  }

  // ESC key closes floating menu
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setShowFloat(false) }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Fetch listings once on mount or when refreshPage changes/ User
  useEffect(() => { 
    fetchListing()
    fetchFavorites()
   }, [refreshPage, user])

  // Render listings
  const loaded = () => {
    return listing.map(item => {
      const isFavorited = userFavorites.includes(item._id.toString());
      console.log(userFavorites) // remove when done
      return (
        <div key={item._id} className="listing-card">
          <div className="listing-header">
            <h2 className="listing-title">{item.title}</h2>
            <div className="listing-seller">
              @{item?.sellerId?.username || "unknown"}
            </div>
          </div>

          <div className="listing-body">
            <p className="listing-description">{item.description}</p>
          </div>

          <div className="listing-meta">
            <span className="listing-price">${item.price}</span>
            <span className={`listing-condition condition-${item.condition?.replace(" ", "-")}`}>
              {item.condition}
            </span>
            <span className="listing-category">{item?.categoryId?.name || "Uncategorized"}</span>

            {loggedIn && (
              <button
                className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
                onClick={() => toggleFavorite(item._id)}
                title={isFavorited ? "Remove Favorite" : "Add to Favorites"}
              >
                {isFavorited ? "❤️" : "🤍"}
              </button>
            )}
          </div>
        </div>
      )
    })
  }

  const loading = () => (
    <section className="loading">
      <h1>Loading...</h1>
    </section>
  )

  return (
    <>
      {/* CREATE LISTING BUTTON */}
      {loggedIn && (
        <div className="button-container">
          <button
            className="open-float-btn"
            onClick={() => setShowFloat(true)}
          >
            + Create Listing
          </button>
        </div>
      )}

      {/* FLOAT MENU */}
      {showFloat && (
        <div className="float-overlay" onClick={() => setShowFloat(false)}>
          <div className="float-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="float-close"
              onClick={() => setShowFloat(false)}
            >
              ✕
            </button>

            <CreateListing
              setRefreshPageState={setRefreshPage}
              closeFloat={() => setShowFloat(false)}
            />
          </div>
        </div>
      )}

      {/* LISTINGS */}
      <section className="listing-list">
        {listing && listing.length ? loaded() : loading()}
      </section>
    </>
  )
}

export default BrowseListings