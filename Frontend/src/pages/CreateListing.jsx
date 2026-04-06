import React, { useState, useEffect } from 'react'
import { getUserToken } from '../utils/authToken'
import "../css/Listings.css"

const List = ({ setRefreshPageState }) => {

  const [listing, setListing] = useState([])
  const [categories, setCategories] = useState([]) // dynamically fetched
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "Used",
    categoryId: ""
  })

  const listingURL = "http://localhost:3000/api/listings"
  const categoryURL = "http://localhost:3000/api/categories"

  // Fetch listings
  const fetchListings = async () => {
    try {
      const resListing = await fetch(listingURL)
      const allListing = await resListing.json()
      setListing(allListing)
    } catch (err) {
      console.log(err)
    }
  }

  // Fetch categories dynamically
  const fetchCategories = async () => {
    try {
      const res = await fetch(categoryURL)
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.log(err)
    }
  }

  const refreshPageFunction = () => {
    setRefreshPageState(current => !current)
    setTimeout(() => {
      setRefreshPageState(current => !current)
    }, 1000)
  }

  const handleChange = (e) => {
    setNewForm({
      ...newForm,
      [e.target.name]: e.target.value
    })
  }

  const createListing = async (e) => {
    e.preventDefault()
    const currentState = {
      ...newForm,
      price: Number(newForm.price) // enforce number
    }
    try {
      const options = {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${getUserToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(currentState)
      }

      const response = await fetch(listingURL, options)
      const createdListing = await response.json()

      setListing([...listing, createdListing])

      // reset form
      setNewForm({
        title: "",
        description: "",
        price: "",
        condition: "Used",
        categoryId: ""
      })

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchListings()
    fetchCategories() // fetch categories on load
  }, [])

  return (
    <div className='createListing'>
      <h3>Create a new Listing!</h3>
      <form onSubmit={createListing}>
        <input
          type="text"
          className='listingInput'
          value={newForm.title}
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className='listingInput'
          value={newForm.description}
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          className='listingInput'
          value={newForm.price}
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        {/* CONDITION (ENUM) */}
        <select
          className='listingInput'
          name="condition"
          value={newForm.condition}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
          <option value="Fair">Fair</option>
        </select>
        {/* CATEGORY ID (DYNAMIC) */}
        <select
          className='listingInput'
          name="categoryId"
          value={newForm.categoryId}
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
          value="List"
          onClick={refreshPageFunction}
        />
      </form>
    </div>
  )
}

export default List