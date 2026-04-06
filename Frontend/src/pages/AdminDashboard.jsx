import { useEffect, useState } from "react";
import "../css/AdminDashboard.css"; // custom CSS for dashboard

export default function AdminDashboard({ user, token }) {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [view, setView] = useState("listings"); // selector: "listings" or "categories"

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

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  // LISTINGS CRUD
  const deleteListing = async (id) => {
    await fetch(`http://localhost:3000/api/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setListings(listings.filter(l => l._id !== id));
  };

  // CATEGORIES CRUD
  const deleteCategory = async (id) => {
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
          {listings.map(l => (
            <div key={l._id} className="admin-card">
              <p><strong>{l.title}</strong> by {l.sellerId.username}</p>
              <p>{l.description}</p>
              <p>${l.price} - {l.condition}</p>
              <button className="delete-btn" onClick={() => deleteListing(l._id)}>Delete</button>
            </div>
          ))}
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
                  <button onClick={saveEditCategory}>Save</button>
                  <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <button onClick={() => startEditCategory(c)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteCategory(c._id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}