import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function Booking() {
  const { title } = useParams();
  const [name, setName] = useState("");
  const [theater, setTheater] = useState("");
  const [date, setDate] = useState("2026-10-31");
  const [time, setTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentValue, setPaymentValue] = useState("");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const theaters = [
    {
      name: "PVR Phoenix",
      screens: ["Screen 1", "Screen 3"],
    },
    {
      name: "INOX Central",
      screens: ["Screen 2", "Screen 4"],
    },
    {
      name: "Carnival Cinemas",
      screens: ["Screen 1", "Screen 2"],
    },
  ];

  const showtimes = ["10:00 AM", "1:30 PM", "6:00 PM", "9:30 PM"];
  const bookedSeats = ["A1", "A2", "B6", "C4", "D8", "E5"];
  const seatRows = ["A", "B", "C", "D", "E"];
  const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

  const selectedTheater = theaters.find((item) => item.name === theater);
  const seatTotal = selectedSeats.length;
  const convenienceFee = seatTotal ? 30 : 0;
  const total = seatTotal * 200 + convenienceFee;

  const minimumPaymentValue = useMemo(() => {
    return paymentMethod === "upi";
  }, [paymentMethod]);

  async function handleBooking() {
    if (!name.trim() || !theater || !time || !selectedSeats.length) {
      alert("Name, theater, showtime aur seats select karein.");
      return;
    }

    if (!paymentValue.trim() && minimumPaymentValue) {
      alert("UPI ID enter karein.");
      return;
    }

    try {
      setPaying(true);
      const res = await fetch("http://127.0.0.1:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: title,
          name: name.trim(),
          seats: String(selectedSeats.length),
          time,
          theater,
          date,
          showtime: time,
          selectedSeats,
          screen: selectedTheater.screens[0],
          paymentMethod,
          paymentStatus: "Paid",
          amount: total,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.allocatedSeats) {
        throw new Error(data.message || "Booking failed");
      }

      setConfirmed({
        ...data,
        theater,
        screen: selectedTheater.screens[0],
        date,
        time,
        amount: total,
      });
      setName("");
      setSelectedSeats([]);
      setTime("");
    } catch (error) {
      alert(error.message || "Backend not running!");
    } finally {
      setPaying(false);
    }
  }

  function toggleSeat(seat) {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat]
    );
  }

  if (confirmed) {
    return (
      <div className="booking-page">
        <div className="booking-card booking-success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful</h2>
          <p>Your movie booking is confirmed.</p>
          <div className="success-details">
            <strong>{title}</strong>
            <span>{confirmed.theater} • {confirmed.screen}</span>
            <span>{confirmed.date} • {confirmed.time}</span>
            <span>Seats: {confirmed.allocatedSeats.join(", ")}</span>
            <span>Amount paid: ₹{confirmed.amount}</span>
          </div>
          <button type="button" onClick={() => setConfirmed(null)}>
            Book Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-card">
        <h2>🎬 {title}</h2>
        <div className="booking-layout">
          <div className="booking-main">
            <section className="booking-section">
              <h3>1. Book details</h3>
              <input
                className="booking-input"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="booking-label">
                Theater
                <select
                  className="booking-input"
                  value={theater}
                  onChange={(e) => {
                    setTheater(e.target.value);
                    setSelectedSeats([]);
                  }}
                >
                  <option value="">Select Theater</option>
                  {theaters.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
              {selectedTheater && (
                <p className="screen-name">
                  {selectedTheater.screens[0]} • {selectedTheater.screens[1]}
                </p>
              )}
              <label className="booking-label">
                Date
                <input
                  className="booking-input"
                  type="date"
                  min="2026-10-30"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <div>
                <span className="booking-label">Showtime</span>
                <div className="choice-grid">
                  {showtimes.map((showtime) => (
                    <button
                      type="button"
                      className={time === showtime ? "choice active" : "choice"}
                      key={showtime}
                      onClick={() => setTime(showtime)}
                    >
                      {showtime}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {theater && time && (
              <section className="booking-section">
                <h3>2. Select seats</h3>
                <div className="screen-line">SCREEN</div>
                <div className="seat-map">
                  {seatRows.map((row) => (
                    <div className="seat-row" key={row}>
                      <span>{row}</span>
                      {seatNumbers.map((number) => {
                        const seat = `${row}${number}`;
                        const unavailable = bookedSeats.includes(seat);
                        const selected = selectedSeats.includes(seat);
                        return (
                          <button
                            type="button"
                            className={`seat ${unavailable ? "unavailable" : ""} ${selected ? "selected" : ""}`}
                            disabled={unavailable}
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            aria-label={`Seat ${seat}`}
                          >
                            {number}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="seat-legend">
                  <span><i className="legend-seat" /> Available</span>
                  <span><i className="legend-seat selected" /> Selected</span>
                  <span><i className="legend-seat unavailable" /> Booked</span>
                </div>
              </section>
            )}
          </div>

          {selectedSeats.length > 0 && (
            <aside className="checkout-panel">
              <h3>3. Checkout</h3>
              <p><span>Seats</span><strong>{selectedSeats.join(", ")}</strong></p>
              <p><span>Ticket ({seatTotal} × ₹200)</span><strong>₹{seatTotal * 200}</strong></p>
              <p><span>Convenience fee</span><strong>₹{convenienceFee}</strong></p>
              <hr />
              <p className="checkout-total"><span>Total</span><strong>₹{total}</strong></p>

              <div className="payment-options">
                <button
                  type="button"
                  className={paymentMethod === "upi" ? "choice active" : "choice"}
                  onClick={() => setPaymentMethod("upi")}
                >
                  UPI
                </button>
                <button
                  type="button"
                  className={paymentMethod === "card" ? "choice active" : "choice"}
                  onClick={() => setPaymentMethod("card")}
                >
                  Card
                </button>
              </div>

              <input
                className="booking-input"
                type={paymentMethod === "card" ? "text" : "text"}
                maxLength={paymentMethod === "card" ? 16 : undefined}
                inputMode={paymentMethod === "card" ? "numeric" : "text"}
                placeholder={paymentMethod === "upi" ? "UPI ID (example@upi)" : "Demo card number"}
                value={paymentValue}
                onChange={(e) => setPaymentValue(e.target.value)}
              />
              <button className="pay-button" type="button" disabled={paying} onClick={handleBooking}>
                {paying ? "Processing..." : `Pay ₹${total}`}
              </button>
              <small>This project uses a demo payment checkout.</small>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;