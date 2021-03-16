import React, { useState } from "react";
import "./Flights.css";

function Flights(props) {
  const quotes = props.flights.Quotes;
  const places = props.flights.Places;
  const currencies = props.flights.Currencies;
  const carriers = props.flights.Carriers;
  const [cheapestPrice, setCheapestPrice] = useState(0);

  //to-do: get cheapest price
  if (quotes != null && cheapestPrice == -1) {
    setCheapestPrice(quotes[0].MinPrice);
  }

  function formatCurrency(price) {
    if (currencies[0].SymbolOnLeft) {
      return currencies[0].Symbol + price;
    }
    return price + currencies[0].Symbol;
  }

  function namePlace(placeid) {
    if (placeid === places[0].PlaceID) {
      return places[0].Name;
    }
    return places[1].Name;
  }

  function nameCarrier(carrierid) {
    for (let i = 0; i < carriers.length; i++) {
      if (carrierid === carriers[i].CarrierId) {
        return carriers[i].Name;
      }
    }
  }

  function checkInbound() {
    if ("InboundLeg" in quotes[0]) {
      return true;
    }
    return false;
  }

  //to-do: allow users to sort by price
  //highlight cheapest price
  //map sortedList
  return (
    <div className="quotes">
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Price</th>
            <th>Depart</th>
            <th>Return</th>
            <th>Carrier</th>
          </tr>
        </thead>
        <tbody>
          {quotes != null ? (
            sortedList.map((quote) => {
              return (
                <tr 
                id={"tableinput"} 
                key={quote.QuoteId} 
                style={
                  quote.MinPrice === quotes[0].MinPrice
                    ? { backgroundColor: "#FFD700" }
                    : { backgroundColor: "#FFFFFF" }
                }
                >
                  <th>{namePlace(quote.OutboundLeg.OriginID)}</th>
                  <th>{namePlace(quote.OutboundLeg.DestinationId)}</th>
                  <th>{formatCurrency(quote.MinPrice)}</th>
                  <th>{quote.OutboundLeg.DepartureDate.split("T")[0]}</th>
                  <th>
                    {checkInbound()
                      ? quote.InboundLeg.DepartureDate.split("T")[0]
                      : "N/A"}
                  </th>
                  <th>{nameCarrier(quote.OutboundLeg.CarrierIds[0])}</th>
                </tr>
              );
            })
          ) : (
            <div>No results available.</div>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Flights;
