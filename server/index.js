const express = require('express');

const app = express();
app.get('*', express.static('./dist'));
app.use('/calendar/', express.static('./dist'));
app.use('/users/', express.static('./dist'));
app.use('/results/', express.static('./dist'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`App start on port ${port}`);
});