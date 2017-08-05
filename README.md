# Voting App

A NodeJS server-side rendered voting app where :
* As an authenticated user you can :
1. Keep polls and come back later to access them
2. Share polls with friends
3. See aggregate results of polls
4. Delete polls
5. Create poll with any number of possible items
6. If you don't like options on a poll, create a new option

* As an un-authenticated user :
1. See and vote on everyone's polls
2. Either auth and un-authed users can view results of polls in chart form

* The app is live at [https://vote4it.herokuapp.com](https://vote4it.herokuapp.com)
![voting-app](http://res.cloudinary.com/dd6kwd0zn/image/upload/q_auto/v1501921130/Screenshot_2017-08-05_01.17.25_zizsky.png)
## Dependencies
* Back-end
1. mongoDB / mongoose
2. express
3. ejs
4. passport
5. dotenv
6. morgan

* Front-end
1. chartJS
2. jQuery
3. bootstrap 3.x

## How to install
* create '.env' configuration file and fill up the corresponding values after registering the app in twitter
```
MONGODB_URI=
TWITTER_KEY=
TWITTER_SECRET=
TWITTER_CALLBACK=
```
* `npm start`

## Model
```
user
+----> id
+----> username
+----> someId

user_vote
+----> id
+----> user.id
+----> poll.id

poll
+----> id
+----> user.id  // user.id that owns the poll
+----> question

poll-options
+----> id
+----> poll.id // poll that owns options
+----> option
+----> count

ip-address
+----> id
+----> ip-address
+----> poll.id
```
## pages
1. index.ejs - homepage / login
2. all_polls.ejs - polls
3. vote_poll.ejs - vote poll
4. edit_delete.ejs - edit / delete poll
5. add.ejs - add poll
6. my_polls.ejs - my polls

## To Do
* refactor to ES6 standards
* refactor routes
* Generate boilerplate code for future projects

## Author
Neptune Michael Cabelin

## License
MIT
