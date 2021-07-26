const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors({origin: '*'}));

app.get('*', express.static('./dist'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`App start on port ${port}`);
});
