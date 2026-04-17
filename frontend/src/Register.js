import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      //.env file usage for API URL
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      alert(res.data.message || "Registered Successfully ✅");
      navigate("/");//LOGIN PAGE
    } catch (error) {
      alert(error.response?.data?.message || "Server Error ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Name"
        value={data.name}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
        required
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
        required
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
        required
      />
      <br /><br />
      
        <button type="submit">Register</button>
      </form>
      
      <br /><br />
      <button onClick={() => navigate("/")}>
        Back to Login
      </button>
    </div>
  );
}