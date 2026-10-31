from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
from pathlib import Path

from bson import ObjectId
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
LEGACY_FILE = BASE_DIR / "bookings.json"

mongo_client = MongoClient(
    os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017"),
    serverSelectionTimeoutMS=5000,
)
bookings_collection = mongo_client[
    os.getenv("MONGO_DB", "movie_app")
]["bookings"]


def serialize_booking(booking):
    booking = dict(booking)
    booking["_id"] = str(booking["_id"])
    return booking


def migrate_legacy_bookings():
    """One-time migration from the old JSON file."""
    if not LEGACY_FILE.exists() or bookings_collection.count_documents({}) > 0:
        return

    import json

    with LEGACY_FILE.open("r", encoding="utf-8") as file:
        bookings = json.load(file)

    if bookings:
        bookings_collection.insert_many(bookings)



@app.route("/")
def home():
    return "Movie Backend Running"



# =========================
# BOOK MOVIE
# =========================

@app.route("/book", methods=["POST"])
def book():

    data = request.json


    # Run C++ Seat Allocator
    result = subprocess.run(
        [str(BASE_DIR / "cpp" / "seat_allocator.exe")],
        input=str(data["seats"]),
        text=True,
        capture_output=True,
        cwd=BASE_DIR,
    )


    allocated_seats = result.stdout.strip().split("\n")


    if allocated_seats == [""]:
        return jsonify({
            "message":"Seats Not Available"
        })


    data["allocatedSeats"] = allocated_seats



    bookings_collection.insert_one(data)



    return jsonify({

        "message":"Booking Saved Successfully",

        "allocatedSeats":allocated_seats

    })




# =========================
# BOOKING HISTORY
# =========================

@app.route("/bookings")
def bookings():
    data = [
        serialize_booking(booking)
        for booking in bookings_collection.find().sort("_id", 1)
    ]
    return jsonify(data)




# =========================
# CANCEL BOOKING
# =========================

@app.route("/cancel/<booking_id>", methods=["DELETE"])
def cancel_booking(booking_id):
    if not ObjectId.is_valid(booking_id):
        return jsonify({
            "message":"Booking Not Found"
        }),404

    removed = bookings_collection.find_one_and_delete({"_id": ObjectId(booking_id)})
    if removed is None:
        return jsonify({
            "message":"Booking Not Found"
        }),404

    return jsonify({
        "message":"Booking Cancelled",
        "cancelledSeats":
        removed.get("allocatedSeats",[])
    })





# =========================
# STATISTICS
# =========================

@app.route("/statistics")
def statistics():
    bookings = list(bookings_collection.find())
    total_bookings = len(bookings)


    total_seats = 0

    revenue = 0


    movie_count = {}

    time_count = {}



    for b in bookings:


        seats = len(
            b.get("allocatedSeats",[])
        )


        total_seats += seats


        # ₹200 per seat
        revenue += seats * 200



        movie = b.get("movie")


        if movie in movie_count:

            movie_count[movie]+=1

        else:

            movie_count[movie]=1




        time = b.get("time")


        if time in time_count:

            time_count[time]+=1

        else:

            time_count[time]=1





    most_movie = (
        max(movie_count,key=movie_count.get)
        if movie_count
        else "None"
    )



    popular_time = (
        max(time_count,key=time_count.get)
        if time_count
        else "None"
    )



    return jsonify({

        "totalBookings":total_bookings,

        "totalSeatsSold":total_seats,

        "revenue":revenue,

        "mostBookedMovie":most_movie,

        "popularTime":popular_time

    })





if __name__=="__main__":
    migrate_legacy_bookings()
    mongo_client.admin.command("ping")

    app.run(debug=True)