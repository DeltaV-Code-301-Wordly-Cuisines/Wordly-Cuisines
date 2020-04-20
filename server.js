'use strict';
// required middleware and modules
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const client = require('./utility/database');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(methodOverride('_method'));

// establish server
client.connect()
  .then(() => {
    console.log('PG is listening!');
  })
  .catch((err) => {
    console.error(err);
  });

app.get('*', (request, response) => response.status(404).render('./pages/error-view', {error:'(404) Page not found'}));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

