# passwd-service

Toy problem not intended for any professional or malicious use.
Only for an interesting problem to solve and be evaluated.

Responds to root server call with contents of /etc/passwd and /etc/group depending on query strings.
Run at your own risk.

Requires NodeJS to be installed.
Can be found here: 
https://nodejs.org/en/

Next clone or download the passwd-service project.
To run the local server (port 2000) open a terminal, go to passwd-service folder and run:
```
node index.js
```
This will try to read information from "/etc/passwd" and "/etc/group" by default depending on the request.

To set the paths of the passwd and group file locations manually use the command line options
```
-passwd /path/to/passwd_file
-group /path/to/group_file
```
Both absolute and relative file paths are accepted:
```
node index.js -passwd /Users/user1/Desktop/passwdTestfFile -group /Users/user1/Desktop/groupTestFile
```
or
```
node index.js -passwd sampleFiles/passwd -group sampleFiles/group
```
The port the server runs on is also configurable with a command line option -port (2000 by default):
```
node index.js -port 5000
passwd_service listening on port 5000
```
"passwd_service listening on port XXXX"
Is printed in the terminal to verify the (ExpressJS) server is running and listening for GET requests.

To send a request open a web browser and go to http://localhost:2000/ (or the port you've set)

To STOP the server hit Ctrl-C in the terminal window running it.

# Running Unit Tests

This module comes with the NightwatchJS test runner, and the ChromeDriver NPM modules installed and configured for use.

The tests base their expected results on the sampleFiles/passwd and sampleFiles/group text files, formatted the way a system file would be. Before running the tests with Nightwatch first make sure there is an instance of passwd-service running with the sample files loaded like so:

```
node index.js -passwd sampleFiles/passwd  -group sampleFiles/group
```

To run tests using sampleFiles/passwd and sampleFiles/group for expected results open a new terminal window navigate to the top level of the project directory and run:

```
node ./node_modules/.bin/nightwatch tests
```

This will run through all the currently written unit tests by opening up Chrome windows, going to the specified URLs and checking for specific JSON output in the page body.

To run an individual test file at a time navigate to the tests directory and run:
```
node ../node_modules/.bin/nightwatch testModule.js
```

XML Test results are saved in tests_output directory.
