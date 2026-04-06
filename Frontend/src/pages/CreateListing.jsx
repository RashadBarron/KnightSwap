import React, { useState, useEffect } from 'react'
import { getUserToken } from '../utils/authToken'
import "../css/Listings.css"

const List = ({ setRefreshPageState }) => {

  const [listing, setListing] = useState([])

  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "Used",
    categoryId: ""
  })

  const categories = [
    { id: "69cf86051f1ea425922cf874", name: "Textbooks" },
    { id: "69d1ff1347e34572b94edc80", name: "Electronics" },
  ]

  const listingURL = "http://localhost:3000/api/listings"

  const fetchPosts = async () => {
    try {
      const resPost = await fetch(listingURL)
      const allPost = await resPost.json()
      setListing(allPost)
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

  const createPost = async (e) => {
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
      const createdPost = await response.json()

      setListing([...listing, createdPost])

      // reset properly
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
    fetchPosts()
  }, [])

  return (
    <div className='createPost'>
      <h3>Create a new Listing!</h3>
      <form onSubmit={createPost}>
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
        {/* CATEGORY ID (REQUIRED) */}
        <select
          className='listingInput'
          name="categoryId"
          value={newForm.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}

        </select>
        <input
          className="createPostButton"
          type="submit"
          value="List"
          onClick={refreshPageFunction}
        />
      </form>
    </div>
  )
}

export default List