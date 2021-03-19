import React, { useState } from "react";
import "./FlightSearch.css";
import Flights from "./Flights";

function FlightSearch() {
  const [flightsInfo, setFlightsInfo] = useState({});
  const [originPlace, setOriginPlace] = useState(""); // must be one of valid PlaceId
  const [destinationPlace, setDestinationPlace] = useState(""); // must be one of valid PlaceId
  const [outboundPartialDate, setOutboundPartialDate] = useState("");
  const [inboundPartialDate, setInboundPartialDate] = useState("");
  const [showFlights, setShowFlights] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const [currencySelected, setCurrencySelected] = useState("USD");
  const [sortByCheapest, setSortByCheapest] = useState(0);

  if (currencyList.length === 0) {
    // fetch list of valid currencies
    fetch(
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/currencies",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let temp = [];
        data.Currencies.forEach((e) =>
          temp.push({ label: e.Code, value: e.Code })
        );
        setCurrencyList(temp);
        return;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    async function fetchMyAPI() {
      const reqOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      };

      const linkResponse = await fetch(
        `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${encodeURIComponent(
          currencySelected
        )}/en-US/${encodeURIComponent(
          originPlace + "-sky"
        )}/${encodeURIComponent(
          destinationPlace + "-sky"
        )}/${encodeURIComponent(outboundPartialDate)}/${encodeURIComponent(
          inboundPartialDate
        )}`,
        reqOptions
      );

      // sort quotes generated 
      let linkResult = await linkResponse.json();
      console.log(linkResult);
      try {
        linkResult.Quotes.sort(function (a, b) {
          if (sortByCheapest == 1) {
            return b.MinPrice - a.MinPrice;
          }
          return a.MinPrice - b.MinPrice;
        });
      setFlightsInfo(linkResult);
      }
      catch(err) {
        return null
      }
    }

    fetchMyAPI().then((r) => setShowFlights(true));
  }

  return (
    <div className="flightsearch">
      <form onSubmit={handleSubmit}>
        <label htmlFor="originPlace">From: </label>
        <input
          id="originPlace"
          placeholder= 'Place ID(SFO)'
          value={originPlace}
          onChange={(e) => setOriginPlace(e.target.value)}
          required
        />
        <label htmlFor="destinationPlace"> To: </label>
        <input
          id="destinationPlace"
          placeholder= 'Place ID(LAX)'
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
        <label htmlFor="currency"> Currency: </label>

        <select
          id="currency"
          value={currencySelected}
          onChange={(e) => setCurrencySelected(e.target.value)}
        >
          {currencyList.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>

        <label htmlFor="sortBy"> Price: </label>

        <select
          id="sortpicker"
          value={sortByCheapest}
          onChange={(e) => setSortByCheapest(e.target.value)}
        >
          <option value={0}>{"Lowest"}</option>
          <option value={1}>{"Highest"}</option>
        </select>

        <button className="search">Submit</button>
      </form>
      {showFlights ? <Flights flights={flightsInfo}></Flights> : <></>}
    </div>
  );
}

export default FlightSearch;
