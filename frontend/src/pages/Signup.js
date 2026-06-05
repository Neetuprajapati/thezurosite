import { useState } from "react";
import axios from "axios";
import theme from "./theme";
import { API_BASE_URL } from "../config/api";

export default function Signup({ goLogin }) {
  const [data, setData] = useState({});

  const submit = async () => {
    const res = await axios.post(`${API_BASE_URL}/signup`, data);
    alert(res.data.message);
  };

  return (
    <div>
      <h2>Signup</h2>

      <input placeholder="Name" onChange={e => setData({...data, full_name: e.target.value})} />
      <input placeholder="Email" onChange={e => setData({...data, email: e.target.value})} />
      <input placeholder="Phone" onChange={e => setData({...data, phone: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setData({...data, password: e.target.value})} />

      <button onClick={submit}>Signup</button>

      <p onClick={goLogin}>Go to Login</p>
    </div>
  );
}