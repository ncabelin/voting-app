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

## Model
```
user
+----> id
+----> username
+----> password
+----> ip-addresses.id array

user_vote
+----> id
+----> user.id
+----> poll.id

poll
+----> id
+----> user.id  // user.id that owns the poll
+----> title
+----> description

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
## Routes

## Author
Neptune Michael Cabelin

## License
MIT
