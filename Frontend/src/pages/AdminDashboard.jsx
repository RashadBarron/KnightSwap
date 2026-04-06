import { useEffect, useState } from "react";
import EditListing from "../pages/EditListing"
import "../css/AdminDashboard.css"; // custom CSS for dashboard

export default function AdminDashboard({ user, token }) {
  const [listing, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [view, setView] = useState("listings"); // selector: "listings" or "categories"
  // FLOAT STATE
  const [showFloat, setShowFloat] = useState(false)
  const [editingListing, setEditingListing] = useState(null)
  const [refreshPage, setRefreshPage] = useState(false)

  // Fetch all listings
  const fetchListings = async () => {
    const res = await fetch("http://localhost:3000/api/listings");
    const data = await res.json();
    setListings(data);
  };

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:3000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

    // Delete a listing
  const deleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`http://localhost:3000/api/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to delete")
      }

      // remove from UI immediately
      setMyListings(prev => prev.filter(l => l._id !== listingId))

    } catch (err) {
      console.log(err)
    }
  }

  // Open edit float
  const handleEdit = (listing) => {
    setEditingListing(listing)
    setShowFloat(true)
  }

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  // CATEGORIES CRUD
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    await fetch(`http://localhost:3000/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(categories.filter(c => c._id !== id));
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategory }),
    });
    const data = await res.json();
    setCategories([...categories, data]);
    setNewCategory("");
  };

  const startEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
  };

  const saveEditCategory = async () => {
    if (!editingCategoryName.trim()) return;
    const res = await fetch(`http://localhost:3000/api/categories/${editingCategoryId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editingCategoryName }),
    });
    const updated = await res.json();
    setCategories(categories.map(c => (c._id === updated._id ? updated : c)));
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

    // Render listings
  const loaded = () => {
      return (
      <div className="my-listings-page">
          {/* LISTINGS */}
        <section className="listing-list">
          {listing.length ? (
            listing.map(listing => (
              <div key={listing._id} className="listing-card">

                <div className="listing-header">
                  <h2 className="listing-title">{listing.title}</h2>
                  <div className="listing-seller">
                    @{listing?.sellerId?.username || "unknown"}
                  </div>
                </div>

                <div className="listing-body">
                  <p>{listing.description}</p>
                </div>

                <div className="listing-meta">
                  <span className="listing-price">${listing.price}</span>

                  <span className={`listing-condition condition-${listing.condition?.replace(" ", "-")}`}>
                    {listing.condition}
                  </span>

                  <span className="listing-category">
                    {listing?.categoryId?.name || "Uncategorized"}
                  </span>
                </div>

                <div className="listing-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(listing)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteListing(listing._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))
          ) : (
            <p>No listings yet. Create one!</p>
          )}
        </section>

        {/* FLOAT (CREATE + EDIT) */}
        {showFloat && (
          <div
            className="float-overlay"
            onClick={() => {
              setShowFloat(false)
              setEditingListing(null)
            }}
          >
            <div
              className="float-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="float-close"
                onClick={() => {
                  setShowFloat(false)
                  setEditingListing(null)
                }}
              >
                ✕
              </button>

              {editingListing ? (
                <EditListing
                  listingToEdit={editingListing}
                  setRefreshPageState={setRefreshPage}
                  closeFloat={() => {
                    setShowFloat(false)
                    setEditingListing(null)
                  }}
                />
              ) : (
                <CreateListing
                  setRefreshPageState={setRefreshPage}
                  closeFloat={() => setShowFloat(false)}
                />
              )}

            </div>
          </div>
        )}
      </div>
      )
  }

  const loading = () => (
    <section className="loading">
      <h1>Loading...</h1>
    </section>
  )

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Selector Tabs */}
      <div className="admin-tabs">
        <button
          className={view === "listings" ? "active" : ""}
          onClick={() => setView("listings")}
        >
          Listings
        </button>
        <button
          className={view === "categories" ? "active" : ""}
          onClick={() => setView("categories")}
        >
          Categories
        </button>
      </div>

      {/* LISTINGS PANEL */}
      {view === "listings" && (
        <section className="admin-panel">
          <h2>Manage Listings</h2>
          {listing && listing.length ? loaded() : loading()}
        </section>
      )}

      {/* CATEGORIES PANEL */}
      {view === "categories" && (
        <section className="admin-panel">
          <h2>Manage Categories</h2>

          <div className="create-category">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
            />
            <button onClick={createCategory}>Add</button>
          </div>

          {categories.map(c => (
            <div key={c._id} className="admin-card">
              {editingCategoryId === c._id ? (
                <>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                  />
                  <div>
                  <button onClick={saveEditCategory}>Save</button>
                  <button className="delete-btn" onClick={() => setEditingCategoryId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <div>
                    <button onClick={() => startEditCategory(c)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteCategory(c._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}