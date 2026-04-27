const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
require('./services/db')
const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-tenant-id");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.resolve("./public")));

app.use('/vehicles', express.static(path.join(__dirname, 'public', 'vehicles')));

global.__basedir = __dirname;

const tenantLookupRoutes = require('./routes/tenantLookupRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const userRoutes = require('./routes/userRoutes')
const passwordRoutes = require('./routes/passwordRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const promocodeRoutes = require('./routes/promocodeRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const bookingIdRoutes = require('./routes/bookingIdRoutes')
const timeRoutes = require('./routes/timeRoutes')
const privacypolicyRoutes = require('./routes/privacypolicyRoutes')
const financialRoutes = require('./routes/financialRoutes')
const addressRoutes = require('./routes/addressRoutes')
const accountRoutes = require('./routes/accountRoutes')
const storedEmailRoutes = require('./routes/storedemailRoutes')
const shuttlePricingRoutes = require('./routes/shuttlePricingRoutes')
const serviceManagementRoutes = require('./routes/serviceManagementRoutes')

app.use('/tenant', tenantLookupRoutes)
app.use('/vehicle', vehicleRoutes)
app.use('/booking', bookingRoutes)
app.use('/user', userRoutes)
app.use('/password', passwordRoutes)
app.use('/service', serviceRoutes)
app.use('/promocode', promocodeRoutes)
app.use('/payment',paymentRoutes)
app.use('/bookingId',bookingIdRoutes)
app.use('/time', timeRoutes)
app.use('/privacy',privacypolicyRoutes)
app.use('/financial', financialRoutes)
app.use('/address', addressRoutes)
app.use('/account', accountRoutes)
app.use('/stored-emails', storedEmailRoutes)
app.use("/shuttle-pricing", shuttlePricingRoutes);
app.use("/service-management", serviceManagementRoutes)

const hostname = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 7000;


app.listen(port, hostname, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
  
  module.exports = app;