// 8 11 queries necessary to be implemented
const mysql = require('mysql')
const config = require('./config.json')

const limit = 12;

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});

connection.connect((err) => err && console.log(err));

//Route 1: search the business with several conditions
const business_search = async function(req, res) {
    const city = req.query.city ?? '';
    const state = req.query.state ?? '';
    const stars = req.query.stars ? Number(req.query.stars) : 0;
    const review_count = req.query.review_count ?? 0;
    const category = req.query.category ?? '';
    const page = req.query.page ?? 1;
    const is_open = req.query.is_open ?? '';
    const name = req.query.search_name ?? '';
    
    let query = `
        SELECT b.business_id, name, address, city, state, stars, review_count, GROUP_CONCAT(DISTINCT c.category SEPARATOR ', ') AS categories, is_open
        FROM YELP_BUSINESS b
        JOIN BUSINESS_CATEGORY c ON b.business_id = c.business_id
        JOIN YELP_CHECKIN ci ON b.business_id = ci.business_id
        WHERE b.city LIKE '%${city}%' AND b.stars >= ${stars} AND b.review_count >= ${review_count} AND c.category LIKE '%${category}%'
        AND b.state LIKE '%${state}%' AND b.name LIKE '%${name}%'
    `;
    
    if (is_open != ""){
        if(is_open === "true"){
            query += ` AND b.is_open = 1`;
        }else{
            query += ` AND b.is_open = 0`;
        }
    }
    
    if (req.query.weekday) { query += ` AND ci.weekday = '${req.query.weekday}'`; }
    if (req.query.hour) { query += ` AND ci.hour = '${req.query.hour}'`; }

    query += ' GROUP BY b.business_id, b.name, b.address, b.city, b.state, b.stars, b.review_count, b.is_open';

    if (req.query.sortByStar || req.query.sortByReviewCount || req.query.sortByCheckin) {
        query += ' ORDER BY ';
        if (req.query.sortByStar) { query += `b.stars ${req.query.sortByStar}`; }
        if (req.query.sortByReviewCount) { query += `b.review_count ${req.query.sortByReviewCount}`; }
        if (req.query.sortByCheckin) { query += `ci.checkins ${req.query.sortByCheckin}`; }
    }

    query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    //query += ` LIMIT 10000 OFFSET ${(page - 1) * limit}`;
    connection.query(query, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(200).json({});
            }else{
                res.status(200).json({ data });
            }
        }
    });
}

// Route 2: Find review by business to display on each business page:
const business_review = async function(req, res) {
    const businessId = req.params.business_id;
    const page = req.query.page ?? 1;

    let query = `
        SELECT r.text, r.date, r.likes
        FROM YELP_TIP r
        JOIN YELP_BUSINESS b
        ON b.business_id = r.business_id
        WHERE b.business_id = '${businessId}'
    `;

    // let query = `
    //     SELECT r.text, r.date, r.likes
    //     FROM YELP_TIP r, YELP_BUSINESS b
    //     WHERE b.business_id = r.business_id AND
    //     b.business_id = '${businessId}'
    // `;

    if (req.query.date || req.query.like) {
        query += ' ORDER BY ';
        if (req.query.date) { query += `r.date ${req.query.date}`; }
        if (req.query.like) { query += `r.likes ${req.query.like}`; }
    }

    query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

    console.log(query);
    
    connection.query(query, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            res.status(200).json({ data });
        }
    });
}

// Route 3: Find all reviews by user_id to display on each user page
const user_review = async function(req, res) {
    const userId = req.params.user_id;
    const page = req.query.page ?? 1;
    const limit = 10; 

    let orderBy = [];
    const validSortFields = ['date', 'likes']; // Allowed fields to sort by
    const validSortOrders = ['ASC', 'DESC']; // Allowed sort orders

    // Validate and build order by clause
    validSortFields.forEach(field => {
        const order = req.query[field];
        if (order && validSortOrders.includes(order.toUpperCase())) {
            orderBy.push(`t.${field} ${order.toUpperCase()}`);
        }
    });

    let query = `
        SELECT tip_id, text, u.user_id, u.name, date, likes, u.yelping_since, u.average_stars
        FROM YELP_TIP t
        JOIN YELP_USER u ON t.user_id = u.user_id
        WHERE u.user_id = ?`;

    // Append ORDER BY clause if any valid sort conditions were provided
    if (orderBy.length > 0) {
        query += ` ORDER BY ${orderBy.join(', ')}`;
    }


    //query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

    //query += ` LIMIT ? OFFSET ?;`;


    // Execute the query safely
    connection.query(query, [userId, limit, (page - 1) * limit], (err, data) => {
        if (err) {
            return res.status(500).json({ err });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }
        res.status(200).json({ data });
    });
};


//Route 4: search the business based on the business name
const business_name_search = async function(req, res) {
    const name = req.params.search_name;
    const page = req.query.page ?? 1;
    const is_open = req.query.is_open ?? 'true';

    let query = `
        SELECT name, address, city, state, stars, review_count, GROUP_CONCAT(DISTINCT c.category SEPARATOR ', ') AS categories, checkins 
        FROM YELP_BUSINESS b
        JOIN BUSINESS_CATEGORY c ON b.business_id = c.business_id
        JOIN YELP_CHECKIN ci ON b.business_id = ci.business_id
        WHERE name LIKE '%${name}%' AND b.is_open = ${is_open}
    `;

    query += 'GROUP BY b.name, b.address, b.city, b.state, b.stars, b.review_count, ci.checkins';

    if (req.query.weekday) { query += ` AND ci.weekday = '${req.query.weekday}'`; }
    if (req.query.hour) { query += ` AND ci.hour = '${req.query.hour}'`; }

    if (req.query.sortByStar || req.query.sortByReviewCount || req.query.sortByCheckin) {
        query += ' ORDER BY ';
        if (req.query.sortByStar) { query += `b.stars ${req.query.sortByStar}`; }
        if (req.query.sortByReviewCount) { query += `b.review_count ${req.query.sortByReviewCount}`; }
        if (req.query.sortByCheckin) { query += `ci.checkins ${req.query.sortByCheckin}`; }
    }

    query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit};`;

    connection.query(query, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No instance found"
                });
            }
            res.status(200).json({ data });
        }
    });
}

//Route 5: search the business based on the business id
const business_id_search = async function(req, res) {
    const id = req.params.business_id
    connection.query(`SELECT name, city, state, stars, review_count, is_open, address, GROUP_CONCAT(DISTINCT c.category SEPARATOR ', ') AS categories FROM YELP_BUSINESS b
    JOIN BUSINESS_CATEGORY c ON b.business_id = c.business_id
    WHERE b.business_id = '${id}'
    GROUP BY b.name, b.business_id, b.city, b.state, b.stars, b.review_count, b.is_open, b.address`, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No instance found"
                });
            }
            res.status(200).json({ data });
        }
    });
}

// Route 6: Find influential user to display on main page
const influential_user = async function(req, res) {
    connection.query(`
        WITH review_count AS(
            SELECT user_id, COUNT(*) num_review
            FROM YELP_TIP
            GROUP BY user_id
            ORDER BY COUNT(*) DESC
            LIMIT 10)
        SELECT user.user_id, user.name, review_count.num_review
        FROM YELP.YELP_USER user JOIN review_count ON user.user_id = review_count.user_id
    `, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No instance found"
                });
            }
            res.status(200).json({ data });
        }
    });
}

//Route 7 update like views
const liked_views = async function(req, res){
    const business_id = req.params.business_id;
    const user_id = req.params.user_id;

    const query = `UPDATE YELP_TIP SET likes = likes + 1 WHERE business_id = ${business_id} AND user_id = ${user_id};`;

    connection.query(query, (err)=>{
        if (err) { res.status(500).json({ err })} 
        else {
            res.status(200).json({ 
                message: "Update successfully"
             });
        }
    });
}

// Route 8: Find recent activity (reviews) to display on main page
const recent_review = async function(req, res) {
    let query = `WITH recent_reviews AS (
        SELECT r.tip_id, r.text, r.date, r.likes, r.business_id, r.user_id
        FROM YELP_TIP r
        ORDER BY r.date DESC
        LIMIT 6)
    SELECT u.name AS UserName, b.name AS BusinessName, b.stars, recent_reviews.text, recent_reviews.date
    FROM recent_reviews 
    JOIN YELP_BUSINESS b
    ON recent_reviews.business_id = b.business_id
    JOIN YELP_USER u
    ON recent_reviews.user_id = u.user_id;`;

    let slow_query = `
    SELECT u.name AS UserName, b.name AS BusinessName, b.stars, recent_reviews.text, recent_reviews.date
    FROM (
        SELECT r.tip_id, r.text, r.date, r.likes, r.business_id, r.user_id
        FROM YELP_TIP r
        ORDER BY r.date DESC
        LIMIT 6) recent_reviews 
    JOIN YELP_BUSINESS b
    ON recent_reviews.business_id = b.business_id
    JOIN YELP_USER u
    ON recent_reviews.user_id = u.user_id;`;

    connection.query(slow_query, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            res.status(200).json({ data });
        }
    });
}

// Route 9: Track business popularity by finding number of reviews per month
const business_popularity = async function(req, res) {
    const businessId = req.params.business_id;
   
    connection.query(`
        SELECT DATE_FORMAT(date, '%m') AS month,
        COUNT(*) AS num_reviews
        FROM YELP_TIP
        WHERE business_id = '${businessId}'
        GROUP BY DATE_FORMAT(date, '%m')
        ORDER BY DATE_FORMAT(date, '%m');
    `, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No instance found"
                });
            }
            res.status(200).json({ data });
        }
    });
}

// Route 10: Find rush hour for a certain business
const rush_hour = async function(req, res) {
    const businessId = req.params.business_id;
    
    connection.query(`
        SELECT SUM(checkins) AS total_checkin,weekday,hour
        FROM YELP_CHECKIN
        WHERE YELP_CHECKIN.business_id='${businessId}'
        GROUP BY weekday, hour
        ORDER BY CASE weekday
        WHEN 'Mon' THEN 1
        WHEN 'Tue' THEN 2
        WHEN 'Wed' THEN 3
        WHEN 'Thu' THEN 4
        WHEN 'Fri' THEN 5
        WHEN 'Sat' THEN 6
        WHEN 'Sun' THEN 7
        END, hour;
    `, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No instance found"
                });
            }
            res.status(200).json({ data });
        }
    });
  }

// Route 11: Find the area in a city where this area has the most number of specific type of business
const num_business_in_area = async function(req, res) {
    const state = req.params.state;
    const category = req.params.category;

    connection.query(`
        WITH tmp0 AS (
            SELECT COUNT(*) AS total, state
            FROM YELP_BUSINESS
                JOIN BUSINESS_CATEGORY BC ON YELP_BUSINESS.business_id = BC.business_id
            WHERE category LIKE '%${category}%'
            GROUP BY state),
        tmp AS (
            SELECT state, city, YELP_BUSINESS.business_id
            FROM YELP_BUSINESS
                JOIN BUSINESS_CATEGORY BC ON YELP_BUSINESS.business_id = BC.business_id
            WHERE category LIKE '%${category}%' AND state = '${state}'),
        tmp1 AS (
            SELECT COUNT(*) AS num, COUNT(*) / tmp0.total AS percent, city
            FROM tmp
                JOIN tmp0 ON tmp0.state = tmp.state
            GROUP BY tmp.city
            ORDER BY num DESC)
        SELECT * FROM tmp1
    `, (err, data) => {
        if (err) { res.status(500).json({ err })} 
        else {
            if (data.length === 0) {
                res.status(404).json({
                    message: "No instance found"
                });
            }
            res.status(200).json({ data });
        }
    });
}

// //search the categories or business_id with several conditions
// const category_search = async function(req, res) {
//     var id = req.query.business_id ?? '';
//     var category = req.query.category ?? '';
//     var tempStr = 'Health & Medical';
//     console.log(encodeURIComponent(tempStr));
//     var query = '';
//     if(req.query.business_id == undefined && req.query.category == undefined){
//         console.log("both are undefined");
//         res.json();
//         return;
//     }else if(req.query.business_id != undefined){
//         query = 'select category from BUSINESS_CATEGORY where business_id = \'' + id + '\'';
//     }else if(req.query.category != undefined){
//         query = 'select DISTINCT business_id from BUSINESS_CATEGORY where category = \'' + category + '\'';
//     }
//     console.log(query)
//     connection.query(query, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.json(err);
//         } else {
//             res.json(data);
//         }
//     });
// }

// // used for testing server build
// const businesscount = async function(req, res) {
//     connection.query(`select COUNT(*) from YELP_BUSINESS`, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.json(err);
//         } else if(data.length === 0){
//             res.json(err);
//         } else {
//             res.json(data[0]);
//         }
//     });
// }

// // display the business rank by stars
// const business = async function(req, res) {
//     connection.query(`select * from YELP_BUSINESS order by stars desc`, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.json(err);
//         } else {
//             res.json(data);
//         }
//     });
// }

// //search the checkin times given 
// const checkin_search = async function(req, res){
//     var business_id = req.params.business_id;
//     var weekday = req.query.weekday;
//     var hour = req.query.hour;
//     var query = 'select * from YELP_CHECKIN where business_id = \'' + business_id + '\'';
//     if(weekday != undefined){
//         query += ' and weekday = \'' + weekday + '\'';
//     }
//     if(hour != undefined){
//         query += ' and hour = \'' + hour + '\'';
//     }
//     connection.query(query,(err, data)=>{
//         if (err){
//             console.log(err);
//             res.json(err);
//         }else{
//             res.json(data);
//         }
//     });
// }

module.exports = {
    business_name_search,
    business_id_search,
    business_search,
    business_review,
    user_review,
    influential_user,
    recent_review,
    business_popularity,
    rush_hour,
    num_business_in_area,
    liked_views
}