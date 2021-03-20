# Flight Search Web App

The Web App helps travelers find the cheapest flights for their travels! By providing the origin place, desired destination place, outbound date, inbound date (optional), currency preference, and sorting preference, the user will be able to see the available flights displayed in a table. 


## Deliverables

- Let users view their flight options between two destinations for specific dates
  - Notes: 
    - Input for locations should be a valid 3 or 4 alphabetic code.
    - As directions required specific dates, I chose to display the options through a calendar type. This restricts the input to the format "YYYY-MM-DD", and prevents the usage of the formats "YYYY-MM", "YYYY", or "anytime".
- Allow users to select their currency preference when searching for flights
  - Notes: The default is set to "USD", and the users can change their currency prefernce through the dropdown menu listing all available currencies.
- Use intuitive UI principles to highlight or call out the cheapest flights for a user running a search
  - Notes: The cheapest flight is highlighted gold.
- When all flight options are listed, allow the user to sort the results by cheapest to highest priced & vice versa
  - Notes: The inital default is set to "cheapest", and the users can change the sorting through a drowpdown menu.

## Other notes

- I decided to leave the user input in the text boxes instead of resetting them after each submit. This allows the user to check their inputs and change them easily if needed.
- By setting showFlights to false at the beginning of handeling a sumbit, I was able to create a visual indication that the results have refreshed since the tabel blinks out then back in.

This project was a great introduction to web development and React. I hope you enjoy!
