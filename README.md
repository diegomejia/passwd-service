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

node index.js

"passwd-service listening on port 2000"

Is printed in the terminal to verify the (ExpressJS) server is running and listening for GET requests.

To send a request open a web browser and go to http://localhost:2000/

To STOP the server hit Ctrl-C in the terminal window running it.
