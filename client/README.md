# NYT Crossword Clone

## About the Project

![Project Screenshot](demo.png)

The ``client`` directory of this project contains the React application used to power the front-end of the application.

The "Installation" and "Usage" instructions below can be used to run the front-end of the application by itself, however, it must be run concurrently with the Node.js backend to function properly (see ``README.md`` in the root directory for instructions).

## Built With
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## Getting Started

### Prerequisites

+ Node.js
+ NPM

### Installation

1. Clone the project using 
```
git clone https://github.com/alicia4550/nyt-crossword.git
```

2. Navigate to the project's ``client`` directory.

3. Run the following command:
```
npm install
```

### Usage

1. Navigate to the project's ``client``  directory.

2. Run the following command:
```
npm run dev
```

3. Open `http://localhost:5173/` in your local browser.

## Documentation

This project is documented using JSDoc. To get the documentation, follow one of the two following options in the current (``client``) directory:

### Option 1: Command-line arguments to JSDoc

1. In the ``node_modules\jsdoc\conf.json.EXAMPLE`` file, add the following section to the ``defaults`` property of the ``templates`` section: 
```
"staticFiles": {
    "include": ["./demo.png"]
}
```

2. Run the following command:
```
./node_modules/.bin/jsdoc src -r -d docs -R "README.md"
```

3. Navigate to the ``docs`` directory and open the ``index.html`` file.

### Option 2: Configuring JSDoc with a configuration file

1. In the ``node_modules\jsdoc\conf.json.EXAMPLE`` file, add the following section:
```
"opts": {
    "recurse": true,
    "readme": "README.md",
    "destination": "./docs/"
}
```
2. In the ``node_modules\jsdoc\conf.json.EXAMPLE`` file, add the following section to the ``defaults`` property of the ``templates`` section: 
```
"staticFiles": {
    "include": ["./demo.png"]
}
```

3. Run the following command:
```
./node_modules/.bin/jsdoc src
```

4. Navigate to the ``docs`` directory and open the ``index.html`` file.