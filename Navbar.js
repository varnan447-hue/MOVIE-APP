import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {

  const [text, setText] = useState("");
  const navigate = useNavigate();


  function handleSearch() {

    if (!text.trim()) return;

    onSearch(text);

  }


  return (
    <div className="navbar">

      <h2>Movie App</h2>


      <input
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Search movie..."
        onKeyDown={(e)=>{
          if(e.key==="Enter")
            handleSearch();
        }}
      />


      <button onClick={handleSearch}>
        Search
      </button>


      <button onClick={()=>navigate("/bookings")}>
        📋 Booking History
      </button>


      <button onClick={()=>navigate("/statistics")}>
        📊 Stats
      </button>


      <button
        onClick={()=>{
          localStorage.removeItem("loggedIn");
          window.location.reload();
        }}
      >
        Logout
      </button>


    </div>
  );
}


export default Navbar;