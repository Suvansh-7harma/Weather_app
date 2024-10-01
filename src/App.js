import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(null);
  const [searchHighlightedRow, setSearchHighlightedRow] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]); // Suggestions state

  const cities = ["Las Vegas", "London", "Los Angeles", "New York"];

  // Function to calculate the difference in hours between current time and data_and_time
  const calculateDataAge = (dateAndTime) => {
    const now = new Date();
    const dataTime = new Date(dateAndTime);
    const difference = now - dataTime;
    return Math.floor(difference / (1000 * 60 * 60)); // Convert to hours
  };

  // Function to fetch weather data from the API
  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(
        `https://python3-dot-parul-arena-2.appspot.com/test?cityname=${city}`
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      return {
        city,
        description: data.description,
        temperature: data.temp_in_celsius,
        pressure: data.pressure_in_hPa,
        dataAge: calculateDataAge(data.date_and_time),
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  };

  // Function to handle the "Get Weather" button functionality
  const handleGetWeather = async () => {
    if (currentCityIndex < cities.length) {
      const city = cities[currentCityIndex];
      const weatherData = await fetchWeatherData(city);

      if (weatherData) {
        setTableData((prevData) => [...prevData, weatherData]);
        setCurrentCityIndex((prevIndex) => prevIndex + 1);
        setHighlightedCityIndex(currentCityIndex); // Highlight the current city in the city list
      }
    }
  };

  // Function to handle search and fetch the data if the city is not present
  const handleSearch = async () => {
    if (cityName) {
      // Normalize the user input (trim spaces and convert to lowercase)
      const normalizedCityName = cityName.trim().toLowerCase();

      // Clear city suggestions when search is initiated
      setCitySuggestions([]);

      // Find if the city matches any from the cities list
      const matchedCity = cities.find(
        (city) => city.toLowerCase() === normalizedCityName
      );

      if (matchedCity) {
        // Check if the city is already present in the table
        const existingRowIndex = tableData.findIndex(
          (row) => row.city.toLowerCase() === matchedCity.toLowerCase()
        );

        if (existingRowIndex !== -1) {
          // Highlight the existing city row if found
          setSearchHighlightedRow(existingRowIndex);
          setTimeout(() => setSearchHighlightedRow(null), 3000);
        } else {
          // Fetch weather data for the matched city
          const weatherData = await fetchWeatherData(matchedCity);

          if (weatherData) {
            setTableData((prevData) => [...prevData, weatherData]);
          } else {
            alert("Unable to fetch weather data. Please try again later.");
          }
        }
      } else {
        // Display a message if the city name is not found or incorrect
        alert(
          "City not found. Please check the spelling or select a city from the list."
        );
      }
    } else {
      alert("Please enter a city name.");
    }
  };

  const handleDelete = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  const handleEditDescription = (index, newDescription) => {
    const newData = [...tableData];
    newData[index].description = newDescription;
    setTableData(newData);
  };

  const handleCityNameChange = (e) => {
    const inputValue = e.target.value.trim();
    setCityName(inputValue);

    if (inputValue) {
      const suggestions = cities.filter((city) =>
        city.toLowerCase().startsWith(inputValue.toLowerCase())
      );

      // Optionally, display suggestions in a dropdown or hint area
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]); // Clear suggestions if input is empty
    }
  };

  return (
    <div className="app-container">
      <header className="header">Weather App</header>
      <div className="flex-container">
        {/* Sidebar with Get Weather and City List */}
        <div className="sidebar">
          <button className="get-weather-btn" onClick={handleGetWeather}>
            Get Weather
          </button>
          <div className="city-list">
            <ul>
              {cities.map((city, index) => (
                <li
                  key={index}
                  className={
                    index === highlightedCityIndex ? "highlighted-city" : ""
                  }
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content with Search bar and weather table */}
        <div className="main-content">
          <div className="search-bar-content">
            <div className="search-bar">
              <input
                type="text"
                placeholder="City Name"
                value={cityName}
                onChange={handleCityNameChange}
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
            {/* Show city suggestions */}
            <div className="suggestion">
              {citySuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {citySuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => setCityName(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <table className="weather-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Description</th>
                <th>Temperature</th>
                <th>Pressure</th>
                <th>Data Age (hrs)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No DATA
                  </td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index === searchHighlightedRow ? "highlighted-row" : ""
                    }`}
                  >
                    <td>{row.city}</td>
                    {/* Editable Description Field */}
                    <td>
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleEditDescription(index, e.target.value)
                        }
                      />
                    </td>
                    <td>{row.temperature} °C</td>
                    <td>{row.pressure} hPa</td>
                    <td>{row.dataAge}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
