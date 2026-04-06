import React, { useState, useEffect } from 'react'
import { getUserToken } from '../utils/authToken'
import "../css/Listings.css"

const EditListing = ({ listingToEdit, setRefreshPageState, closeFloat }) => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "Used",
    categoryId: ""
  })

  const [categories, setCategories] = useState([]) // dynamic categories

  const listingURL = "http://localhost:3000/api/listings"
  const categoryURL = "http://localhost:3000/api/categories"

  // Pre-fill form when editing
  useEffect(() => {
    if (listingToEdit) {
      setFormData({
        title: listingToEdit.title || "",
        description: listingToEdit.description || "",
        price: listingToEdit.price || "",
        condition: listingToEdit.condition || "Used",
        categoryId: listingToEdit?.categoryId?._id || ""
      })
    }
  }, [listingToEdit])

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(categoryURL)
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCategories()
  }, [])

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Update listing
  const updateListing = async (e) => {
    e.preventDefault()

    try {
      const updatedData = {
        ...formData,
        price: Number(formData.price)
      }

      const options = {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${getUserToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      }

      const res = await fetch(`${listingURL}/${listingToEdit._id}`, options)

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Update failed")
      }

      // Refresh parent page
      setRefreshPageState(prev => !prev)

      // Close float
      closeFloat()

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='createListing'>
      <h3>Edit Listing</h3>

      <form onSubmit={updateListing}>
        <input
          type="text"
          className='listingInput'
          value={formData.title}
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className='listingInput'
          value={formData.description}
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          className='listingInput'
          value={formData.price}
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        {/* CONDITION */}
        <select
          className='listingInput'
          name="condition"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
          <option value="Fair">Fair</option>
        </select>

        {/* CATEGORY */}
        <select
          className='listingInput'
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          className="createListingButton"
          type="submit"
          value="Update Listing"
        />
      </form>
    </div>
  )
}

export default EditListing