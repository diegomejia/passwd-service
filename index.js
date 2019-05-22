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

   // if(file != null){
   //   debugger;
   //   console.log(file);
   // }
  response.send(passwd.buffer);
};

let serviceUsersRequest = function(request, response){
  let tmpDataBuffer = "";
  let file = readFile(passwd.location, 'utf-8').then(
       function(data){
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
       tmpDataBuffer = "Error attempting to read file. Location does not exist.";
       return tmpDataBuffer;
     } ).finally(function(){
       response.send(tmpDataBuffer);
     });
};

let serviceGetUsersQueryRequest = function(request, response){
  let tmpDataBuffer = "default tmpDataBuffer";

  let file = readFile(passwd.location, 'utf-8').then(
       function(data){
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
             let queries = response.req.query;
             let queryFlag = false;

             //Must check every query parameter individually for existence.
             if(queries && queries.name == values[0]){
               queryFlag = true;
               if((queries.uid && values[2] != queries.uid) || (queries.gid && values[3] != queries.gid) ||
                  (queries.comment && values[4] != queries.comment) || (queries.home && values[5] != queries.home) ||
                  (queries.shell && values [6] != queries.shell)){
                 queryFlag = false;
               }
             }
             if(queries && queries.uid == values[2]){
               queryFlag = true;
               if((queries.name && values[0] != queries.name) || (queries.gid && values[3] != queries.gid) ||
                  (queries.comment && values[4] != queries.comment) || (queries.home && values[5] != queries.home) ||
                  (queries.shell && values [6] != queries.shell)){
                 queryFlag = false;
               }
             }
             if(queries && queries.gid == values[3]){
               queryFlag = true;
               if((queries.name && values[0] != queries.name) || (queries.uid && values[2] != queries.uid) ||
                  (queries.comment && values[4] != queries.comment) || (queries.home && values[5] != queries.home) ||
                  (queries.shell && values [6] != queries.shell)){
                 queryFlag = false;
               }
             }
             if(queries && queries.comment == values[4]){
               queryFlag = true;
               if((queries.name && values[0] != queries.name) || (queries.uid && values[2] != queries.uid) ||
                  (queries.gid && values[3] != queries.gid) || (queries.home && values[5] != queries.home) ||
                  (queries.shell && values [6] != queries.shell)){
                 queryFlag = false;
               }
             }
             if(queries && queries.home == values[5]){
               queryFlag = true;
               if((queries.name && values[0] != queries.name) || (queries.uid && values[2] != queries.uid) ||
                  (queries.gid && values[3] != queries.gid) || (queries.comment &&  values[4] != queries.comment) ||
                  (queries.shell &&  values [6] != queries.shell)){
                 queryFlag = false;
               }
             }
             if(queries && queries.shell == values[6]){
               queryFlag = true;
               if((queries.name && values[0] != queries.name) || (queries.uid && values[2] != queries.uid) ||
                  (queries.gid && values[3] != queries.gid) || (queries.comment && values[4] != queries.comment) ||
                  (queries.home && values [5] != queries.home)){
                 queryFlag = false;
               }
             }

             if( queryFlag ){
               filteredUsersArray.push(user);
             }
           }
         });
         tmpDataBuffer = JSON.stringify(filteredUsersArray);
         passwd.buffer = tmpDataBuffer;
         return tmpDataBuffer;
       }
     ).catch( function(err){
       tmpDataBuffer = "Error attempting to read file. Location does not exist.";
       return tmpDataBuffer;
     }).finally(function(){
         //respond with either JSON or No File Error
         response.send(tmpDataBuffer);
     });
  };

let serviceGetUsersUidRequest = function(request, response){
  let tmpDataBuffer = "";
  let file = readFile(passwd.location, 'utf-8').then(
       function(data){
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

             //expected format '/users/<uid>'
             //where <uid> can be any positive or negative integer
             let url = response.req.url;
             let uid = url.slice(url.lastIndexOf('\/')+1); //slice off number
             if(uid == user.uid){
               //push onto Object array
               filteredUsersArray.push(user);
             }
           }
         });
         tmpDataBuffer = JSON.stringify(filteredUsersArray);
         passwd.buffer = tmpDataBuffer;
         return tmpDataBuffer;
       }
     ).catch( function(err){
       tmpDataBuffer = "Error attempting to read file. Location does not exist.";
       return tmpDataBuffer;
     }).finally(function(){
       if(tmpDataBuffer == "[]"){
         response.status(404).send("Error 404: UID not found");
       } else {
         response.send(tmpDataBuffer);
       }
     });
};
// Function Calls
// Open and read file with UTF-8 encoding
//fs.readFile(passwd.location, {encoding:'utf-8', flag:'r'}, readCallback);

app.get('/', serviceGetRequest);
app.get('/users', serviceUsersRequest);
app.get('/users/query', serviceGetUsersQueryRequest);
app.get(/\/users\/\-*\d+/, serviceGetUsersUidRequest);

app.listen(port, logPortNumber);
