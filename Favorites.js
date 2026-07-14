import React, { useEffect, useState } from "react";

function Favorites() {
  const [fav, setFav] = useState([]);

  useEffect(() => {
    setFav(JSON.parse(localStorage.getItem("fav")) || []);
  }, []);

  return (
    <div>
      <h3>❤️ Favorites</h3>

      <div className="row">
        {fav.map((m) => (
          <div className="col-md-3">
            <div className="card mb-3">
              <img src={m.Poster} />
              <div className="card-body text-center">
                <h5>{m.Title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;