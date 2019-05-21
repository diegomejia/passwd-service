"use strict";

//Library requirements
const express = require('express');
const fs = require('fs');
const readFile = require('fs-readfile-promise');

// Variables
const app = express();
const port = 2000;
let passwd = { buffer: "default value",
               location: "/etc/passwd"
             };

// Function Definitions
let logPortNumber = function(){
  console.log('passwd_service listening on port ' + port.toString());
};

let readCallback = function(error, data){
  if(error) {
     throw error;
  } else {
    passwd.buffer = data;
  }
};

let serviceGetRequest = function(request, response){
  //fs.readFile(passwd.location, {encoding: 'utf-8', flag: 'r'}, readCallback);

   let file = readFile(passwd.location, 'utf-8').then(
     function(data){
       let tmpDataBuffer = "";

       let passwdArray = data.split("\n");
       let filteredPasswdArray = [];
       passwdArray.forEach(function(line){
         //remove comments(lines beginning with '#') and any empty lines
         if(line.charAt(0) != "#" && line != ""){
            filteredPasswdArray.push(line);
        }
       });

       let filteredUsersArray = [];
       // Expected format for each line, 7 values
       // username:password:user_id:group_id:user_id_info:home_directory:shell
       filteredPasswdArray.forEach(function(line){
         let values = [];
         let user = {
           name: "",
           uid: "",
           gid: "",
           comment: "",
           home: "",
           shell: ""
         };
         values = line.split(":"); //passwd and group files are colon delimited
         if(values.length == 7){
           //construct users object
           user.name = values[0];
           // skip password field values[1]
           user.uid = values[2];
           user.gid = values[3];
           user.comment = values[4];
           user.home = values[5];
           user.shell = values[6];

           //push onto Object array
           filteredUsersArray.push(user);
         }
       });
       tmpDataBuffer = JSON.stringify(filteredUsersArray);
       //console.log(data);
       passwd.buffer = tmpDataBuffer;
       return tmpDataBuffer;
     }
   ).catch( function(err){
     console.log("Error attempting to read file. Location does not exist.")
     return "Error: Error attempting to read file. Location does not exist.";
   } );
   // if(file != null){
   //   debugger;
   //   console.log(file);
   // }
  response.send(passwd.buffer);
};

let serviceUsersRequest = function(request, response){
  // Scaffolding..
  response.send('Users Request Received.')
};
// Function Calls
// Open and read file with UTF-8 encoding
//fs.readFile(passwd.location, {encoding:'utf-8', flag:'r'}, readCallback);

app.get('/', serviceGetRequest);
app.get('/users', serviceUsersRequest);

app.listen(port, logPortNumber);
