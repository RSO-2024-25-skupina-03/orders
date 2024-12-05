import express from 'express';

/**
 * Swagger and OpenAPI
 */
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = swaggerJsDoc({
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Demo",
            version: "0.1.0",
            description:
                "API for the microservice Orders",
        },
        tags: [
            {
                name: "Order",
                description: "Product order",
            }
        ],
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Development server for testing",
            },
            // {
            //     url: "https://sp-2024-2025.fly.dev/api",
            //     description: "Production server",
            // },
        ],
        components: {
            schemas: {
                // Codelist: {
                //     type: "string",
                //     description:
                //         "Allowed values for the codelist used in filtering locations.",
                //     enum: [
                //         "category",
                //         "type",
                //         "keywords",
                //         "institution",
                //         "municipality",
                //         "fields",
                //     ],
                // },
                ErrorMessage: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Message describing the error.",
                        },
                    },
                    required: ["message"],
                },
            },
        },
    },
    apis: ["./api/models/*.js", "./api/controllers/*.js"],
});
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


// Use Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
}));

// Serve Swagger JSON
app.get('/api/swagger.json', (req, res) => {
    res.status(200).json(swaggerDocument);
});

/**
 * API routing
 */
import apiRouter from "./api/routes/api.js";
app.use("/api", apiRouter);

/**
 * Swagger file and explorer
 */
// apiRouter.get("/swagger.json", (req, res) =>
//     res.status(200).json(swaggerDocument)
// );
// apiRouter.use(
//     "/docs",
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerDocument, {
//         customCss: ".swagger-ui .topbar { display: none }",
//     })
// );


// Say hello world when user visits the root URL
app.get('/', (req, res) => {
    res.send('Hello, this is the root URL of the microservice Orders');
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

