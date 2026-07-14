import React, {useEffect, useState} from "react";


function Statistics(){

    const [stats,setStats] = useState(null);


    useEffect(()=>{

        fetch("http://127.0.0.1:5000/statistics")
        .then(res=>res.json())
        .then(data=>setStats(data));


    },[]);



    if(!stats)
        return <h2>Loading...</h2>



    return(

        <div className="container mt-5">

            <h2>📊 Booking Statistics</h2>


            <div className="card p-4">

                <h4>
                🎟 Total Bookings :
                {stats.totalBookings}
                </h4>


                <h4>
                💺 Seats Sold :
                {stats.totalSeatsSold}
                </h4>


                <h4>
                💰 Revenue :
                ₹{stats.revenue}
                </h4>


                <h4>
                🎬 Most Booked Movie :
                {stats.mostBookedMovie}
                </h4>


                <h4>
                ⏰ Popular Time :
                {stats.popularTime}
                </h4>


            </div>

        </div>

    )

}


export default Statistics;