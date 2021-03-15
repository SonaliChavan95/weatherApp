const http = require('http');
const fs = require('fs').promises;
const api = require('./data/api');

const port = process.env.PORT || 3000;
const host = 'localhost';

// Regex for validating city names for presence of digits and special chars
const isValid = (str) => !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?\d]/g.test(str);

// Load CSS file
const loadCSS = async (req, res) => {
  const cssFile = await fs.readFile(
    `${__dirname}/public/css/index.css`,
    { encoding: 'utf8' },
  );

  res.writeHead(200, { 'Content-type': 'text/css' });
  res.end(cssFile);
};

// Load JS file
const loadJS = async (req, res) => {
  const cssFile = await fs.readFile(
    `${__dirname}/public/js/custom.js`,
    { encoding: 'utf8' },
  );

  res.writeHead(200, { 'Content-type': 'text/js' });
  res.end(cssFile);
};

// Load Home page
const home = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const contents = await fs.readFile(`${__dirname}/views/index.html`);

      res.writeHead(200, { 'Content-Type': 'text/html' }); // sets the header of the response
      res.end(contents);
      return;
    } catch (error) {
      res.writeHead(500);
      res.end(error);
    }
  }
};

// POST request to fetch single city weather
const singleCityWeather = async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    // Fetch request body
    req.on('data', async (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const cityName = JSON.parse(body).city;

      // Validate input city name for digits and special chars
      if (!cityName || typeof cityName !== 'string' || cityName.trim().length === 0 || !isValid(cityName)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: `Sorry, "${cityName}" is an invalid city, please try another`,
        }));
        return;
      }

      try {
        const data = await api.getCityWeather(cityName);

        res.writeHead(200, { 'Content-Type': 'application/json' }); // sets the header of the response
        res.end(JSON.stringify({ city: data.name, data: api.formatCityResponse(data) }));
        return;
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Sorry, ${cityName} was not found, please try another` }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Page not found' }));
  }
};

// POST request to fetch multiple cities weather
const multipleCitiesWeather = async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    // Fetch request body
    req.on('data', async (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const cityNames = JSON.parse(body).cities;
      const data = await api.getMultipleCityWeather(cityNames);
      res.writeHead(200, { 'Content-Type': 'application/json' }); // sets the header of the response
      res.end(JSON.stringify({ data }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Page not found' }));
  }
};

const requestListener = async (req, res) => {
  // fetch original path from request url
  const originalPath = req.url.match('^[^?]*')[0];

  switch (originalPath) {
    case '/public/css/index.css': {
      loadCSS(req, res);
      break;
    }
    case '/public/js/custom.js': {
      loadJS(req, res);
      break;
    }
    case '/': {
      home(req, res);
      break;
    }
    case '/my-weather-app/single-search': {
      singleCityWeather(req, res);
      break;
    }
    case '/my-weather-app/multiple-search': {
      multipleCitiesWeather(req, res);
      break;
    }
    default: {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Page not found' }));
    }
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
