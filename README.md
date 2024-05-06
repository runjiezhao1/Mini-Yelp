# CIS550 Project

## Group Member
Haitian Zhou, Jiakun Xiang, Runjie Zhao, Yujia Xu

## Description
A Yelp-like business reviews and recommendation web application, where the user can search for their desired restaurant, hotel, shopping, entertainment or other business facilities by various parameters like category, rating, popularity, distance, etc.

## Instruction
1. ```git clone``` current repo to a local folder.
2. create two local terminals where on is inside ```server``` folder while another one is inside ```client``` folder.
3. type ```npm install``` in both terminals.
4. run ```npm start``` in server terminal and then run ```npm start``` in client terminal.
5. if you want to do automated unit test on the backend(server side), run command ```npm test -- app.test.js``` in server terminal.

## Server URI Description
1. ```/business```: return all columns in ```yelp_business``` order by stars in descending order<br />
2. ```/business_search```: return all columns in ```yelp_business``` with conditions in query. For example, ```/business_search?id=123&name=louie&address=chestnut&city=philadelphia&state=pa&stars=4.0&review_count=1``` will return all columns where id is ```123```, likes ```louie```, address likes ```chestnut```, city likes ```philadelphia```, state likes ```pa```, stars greater than or equal ```4.0``` and review count greater than or equal to ```1```.<br />
3. ```/category_search```: return either business_id or categories. If the query only include business_id, then it will return categories of the business. If the query only include category type, then it will return the corresponding business. Othewise, return err. For example, ```/category_search?business_id=123``` will return categories of business ```123```. ```/category_search?category=Food``` will return distinct business_ids who have category ```Food```. (Notice: In the client side, we need to use ```encodeURIComponent(str)``` function to encode the category name).<br />

## Code Structure
.gitignore <br />
| data <br />
----| raw_data <br />
-------- hotel_review.csv<br />
-------- yelp_business.csv<br />
-------- yelp_checkin.csv<br />
-------- yelp_tip.checkin.csv<br />
-------- yelp_tip.csv<br />
-------- yelp_user.csv<br />
----| cleaned_data<br />
| preprocess<br />
---- preprocess_yelp_user.py<br />
---- preprocess_yelp_tip.py<br />
---- preprocess_yelp_business.py<br />
---- preprocess_yelp_checkin.py<br />
---- test.py<br />
| server<br />
---- package-lock.json<br />
---- package.json<br />
---- .gitignore<br />
---- routes.js<br />
---- server.js<br />

## Code Notice
Apply ```encodeURIComponent(str)``` before putting parameters into the URI to avoid the situation where you need something like ' ', '&' and '/' signs<br />