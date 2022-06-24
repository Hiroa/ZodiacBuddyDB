const express = require("express");
const reports = require('./routes/reports');
const swaggerUi = require('swagger-ui-express')
const openApiDocumentation = require('../openApiDocumentation');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/reports', reports)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => console.log(`ZodiacBuddyDB app listening on port ${port}!`))

