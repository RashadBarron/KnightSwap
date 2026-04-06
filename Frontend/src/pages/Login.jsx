import React, {useState} from 'react'
import  {Link, useNavigate} from 'react-router-dom'
import "../css/AuthForm.css"

export default function Login({login, user}) {

  const navigate = useNavigate()
  // definining the initial state as an object of username and password with empty strings
  const initialState = { username: "", password: ""}
  // defining the state of the input and setting it to initial state username/pw
  const [input, setInput] = useState(initialState)

  // event handler for submitted login
  const handleLogin=async(e)=>{
    e.preventDefault()
    const createdUserToken = await login(input)

    if(createdUserToken){navigate(`/listings`);}
    else{navigate("/auth/login/")}
		setInput(initialState);
  };

  // save new state with password and value on event change
  const handleChange=(e)=>{setInput({ ...input, [e.target.name]: e.target.value });};

  return (
    <section className='gridWrapper'>
      <div className='welcomeContainer'>
        <h2>Login</h2>
        <div className="loginRegister">
          <form onSubmit={handleLogin}>
            <input id="username"
                  name="username"
                  placeholder="Username.."
                  value={input.username}
                  onChange={handleChange}/>
            <br />
            <br />
            <input id="password"
                  name="password"
                  placeholder="Password.."
                  type="password"
                  value={input.password}
                  onChange={handleChange}/>
            <br />
            <br />
            <div className='welcomeSubmitButtonContainer'>
              <input className="welcomeSubmitButton" type="submit" value="login" />
            </div>
          </form>
        </div>
        <Link to='/register' className="loginOrRegister">
          <div>Don't have an account?  <span className='registerTxt' >Sign Up</span></div>
        </Link> 
      </div>
    </section>
  )
}
