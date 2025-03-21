# NYT Crossword Clone - Client

The client component is built with React and Vite.

## Documentation

This component is documented using JSDoc. To get the documentation, follow one of the two following options:

### Option 1: Command-line arguments to JSDoc

1. Run the following command:
```
./node_modules/.bin/jsdoc src -r -d docs -R "README.md"
```

2. In the ``node_modules\jsdoc\conf.json.EXAMPLE`` file, add the following section to the ``defaults`` property of the ``templates`` section: 
```
"staticFiles": {
    "include": ["./demo.png"]
}
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

