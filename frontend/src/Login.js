import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Login() {
  const navigate = useNavigate();

  const[data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
    
      if (response.data.success) {
        alert('Login successful');

        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/dashboard'); //Debugging: Log the response data
      } else {
        alert('Login failed: ' + response.data.message);
      }
    } catch (error) {
      alert("server error");
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={login} className='box'>
       <h2>Login</h2>

        <input 
          type="email"
          name="email" 
          autoComplete="emai"
          placeholder="Email" 
          value={data.email} 
          onChange={handleChange} 
          required 
          />

        <input 
          type="password" 
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange} 
          required 
          />
          <button type="submit">Login</button>
      </form>
    </div>
  );
}
