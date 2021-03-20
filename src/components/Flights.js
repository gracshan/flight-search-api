import "./Flights.css";

function Flights(props) {
  const quotes = props.flights.Quotes;
  const places = props.flights.Places;
  const currencies = props.flights.Currencies;
  const carriers = props.flights.Carriers;

  // return cheapest price in quotes
  function findCheapestPrice () {
    let cheapestPrice = quotes[0].MinPrice;
    for (let i=1; i < quotes.length;i++) {
      if (cheapestPrice > quotes[i].MinPrice) {
          cheapestPrice = (quotes[i].MinPrice);
      }
    }
    return cheapestPrice
  }

  // return price display according to given currency
  function formatCurrency(price) {
    if (currencies[0].SymbolOnLeft) {
      return currencies[0].Symbol + price;
    }
    return price + currencies[0].Symbol;
  }

  // return name of place that has corresponding placeid
  function namePlace(placeid) {
    if (placeid === places[0].PlaceId) {
      return places[0].Name;
    }
    return places[1].Name;
  }

  // return name of carrier that has corresponding carrierid
  function nameCarrier(carrierid) {
    for (let i = 0; i < carriers.length; i++) {
      if (carrierid === carriers[i].CarrierId) {
        return carriers[i].Name;
      }
    }
  }

  // return true if quote has inbound leg, false otherwise
  function checkInbound() {
    if ("InboundLeg" in quotes[0]) {
      return true;
    }
    return false;
  }

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
            quotes.map((quote) => {
              return (
                <tr 
                id={"tableinput"} 
                key={quote.QuoteId} 
                style={
                  quote.MinPrice === findCheapestPrice()
                    ? { backgroundColor: "#FFD700" }
                    : { backgroundColor: "#FFFFFF" }
                }
                >
                  <th>{namePlace(quote.OutboundLeg.OriginId)}</th>
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
