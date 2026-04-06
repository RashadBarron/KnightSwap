import {Link} from 'react-router-dom'
import "../css/Header.css"

const Header=({user, loggedIn, signOut})=>{

  // a function to clear local storage
  const clearLocalStorage=()=>{localStorage.clear();signOut();}

  const signedIn=()=>{ // TODO Link to update profile
    return(
      <div id="menuToggle">
        <input type="checkbox" />
        {/* a span for each layer of hamburbger */}
        <span></span>
        <span></span>
        <span></span>
        <ul id="menu">
          <Link to="/listings"><li>Home</li></Link>
          <Link to={`/favorites`}><li>Favorites</li></Link>
          {/* My listings will be where you go and edit/ update or delete your listings */}
          <Link to={`/myListings`}><li>My Listings</li></Link> 
          <Link onClick={clearLocalStorage} to='/' ><li>Sign Out</li></Link>
        </ul>
      </div>
    )
  }

  return(
    <header className="Header">
      <Link className='home' to='/listings'>
        <h2 className='pageName'>KnightSwap</h2>
      </Link>
      <>{loggedIn ? signedIn() 
        : <div className='loggedOutOptions'>
            <div className='logIn'>
              <Link to={'/'}>Log In </Link>
            </div>
            <div className='signUp'>
              <Link to={'/register'}>Sign Up</Link>
            </div>
          </div>}
      </>
    </header>
  )
}

export default Header