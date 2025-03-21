# ?? | 3800-202503-O2P

## About Us
### Team Name: 
O2P
### Team Members: 
* Li, Louise
* Liao, Wei-Yu
* Lok, Ryan
* Melnick, Reece

## Project Description

## Project Technologies
an easy-to-find labeled section called Technologies describes everything the team used for this project. It includes tools, languages, version numbers... everything!

## Docker Compose
docker-compose up -d

## Access Mongo
docker exec -it mongodb_container mongosh -u admin -p password

### Frontend
* HTML5
* CSS3
* JavaScript
* Bootstrap
### Backend:
* NodeJS
* ExpressJS
* EJS
### Database:
* MongoDB Atlas
### Library:
* Mongoose
* BCrypt
* Compression
* Connect-Mongo
* Dotenv
* Express-Session
* Joi
* Openai
* Sharp

## Listing of Files

```
 Top level files of project folder: 
├── .gitignore               # Git ignore file
├── .jest.config.js          # jest config file
├── .eslintrc.js             # Eslint config file
├── .docker-compose.yml      # Docker-compose file
├── Dockerfile               # Dockerfile for StudyGen
├── Dockerfile_mongodb       # Dockerfile for Mongodb replica set
├── generate-keyfile.sh      # Generate key for Mongodb replica set
├── mongo-init.js            # JS script for setting up Mongodb replica set
├── mongod.cong              # Mongodb config file
├── package.json             # npm config file
└── README.md


Top level folders and their subfolders/files:
├── .vscode                  # Folder for vscode config
├── scripts                  # scripts for management
├── src                      # Folder for all static files
    ├── controllers          # Containing controller files
        *.js                 # Controller files
    ├── models 	             # Contains mongoose models
        *.js                 # Mongoose model files
    ├── public               # Contains all client-side folders
          ├── css            # Contains all style sheets
              *.css          # Style sheets for every page
          ├── fonts          # Contains custom font used
              *.otf          
          ├── images         # Contains all image types used
              *.png
              *.gif
              *.svg
              *.jpeg
          ├── music          # Contains all music used
              *.mp3
          ├── scripts        # Contains all client-side JS files
              *.js           # Client-side JS files for each page
    ├── routers              # Contains all router files
        *.js                 # Routers for endpoints
    ├── services             # Contains all service files
        *.js                 # Functions called by controllers
    ├── utilities            # Contains all utility files
        *.js                 # Common utility functions
    ├── views                # Contains all ejs files
          ├── template       # Contains template ejs files
              *.ejs          # Template ejs used by other ejs
        *.ejs                # EJS files for rendering all pages
    ├── expressServer.js     # Express server setup file
    ├── index.js             # Server runtime file
    ├── setupTests.js        # setup file for jest
    ├── setup.sh             # bash file to populate database
├── tests                    #
      ├── controllers        # test for controllers
          .js
      ├── services           # test for services
          .js

```

## Installation
section contains ordered instructions so a new developer can assemble a DEVELOPMENT ENVIRONMENT to contribute, including a list of tools, versions, and configuration instructions, if any. A separate plaintext file contains ids and passwords.

## Features
an easy-to-find labeled section tells us how to use the app and includes a helpful list of features and how to use them.

## Credits
a labeled section provides an organized list of credits, references, and licenses (if you have any). This is where you include a list of all the websites that had helpful code you used in your app. Remember to provide credit where credit is due!
* Easter Egg Confetti Animation - Jonathan Bell - https://codepen.io/jonathanbell/pen/OvYVYw
* Easter Egg Gifs - Palworld
* Easter Egg Music - Slow Jazz Cafe - https://www.youtube.com/watch?v=RelTcUFL8Yk&ab_channel=BGMchannel-Topic
* All footer images - Google Material Symbols & Icons
* All profile icons - Palworld - https://game8.co/games/Palworld
* Logo Icon - Created using Microsoft Copilot
* Streak Fire Image - https://www.svgrepo.com/vectors/fire/
* Logo and Header Fonts - Google Fonts

## AI Usage
Did you use AI to help create your app? If so, how? Be specific. [2 marks]
- We used AI to generate the logo for the application - Microsoft Copilot
- We used AI to understand documentation throughout the development process.
- We used AI to get some ideas on how to approach certain coding problems e.g. "does this functionality I'm thinking of already exist in native JavaScript?". We never just copied and pasted code.
- We used AI at times to help debug our code to see what we were doing wrong (e.g backend errors)
Did you use AI to create data sets or clean data sets? If so, how? Be specific. [ 2 marks]
- No we did not, all mock data was generated by ourselves.
Does your app use AI? If so, how? Be specific. [ 2 marks]
- Yes, the flashcard generation calls on the openai API for GPT-4o model for generating flashcards from text and images.
- GPT4o analyses the text/image and returns flashcard data to the server.
Did you encounter any limitations? What were they, and how did you overcome them? Be specific. [ 2 marks]
- Sometimes when asking AI coding related questions, it does not have enough context on the project to provide an answer suitable for our situation. We overcame this by making sure we include the most important contextual details when prompting.

## Contact Information
Melnick, Reece
* Email
* Phone

Li, Louise
* Email: louiseli.van@gmail.com
* Phone: 604-781-3673

Liao, Wei-Yu
* Email: wyliao76@gmail.com

Lin, Joe
* Email: jyyunlin@gmail.com

Lok, Ryan
* Email: rlok.pc@gmail.com

## launch the server

setup mongodb

fill in /src/.env.local

npm ci

npm run local
