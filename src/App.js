import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(null);
  const [searchHighlightedRow, setSearchHighlightedRow] = useState(null); // To store the index of the row to highlight
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
      const data = await response.json();
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
      // Check if the city is already present in the table
      const existingRowIndex = tableData.findIndex(
        (row) => row.city.toLowerCase() === cityName.toLowerCase()
      );

      if (existingRowIndex !== -1) {
        // If the city exists, highlight it in yellow for 3 seconds
        setSearchHighlightedRow(existingRowIndex);
        setTimeout(() => setSearchHighlightedRow(null), 3000);
      } else {
        // Fetch weather data for the city entered in the search input
        const weatherData = await fetchWeatherData(cityName);

        if (weatherData) {
          setTableData((prevData) => [...prevData, weatherData]);
        } else {
          alert("Unable to fetch weather data. Please check the city name.");
        }
      }
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
          <div className="search-bar">
            <input
              type="text"
              placeholder="City Name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
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
