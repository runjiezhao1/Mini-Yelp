const express = require('express');
const cors = require('cors');
const config = require('./config');

const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// app.get('/businesscount', routes.businesscount);
// app.get('/business',routes.business);
app.get('/business_name_search/:search_name', routes.business_name_search);
app.get('/business_id_search/:business_id', routes.business_id_search);
app.get('/business_search', routes.business_search);
// app.get('/category_search', routes.category_search);
// app.get('/checkin_search/:business_id',routes.checkin_search);
app.get('/business_review/:business_id', routes.business_review);
app.get('/user_review/:user_id', routes.user_review);
app.get('/influential_user', routes.influential_user);
app.get('/recent_review', routes.recent_review);
app.get('/business_popularity/:business_id', routes.business_popularity);
app.get('/rush_hour/:business_id', routes.rush_hour);
app.get('/num_business_in_area/:state/:category', routes.num_business_in_area);
app.post('/liked_views/:business_id/:user_id', routes.liked_views);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});
  
module.exports = app;