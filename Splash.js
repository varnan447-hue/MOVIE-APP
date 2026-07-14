import React, { useEffect } from "react";

function Splash({ onFinish }) {
  useEffect(() => {
    setTimeout(() => {
     if (onFinish) onFinish();
    }, 2000);
  }, [onFinish]);

  return (
    <div className="splash">
      <h1 className="logo">MOVIE APP</h1>
      <div className="loader"></div>
    </div>
  );
}

export default Splash;