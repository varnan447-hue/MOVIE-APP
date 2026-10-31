import React, { useEffect, useState } from "react";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  async function loadBookings() {
    const res = await fetch("http://127.0.0.1:5000/bookings");
    const data = await res.json();
    setBookings(data);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function cancelBooking(id) {
    await fetch(`http://127.0.0.1:5000/cancel/${id}`, {
      method: "DELETE",
    });

    alert("Booking Cancelled");
    loadBookings();
  }

  return (
    <div className="container mt-4">
      <h2>📋 Booking History</h2>

      {bookings.length === 0 ? (
        <h4>No Bookings Found</h4>
      ) : (
        bookings.map((b) => (
          <div className="card p-3 mt-3" key={b._id}>
            <h4>{b.movie}</h4>

            <p>Name : {b.name}</p>

            <p>Seats : {b.seats}</p>

            <p>Time : {b.time}</p>
            {b.theater && <p>Theater : {b.theater}</p>}
            {b.screen && <p>Screen : {b.screen}</p>}
            {b.paymentStatus && <p>Payment : {b.paymentStatus}</p>}

            <button
              className="btn btn-danger"
              onClick={() => cancelBooking(b._id)}
            >
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Bookings;