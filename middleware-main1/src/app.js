const express = require('express');
const bodyParser = require('body-parser');
const ticketRoutes = require('./routes/ticketRoutes');
const sequelize = require('./db/database');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/api', ticketRoutes);


sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((error) => {
  console.error('Error syncing database:', error);
});
