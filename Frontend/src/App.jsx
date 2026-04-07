import { Routes, Route } from "react-router-dom"
import {useState, useEffect} from 'react'
import {getUserToken, setUserToken, clearUserToken} from './utils/authToken'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from "./pages/Login"
import Register from './pages/Register.jsx'
import BrowseListings from "./pages/BrowseListings"
import MyFavorites from "./pages/MyFavorites"
import AdminDashboard from "./pages/AdminDashboard"
import MyListings from "./pages/MyListings.jsx"
import "./css/App.css"

function App() {
  // import start for the current user object and for isAuthenticated.
  const [currentUser, setCurrentUser] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // fetch new user JSON from register POST and return it as parsedUser
  const registerUser=async(data)=>{
    try{
      const configs={
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json",},
      }
      const newUser = await fetch("http://localhost:3000/api/auth/register",configs)
      const parsedUser = await newUser.json()
      // sets local storage
      setUserToken(parsedUser.token)
      // put the returned user object in state for CurrentUser
      setCurrentUser(parsedUser.user)
      // adds a boolean cast of the responses isLoggedIn prop
      setIsAuthenticated(parsedUser.isLoggedIn)

      return parsedUser
    }catch(err){
      console.log(err);
      clearUserToken();
      setIsAuthenticated(false);
    }
  }

  // fetch user JSON from login POST and return it as user
  const loginUser=async(data)=>{
    try{
      const configs = {
        method: "POST",
        body: JSON.stringify(data),
        headers:{"Content-Type": "application/json",},
      }
      const response = await fetch("http://localhost:3000/api/auth/login",configs);
      const user = await response.json();
      // sets local storage
      setUserToken(user.token);
      // put the returned user object in state for CurrentUser
      setCurrentUser(user.user);
      setIsAuthenticated(user.isLoggedIn);
      window.localStorage.setItem('name', user.user.username);
      return user
    }catch(err){
      clearUserToken();
      setIsAuthenticated(false);
    }
  }
  
  const signOutHandler = () => {
    clearUserToken();
    setIsAuthenticated(false);
    setCurrentUser({});
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Login user={currentUser} login={loginUser} />;
    }

    if (currentUser.role !== "admin") {
      return <p>Access denied</p>;
    }

    return children;
  };

  return (
    <>
      <Header loggedIn={isAuthenticated} signOut={signOutHandler} user={currentUser}/>
      <Routes>
        <Route path="/" element={<Login user={currentUser} login={loginUser}/>} />
        <Route path='/register' element={<Register register={registerUser}/>}/>
        <Route path="/listings" element={<BrowseListings user={currentUser} loggedIn={isAuthenticated}/>} />
        <Route path="/myListings" element={<MyListings user={currentUser} loggedIn={isAuthenticated}/>} />
        <Route path="/favorites" element={ <MyFavorites user={currentUser}/> } />
        <Route path="/admin" element={<AdminRoute> <AdminDashboard user={currentUser} token={getUserToken()}/> </AdminRoute>} />
      </Routes>
      <Footer />
    </>

  );
}

export default App;