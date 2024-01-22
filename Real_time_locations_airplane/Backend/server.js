const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

const port = 3000;


// Database connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "signup"
})


// User signup route
app.post('/signup',(req,res)=>{
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const values =[
        req.body.name,
        req.body.email,
        req.body.password
    ]
    // Execute the SQL query
    db.query(sql,[values], (err,data)=>{
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    })
})

// Login route
app.post('/login',(req,res)=>{
    const sql = "SELECT * FROM login WHERE `email`=? AND `password` =?";
    db.query(sql,[req.body.email,req.body.password], (err,data)=>{
        if(err){
            // Handle database query error
            return res.json("Error");
        }
        // Check if there is a user with the provided email and password
        if (data.length > 0){
            // User authentication successful
            return res.json("Success");
        } else {
            // User authentication failed
            return res.json("Faile");
        }
    })
})


// Check email existence route
app.post('/check-email', (req, res) => {
    const sql = 'SELECT COUNT(*) as count FROM login WHERE `email`=?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            // Handle database query error
            console.error('Error executing check-email query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if data array is empty or doesn't contain expected structure
        if (!Array.isArray(data) || data.length === 0 || typeof data[0].count !== 'number') {
            console.error('Invalid data structure received from the database');
            return res.status(500).json({ error: 'Invalid Database Response' });
        }
        // Check if the email already exists
        const emailExists = data[0].count > 0;
        return res.json({ exists: emailExists });
    });
});




// CORS headers (this should come after defining routes)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Real-time flights route
app.get('/Real_Time_Flights', async (req, res) => {
    try {
        const api_key = "9a9f49de-cb91-4b48-9ce6-a42df4aef004";
        const api_base = "https://airlabs.co/api/v9/flights?_view=array&_fields=hex,flag,lat,lng,dir,alt,flight_iata";
        const response = await axios.get(api_base, { params: { api_key } });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});