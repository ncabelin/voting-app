# Voting App
A NodeJS server-side rendered voting app where :
* As an authenticated user you can :
1. Keep polls and come back later to access theme
2. Share polls with friends
3. See aggregate results of polls
4. Delete polls
5. Create poll with any number of possible items
6. If you don't like options on a poll, create a new option

* As an un-authenticated user :
1. See and vote on everyone's polls
2. Either auth and un-authed users can view results of polls in chart form

## Dependencies
1. mongoDB / mongoose
2. express
3. ejs
4. passport
5. dotenv
6. morgan

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
* Edit / Delete route
* convert Voting form to jQuery submission to enable Ajax notification of ip-address restriction
* Add D3 barchart
* refactor Routes
* Generate boilerplate code for future projects

## Author
Neptune Michael Cabelin

## License
MIT
