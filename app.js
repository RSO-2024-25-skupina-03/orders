import express from 'express';
import bodyParser from 'body-parser';

/**
 * Swagger and OpenAPI
 */
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


/**
 * Database connection
 */
import "./api/models/db.js";




/**
 * Create server
 * default port 3000
 */
const port = process.env.PORT || 3000;
const app = express();

import cors from 'cors';
if (process.env.NODE_ENV === 'test') {
    console.log('Running in test environment');
    app.use(cors());
}


// Create swagger.json file
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const swaggerJsonPath = path.join(__dirname, 'swagger.json');
// fs.writeFileSync(swaggerJsonPath, JSON.stringify(swaggerDocument, null, 2), 'utf-8');
// console.log(`Swagger JSON file created at ${swaggerJsonPath}`);

// middleware
// log the request method and URL for every request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

/**
 * Body parser (application/x-www-form-urlencoded)
 * must be before the routes
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * API routing
 */
import apiRouter from "./api/routes/api.js";
import swaggerRouter, { forwardedPrefixSwagger, getSwaggerOptions } from "./api/routes/swaggerRouter.js";
app.use("/", apiRouter);
app.use("/", swaggerRouter);

// Middleware to redirect /docs to /docs/
app.use('/docs', (req, res, next) => {
    if (req.originalUrl === '/docs') {
        res.redirect('/docs/');
    } else {
        next();
    }
});

// Use Swagger UI
app.use('/docs', forwardedPrefixSwagger, swaggerUi.serve, (req, res, next) => {
    const swaggerOptions = getSwaggerOptions(req);
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    swaggerUi.setup(swaggerDocs, {
        customCss: '.swagger-ui .topbar { display: none }',
    })(req, res, next);
});

// Say hello world when user visits the root URL
app.get('/', (req, res) => {
    res.send('Hello, this is the root URL of the microservice Orders. Swagger is available at /docs');
});


// Error handling middleware
// should be added after all other routes and middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


// listen for requests on port 
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Graceful shutdown
import { gracefulShutdown } from "./api/models/db.js";

const shutdown = (msg) => {
    console.log(`${msg} signal received: closing HTTP server Orders`);
    server.close(() => {
        console.log('HTTP server closed');
        // Call the gracefulShutdown function from db.js
        gracefulShutdown(msg, () => process.exit(0));
    });
};

process.on('SIGTERM', () => shutdown('Cloud-based app shutdown (SIGTERM)'));
process.on('SIGINT', () => shutdown('app termination (SIGINT)'));
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => process.kill(process.pid, 'SIGUSR2'));
});