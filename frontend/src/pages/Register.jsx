import { useState } from 'react';

import API from '../api/axios';

import { useNavigate } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post('/auth/register', form);

      navigate('/login');

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-container">

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;