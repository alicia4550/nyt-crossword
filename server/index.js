const crosswordDataUtils = require('./crosswordDataUtils.js');

const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.get('/api/getCrosswordData', function(req, res) {
    const url = crosswordDataUtils.getUrl();
    crosswordDataUtils.getDataString(url).then((dataString) => {
        const crosswordData = crosswordDataUtils.getCrosswordData(dataString);
        res.json({crosswordData: crosswordData});
    }).catch(console.dir);
});