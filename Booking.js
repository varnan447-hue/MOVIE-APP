import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Booking() {
  const { title } = useParams();

  const [name, setName] = useState("");
  const [seats, setSeats] = useState("");
  const [time, setTime] = useState("");

  async function handleBooking() {
    if (!name || !seats || !time) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: title,
          name: name,
          seats: seats,
          time: time,
        }),
      });

      const data = await res.json();

      alert(
        `${data.message}\n\nAllocated Seats:\n${data.allocatedSeats.join(", ")}`
      );

      // Clear form
      setName("");
      setSeats("");
      setTime("");

    } catch (error) {
      alert("Backend not running!");
      console.log(error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 text-center">

        <h2>🎬 {title}</h2>

        <input
          className="form-control mt-3"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mt-3"
          placeholder="Number of Seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />

        <select
          className="form-control mt-3"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="">Select Time</option>
          <option>10:00 AM</option>
          <option>2:00 PM</option>
          <option>6:00 PM</option>
          <option>9:00 PM</option>
        </select>

        <button
          className="btn btn-success mt-3"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>

      </div>
    </div>
  );
}

export default Booking;