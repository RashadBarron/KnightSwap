import React, { useState, useEffect } from "react"
import "../css/Listings.css"

const MyListings = ({ user }) => {
    const [myListings, setMyListings] = useState([])
    const [refreshPage, setRefreshPage] = useState(false)

    // Fetch user's listings
    const fetchMyListings = async () => {
    if (!user?._id) return
    try {
        const res = await fetch(`http://localhost:3000/api/listings/user/${user._id}`)
        const data = await res.json()
        setMyListings(data)
    } catch (err) {
        console.log(err)
    }
    }

    // Delete a listing
    const deleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/api/listings/${listingId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete");
        }

        setMyListings(prev => prev.filter(listing => listing._id !== listingId));
    } catch (err) {
        console.log(err);
    }
    };

    useEffect(() => {
    fetchMyListings()
    }, [user, refreshPage])

    return (
    <div className="my-listings-page">
        <h1>My Listings</h1>

        <section className="listing-list">
        {myListings.length ? (
            myListings.map(listing => (
            <div key={listing._id} className="listing-card">
                <div className="listing-header">
                <h2 className="listing-title">{listing.title}</h2>
                </div>
                <div className="listing-body">
                <p>{listing.description}</p>
                </div>
                <div className="listing-meta">
                <span className="listing-price">${listing.price}</span>
                <span className={`listing-condition condition-${listing.condition?.replace(" ", "-")}`}>
                    {listing.condition}
                </span>
                <span className="listing-category">{listing?.categoryId?.name || "Uncategorized"}</span>
                </div>
                <div className="listing-actions">
                <button className="edit-btn" onClick={() => editListing(listing)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteListing(listing._id)}>Delete</button>
                </div>
            </div>
            ))
        ) : (
            <p>No listings yet. Create one!</p>
        )}
        </section>
    </div>
    )
}

export default MyListings