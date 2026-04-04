import { useState, useContext } from "react"
// import API from "../services/API"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  // const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const res = await API.post("/auth/login", form);
    login(res.data);
    navigate("/listings");
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Login</button>
      </form>
    </div>

  );
}
