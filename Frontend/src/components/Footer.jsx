import '../css/Footer.css'

const Footer = () => { // TODO make an About us page and Contact Us page

  function scrollToTop(){window.scrollTo({top: 0, behavior: 'smooth'});}

  return (
    <footer className='footer'>
      <p onClick={scrollToTop} className="topOfPage">Top of Page</p>
      <a href='https://github.com/efrainenc/'> About Us</a>
      <a href='https://github.com/RashadBarron/KnightSwap'> Git Hub </a>
      <a href='https://github.com/efrainenc/'> Contact Us </a>
      <p> © 2026 KnightSwap CIS 4004</p>
    </footer>
  )
}

export default Footer