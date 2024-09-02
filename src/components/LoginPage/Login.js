import React from 'react';
import './Login.css'; // Assuming you save the CSS in a file called Login.css
import { useState } from 'react';
import axios from 'axios';

function Login() {

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/submit', formData);
      alert(response.data.message);
      setFormData({ name: '', email: '' });
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input className="input" name="name" type="text" placeholder="Name" onChange={handleChange} />
      <input className="input" name="email" type="text" placeholder="E-Mail I.D." onChange={handleChange}/>
      <textarea className="textarea" placeholder="Enter message"></textarea>
      <center>
        <button className="button" type="submit">Submit</button>
      </center>
    </form>
  );
}

export default Login;
