import express from 'express';

/**
 * Create server
 * default port 3000
 */
const port = process.env.PORT || 3000;
const app = express();

/**
 * Database connection
 */
import "./api/models/db.js";
/**
 * API routing
 */
import apiRouter from "./api/routes/api.js";
app.use("/api", apiRouter);


// Say hello world when user visits the root URL
app.get('/', (req, res) => {
    res.send('Hello, this is the root URL of the microservice Orders');
});

// listen for form submissions to '/submit-form' and respond accordingly.
app.post('/submit-form', (req, res) => {
    res.send('Form submitted');
  }); 

// middleware
// log the request method and URL for every request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// listen for requests on port 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

