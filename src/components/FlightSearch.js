import React, { useState } from "react";
import "./FlightSearch.css";
import Flights from "./Flights";

// get api key from env file
const API_KEY = process.env.REACT_APP_API_KEY;


function FlightSearch() {
  const [flightsInfo, setFlightsInfo] = useState({});
  const [originPlace, setOriginPlace] = useState(""); // must be one of valid PlaceId
  const [destinationPlace, setDestinationPlace] = useState(""); // must be one of valid PlaceId
  const [outboundPartialDate, setOutboundPartialDate] = useState("");
  const [inboundPartialDate, setInboundPartialDate] = useState("");
  const [showFlights, setShowFlights] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    async function fetchMyAPI() {
      const reqOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "8e6b478235msh794d79dac0c98e3p1b6440jsnb32c209b38dc",
          "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      };

    const linkResponse = await fetch(
    `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${encodeURIComponent(
        originPlace + "-sky")}/${encodeURIComponent(destinationPlace + "-sky")}/${encodeURIComponent(outboundPartialDate)}/${encodeURIComponent(inboundPartialDate)}`, reqOptions);
    const linkResult = await linkResponse.json();
    console.log(linkResult)
    setFlightsInfo(linkResult);
    }

    fetchMyAPI();
    setShowFlights(true);
    setOriginPlace("");
    setDestinationPlace("");
    setOutboundPartialDate("");
    setInboundPartialDate("");
  }

  return (
    <div className="flightsearch">
      <form onSubmit={handleSubmit}>
        <label htmlFor="originPlace">From: </label>
        <input
          id="originPlace"
          value={originPlace}
          onChange={(e) => setOriginPlace(e.target.value)}
          required
        />
        <label htmlFor="destinationPlace"> To: </label>
        <input
          id="destinationPlace"
          value={destinationPlace}
          onChange={(e) => setDestinationPlace(e.target.value)}
          required
        />
        <label htmlFor="outboundPartialDate"> Depart: </label>
        <input
          id="outboundPartialDate"
          value={outboundPartialDate}
          onChange={(e) => setOutboundPartialDate(e.target.value)}
          type="date"
          required
        /> 
        <label htmlFor="inboundPartialDate"> Return: </label>
        <input
          id="inboundPartialDate"
          value={inboundPartialDate}
          onChange={(e) => setInboundPartialDate(e.target.value)}
          type="date"
        /> 
        <button className="search">Submit</button>
      </form>
      {showFlights ? <Flights flights={flightsInfo}></Flights> : <></>}
    </div>
  );
}


export default FlightSearch;