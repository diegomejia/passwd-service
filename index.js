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
let group = { location: "/etc/group"};

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

let serviceGetGroupsRequest = function(request, response){
  let tmpDataBuffer = "";
  let file = readFile(group.location, 'utf-8').then(
       function(data){
         let groupsArray = data.split("\n");
         let filteredGroupsArray = [];
         groupsArray.forEach(function(line){
           //remove comments(lines beginning with '#') and any empty lines
           if(line.charAt(0) != "#" && line != ""){
              filteredGroupsArray.push(line);
          }
         });

         let objectifiedGroupsArray = []
         // Expected format for each line, 4 values
         // name:password:group_id:group_members
         filteredGroupsArray.forEach(function(line){
           let values = [];
           let groups = {
             name: "",
             gid: "",
             members: []
           };
           let groupMembers = "";

           values = line.split(":"); //passwd and group files are colon delimited
           if(values.length == 4){
             //construct users object
             groups.name = values[0];
             // skip password field values[1]
             groups.gid = values[2];
             //push onto Object array
             if(values[3].includes(",")){
               groupMembers = values[3].split(",")
               groups.members = groupMembers;
             }
             objectifiedGroupsArray.push(groups);
           }
         });
         tmpDataBuffer = JSON.stringify(objectifiedGroupsArray);
         return tmpDataBuffer;
       }
     ).catch( function(err){
       tmpDataBuffer = "Error attempting to read file. Location does not exist.";
       return tmpDataBuffer;
     }).finally(function(){
       response.send(tmpDataBuffer);
     });
};

let serviceGetGroupsQueryRequest = function(request, response){
  let tmpDataBuffer = "";
  let file = readFile(group.location, 'utf-8').then(
       function(data){
         let groupsArray = data.split("\n");
         let filteredGroupsArray = [];
         groupsArray.forEach(function(line){
           //remove comments(lines beginning with '#') and any empty lines
           if(line.charAt(0) != "#" && line != ""){
              filteredGroupsArray.push(line);
          }
         });

         let objectifiedGroupsArray = []
         // Expected format for each line, 4 values
         // name:password:group_id:group_members
         filteredGroupsArray.forEach(function(line){
           let values = [];
           let groups = {
             name: "",
             gid: "",
             members: []
           };
           let groupMembers = "";

           values = line.split(":"); //passwd and group files are colon delimited
           if(values.length == 4){
             //construct users object
             groups.name = values[0];
             // skip password field values[1]
             groups.gid = values[2];
             //push onto Object array
             if(values[3].includes(",")){
               groupMembers = values[3].split(",")
               groups.members = groupMembers;
             }

             //push onto Object array based on queries
             let queries = response.req.query;
             let queryFlag = false;

             //Must check every query parameter individually for existence.
             if(queries && queries.name == values[0]){
               queryFlag = true;
               if(queries.gid && values[2] != queries.gid){
                 queryFlag = false;
               }
               if(queries.member && groups.members.length != 0){
                 if(Array.isArray(queries.member)){
                   //More than one member query request
                   queries.member.forEach(function(member){
                     if(!groups.members.includes(member)){
                       queryFlag = false;
                     }
                   });
                 } else if( typeof queries.member == "string"){
                   if(!groups.members.includes(queries.member)){
                     queryFlag = false;
                   }
                 }
               }
             }

             if(queries && queries.gid == values[2]){
               queryFlag = true;
               if(queries.name && queries.name != values[0]){
                 queryFlag = false;
               }
               if(queries.member && groups.members.length != 0){
                 if(Array.isArray(queries.member)){
                   //More than one member query request
                   queries.member.forEach(function(member){
                     if(!groups.members.includes(member)){
                       queryFlag = false;
                     }
                   });
                 } else if( typeof queries.member == "string"){
                   if(!groups.members.includes(queries.member)){
                     queryFlag = false;
                   }
                 }
               }
             }

             if(queries && queries.member && groups.members.length != 0){
               if(Array.isArray(queries.member)){
                 let ticks = 0;
                 queries.member.forEach(function(member){
                   if(groups.members.includes(member)){
                     ticks++;
                   }
                   queryFlag = ticks == queries.member.length ? true : false;
                 });
               } else if( typeof queries.member == "string"){
                 if(groups.members.includes(queries.member)){
                   queryFlag = true;
                 }
                 if(queries.name && queries.name != values[0]){
                   queryFlag = false;
                 }
                 if(queries.gid && queries.gid != values[2]){
                   queryFlag = false;
                 }
               }
             }

             if( queryFlag ){
               objectifiedGroupsArray.push(groups);
             }

           }
         });
         tmpDataBuffer = JSON.stringify(objectifiedGroupsArray);
         return tmpDataBuffer;
       }
     ).catch( function(err){
       tmpDataBuffer = "Error attempting to read file. Location does not exist.";
       return tmpDataBuffer;
     }).finally(function(){
       response.send(tmpDataBuffer);
     });
};

let serviceGetGroupsGidRequest = function(request, response){
  //Scaffolding
  response.send("Received Groups GID Request");
};

// Function Calls
// Open and read file with UTF-8 encoding
//fs.readFile(passwd.location, {encoding:'utf-8', flag:'r'}, readCallback);

app.get('/', serviceGetRequest);
app.get('/users', serviceUsersRequest);
app.get('/users/query', serviceGetUsersQueryRequest);
app.get(/\/users\/\-*\d+/, serviceGetUsersUidRequest);
app.get('/groups', serviceGetGroupsRequest);
app.get('/groups/query', serviceGetGroupsQueryRequest);
app.get(/\/groups\/\-*\d+/, serviceGetGroupsGidRequest);

app.listen(port, logPortNumber);
