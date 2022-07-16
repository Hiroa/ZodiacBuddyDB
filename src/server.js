const express = require("express");
const reports = require('./routes/reports');
const swaggerUi = require('swagger-ui-express')
const openApiDocumentation = require('../openApiDocumentation');
const pjson = require('../package.json');

const app = express();
const port = process.env.PORT || 3000;
const sha = process.env.SHA || "Dev";

app.use(express.json());

app.use('/reports', reports)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get('/', (req, res) => {
    res.json({versions: pjson.version, sha: sha});
});

app.listen(port, () => console.log(`ZodiacBuddyDB app V${pjson.version}.${sha} listening on port ${port}!`))

