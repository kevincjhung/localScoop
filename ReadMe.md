## Git Fork workflow 

step1: push your(Yasmina) code to your GitHub **Yasmina** branch

step2: merger your code on your GitHub **Yasmina** branch to your GitHub **develop** branch.

step3:after solved the conflict in your gitbub. Pull a request from your GitHub **develop** to the **IDSP develop** branch

step4:merge the **IDSP develop** to the **IDSP main** weekly.



## Naming Conventions 

variables use camelCase. This includes variables that are related to paths. 
    ex. let theChair = "asdf"

file paths use underscores
    ex. localhost:8080/shopSetup_1

file names also use underscores
    ex. views/shop_setup_7.ejs


## Steps/checklist for setting up Heroku app

* create a repository on github
* create a new app on Heroku
* open jawsDB, get the inputString with the host, database, password and all
* set IS_HEROKU = 1 in your config.vars (in Heroku)
* connect the Heroku app to your github repository
* go to github, clone the repo on your local machine
* put the files you need in the git-folder on your local repo
* open up the code on your local machine, edit databaseConnection.js to include the connection string from jawsDB
* push your code
* open mySQL workbench, create new connection using jawsDB connection string
* create the tables and input the data you need
* localhost to access it locally, heroku to access it online


## S3 Photo Upload
https://www.youtube.com/watch?v=yGYeYJpRWPM&t=1s


## Heroku

// tell heroku to make your current branch the master branch. 
Git push heroku yourCurrentBranchName:master

// push and deploy to main 
git push heroku main:master

// using .env with heroku
https://www.youtube.com/watch?v=1G6e1cqqz3w

  