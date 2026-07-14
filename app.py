from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import subprocess


app = Flask(__name__)
CORS(app)


FILE = "bookings.json"


# Create booking file
if not os.path.exists(FILE):
    with open(FILE, "w") as f:
        json.dump([], f)



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
        ["cpp/seat_allocator.exe"],
        input=str(data["seats"]),
        text=True,
        capture_output=True
    )


    allocated_seats = result.stdout.strip().split("\n")


    if allocated_seats == [""]:
        return jsonify({
            "message":"Seats Not Available"
        })


    data["allocatedSeats"] = allocated_seats



    # Read bookings
    with open(FILE,"r") as f:
        bookings = json.load(f)



    bookings.append(data)



    # Save booking
    with open(FILE,"w") as f:
        json.dump(bookings,f,indent=4)



    return jsonify({

        "message":"Booking Saved Successfully",

        "allocatedSeats":allocated_seats

    })




# =========================
# BOOKING HISTORY
# =========================

@app.route("/bookings")
def bookings():

    with open(FILE,"r") as f:
        data=json.load(f)


    return jsonify(data)




# =========================
# CANCEL BOOKING
# =========================

@app.route("/cancel/<int:index>",methods=["DELETE"])
def cancel_booking(index):


    with open(FILE,"r") as f:
        bookings=json.load(f)



    if index < 0 or index >= len(bookings):

        return jsonify({
            "message":"Booking Not Found"
        }),404




    removed = bookings.pop(index)



    with open(FILE,"w") as f:
        json.dump(bookings,f,indent=4)



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

    with open(FILE,"r") as f:
        bookings=json.load(f)



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

    app.run(debug=True)