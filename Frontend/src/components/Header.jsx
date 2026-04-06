import { Link } from 'react-router-dom'
import "../css/Header.css"

const Header = ({ user, loggedIn, signOut }) => {

  const clearLocalStorage = () => {
    localStorage.clear();
    signOut();
  };

  const signedIn = () => {
    return (
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>

        <ul id="menu">
          <Link to="/listings"><li>Home</li></Link>
          <Link to="/favorites"><li>Favorites</li></Link>
          <Link to="/myListings"><li>My Listings</li></Link>

          {/* ADMIN ONLY LINK */}
          {user?.role === "admin" && (
            <Link to="/admin"><li>Admin Dashboard</li></Link>
          )}

          <Link onClick={clearLocalStorage} to="/">
            <li>Sign Out</li>
          </Link>
        </ul>
      </div>
    );
  };

  return (
    <header className="Header">
      <Link className='home' to='/listings'>
        <h2 className='pageName'>KnightSwap</h2>
      </Link>

      {loggedIn ? (
        signedIn()
      ) : (
        <div className='loggedOutOptions'>
          <div className='logIn'>
            <Link to="/">Log In</Link>
          </div>
          <div className='signUp'>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;