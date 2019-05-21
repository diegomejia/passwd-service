"use strict";

//Library requirements
const express = require('express');
const fs = require('fs');
const Promise = require('bluebird');

// Variables
const app = express();
const port = 2000;
let passwd = { buffer: "default value",
               location: "/etc/passwd"
             };

// Function Definitions
let logPortNumber = function(){
  console.log('passwd_service listening on port ' + port.toString())
};

let readCallback = function(error, data){
  if(error) {
     throw error;
  } else {
    passwd.buffer = data;
  }
 }

let serviceGetRequest = function(request, response){
  let passwdPtr = passwd;
  //fs.readFile(passwd.location, {encoding: 'utf-8', flag: 'r'}, readCallback);
  response.send(passwd.buffer);
}

// Function Calls
// Open and read file with UTF-8 encoding
fs.readFile(passwd.location, {encoding:'utf-8', flag:'r'}, readCallback);

app.get('/', serviceGetRequest);

app.listen(port, logPortNumber);

console.log(passwd.buffer);
