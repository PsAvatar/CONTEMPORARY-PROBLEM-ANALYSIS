import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Map = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        // Check if the user is logged in
        const loggedIn = sessionStorage.getItem('loggedIn');

        if (loggedIn !== 'true') {
            // Redirect back to the login page if not logged in
            navigate('/');
        }
    }, []);

    const fetchLocations = async () => {
        try {
            // Fetch real-time flight data from the server
            const response = await fetch("http://localhost:3000/Real_Time_Flights");

            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the response into JSON format
            const result = await response.json();
            setLocations(result);
        } catch (error) {
            console.error("Error fetching locations:", error);
            // Log more details if needed, e.g., response.statusText
        }
    };

    useEffect(() => {
        // Fetch locations when the component mounts and set up interval for periodic updates
        fetchLocations().then();
        const intervalId = setInterval(() => {
            fetchLocations().then();
        }, 120000); // Update every 2 minutes
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        // Initialize the map when locations or selectedId change
        if (locations && locations.length > 0) {
            initializeMap(locations);
        }
    }, [locations, selectedId]);

    const handleLocationClick = (id) => {
        // Handle clicks on locations in the table, updating the selectedId state
        setSelectedId(id);
    };

    const initializeMap = (locations) => {
        // Initialize the Bing Maps instance and display airplane locations on the map
        if (!locations || locations.length === 0) {
            console.error("No locations to display on the map.");
            return;
        }

        window.initMap = function () {
            const map = new window.Microsoft.Maps.Map(document.getElementById('mapContainer'), {
                credentials: 'AoCfi36QEPKY2QA9HOuZ4_sYPk1htDDlK6NG8wylvls6UCQrBOvnhX2kp3R3qi72'
            });

            map.setView({ zoom: 4.5 });

            locations.forEach(location => {
                const [id, country, lat, lng, altitude, speed, flight_iata] = location;

                if (isValidLatitude(lat) && isValidLongitude(lng)) {
                    const locationCoords = new window.Microsoft.Maps.Location(lat, lng);

                    const airplaneIcon = new window.Microsoft.Maps.Pushpin(locationCoords, {
                        icon: selectedId === id ? 'src/airplane_red.png' : 'src/airplane_black.png',
                        title: "ID : " + id,
                        subTitle: "Country : " + country + "\nSpeed: " + speed,
                    });

                    airplaneIcon.setOptions({ iconSize: new window.Microsoft.Maps.Size(14, 14) });

                    map.entities.push(airplaneIcon);
                } else {
                    console.error(`Invalid latitude or longitude: ${lat}, ${lng}`);
                }
            });
        };

        const isValidLatitude = (lat) => {
            // Validate latitude value
            return typeof lat === 'number' && !isNaN(lat) && lat >= -90.000000 && lat <= 90.000000;
        };

        const isValidLongitude = (lng) => {
            // Validate longitude value
            return typeof lng === 'number' && !isNaN(lng) && lng >= -180.000000 && lng <= 180.000000;
        };

        // Dynamically load Bing Maps API script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.bing.com/api/maps/mapcontrol?key=AoCfi36QEPKY2QA9HOuZ4_sYPk1htDDlK6NG8wylvls6UCQrBOvnhX2kp3R3qi72&callback=initMap`;

        script.async = true;
        script.defer = true;

        document.head.appendChild(script);
    };

    const handleLogout = () => {
        // Clear user information from sessionStorage and navigate to the login page
        sessionStorage.clear();
        navigate('/');
    };

    const handleSearch = () => {
        // Add logic for searching based on the entered term
        // You can filter the locations array and update the state
    };

    // Filter locations based on search term
    const filteredLocations = locations.filter(location => {
        const id = location[0];
        return id && id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="container">
            <div className="row justify-content-between align-items-center">
                <h1 style={{ marginTop: "5%" }}>Real-time Airplane Locations</h1>
            </div>

            <div id="mapContainer" style={{ height: "400px", marginTop: "3%", border: "4px solid #000" }}></div>

            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>

            <div className="input-group mb-3" style={{ marginTop: "1%" }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search...ID for airplane"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                    Search
                </button>
            </div>

            <div className="table-responsive" style={{ marginTop: "3%" }}>
                <h2>Flight Details</h2>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Country</th>
                        <th>Flight IATA</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredLocations.map((location, index) => (
                        <tr
                            key={index}
                            onMouseEnter={() => setHoveredRowIndex(index)}
                            onMouseLeave={() => setHoveredRowIndex(null)}
                            onClick={() => handleLocationClick(location[0])}
                            className={selectedId === location[0] ? "selected-location" : ""}
                            style={{ fontWeight: hoveredRowIndex === index ? "bold" : "normal" }}
                        >
                            <td>{location[0]}</td>
                            <td>{location[1]}</td>
                            <td>{location[6]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Map;
