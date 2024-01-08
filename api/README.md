# NYT Crossword Clone

## About the Project

The ``api`` directory of this project contains the server API used to power the back-end of the application.

The "Installation" and "Usage" instructions below can be used to run the back-end of the application by itself, but can be run concurrently with the React front-end to interact with the full application (see ``README.md`` in the root directory for instructions).

## Built With
![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## Getting Started

### Prerequisites

+ Node.js
+ NPM

### Installation

1. Clone the project using 
```
git clone https://github.com/alicia4550/nyt-crossword.git
```

2. Navigate to the project's ``api`` directory.

3. Run the following command:
```
npm install
```

### Usage

1. Navigate to the project's ``api`` directory.

2. Run the following command:
```
npm run server
```

3. Open `http://localhost:5000/` in your local browser or run `http://localhost:5000/` in Postman.

## Documentation

This project is documented using JSDoc. To get the documentation, go through the following steps:

1. Open the ``node_modules\jsdoc\conf.json.EXAMPLE`` file.

2. Add the following ``opts`` property:
```
"opts": {
    "recurse": true,
    "readme": "README.md",
    "destination": "./docs/"
}
```

3. Add the following section to the ``source`` property:
```
"exclude": [
    "node_modules"
]
```

4. Run the following command:
```
./node_modules/.bin/jsdoc .
```

5. Navigate to the ``docs`` directory and open the ``index.html`` file.