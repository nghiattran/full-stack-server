# full-stack-server
> Server service for fullstack package to set up application quickly.

# Why full-stack
> As a developer, you might have several projects that related to web application but starting from scratch every single time is ridiculously time-consuming and boring. full-stack will help you setup the most basic stuffs so that you can focus on the main features for your project.

# Platform
> Python Flask

# What it does
	- Database:
		- MySQL
		- MongoDB
	- Data filter.
	- oAuth integration:
		- Facebook
		- Twitter 
		- Google
		- Github
	- Request limit:
		- Limit number of request made by a user in one minute
	- Email integration:
		- Sendgrid
	- SMS (optional):
		- Twillio

# Package architecture

	├── bin
	│
	├── config
	│   ├── test.json
	│   └── dev.json
	│   
	├── src
	│   ├── controllers
	│	│	├──	Auth	
	│	│	│	├──	Google	
	│	│	│	├──	Facebook	
	│	│	│	├──	Twitter	
	│	│	│	└──	Github	
	│	│	│	
	│	│	└──	User
	│	│	
	│   ├── models
	│	│	└──	User
	│	│	
	│   ├── forms
	│	│	
	│   └── components
	│	    ├── config
	│	    ├── database
	│		    ├── mysql
	│		    └── mongo
	│   
	├── test
	│   └── integration
	│
	└── app.py