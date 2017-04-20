var express     = require('express');
var Cookies     = require("cookies");
var dateFormat  = require('dateformat');
const db        = require('../functions/database');

module.exports = {
  getSenderName: function(senderId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Firstname
                  FROM User
                  WHERE UserID = ?`, 
                [senderId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found: getSenderName');
                    console.log(results);
                    reject();
                  }
                  else{
                    resolve(results[0].Firstname);
                  }
                });
    });
  },

  getRecipientInfo: function(recipientId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Firstname, Surname, ProfileImage, IsAdmin, IsSuspended
                  FROM User
                  WHERE UserID = ?`, 
                [recipientId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found: getRecipientName');
                    console.log(results);
                    reject("User not found");
                  }
                  else{
                    resolve(results[0]);
                  }
                });
    });
  },

  getPreviousMessages: function(fromId, toID) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Contents, TimeSent, User.FirstName AS FromName
                  FROM Chat
                  JOIN User
                  ON User.UserID = Chat.FromId
                  WHERE (FromId = ? AND ToID = ?)
                  OR    (ToID = ? AND FromId = ?)
                  ORDER BY TimeSent ASC`, 
                [fromId, toID, fromId, toID], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else{
                    results.map(function(r) { 
                      r.Day      =  dateFormat(r.TimeSent, "dddd dS mmmm");
                      r.TimeSent =  dateFormat(r.TimeSent, "HH:MM");
                      return r;
                    });
                    resolve(results);
                  }
                });
    });
  },

  getPreviousConversations: function(userId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Chat.Contents, Chat.TimeSent, User.Firstname, User.Surname, User.UserID, User.ProfileImage
                  FROM Chat
                  JOIN User
                  ON Chat.FromID = User.UserID OR Chat.ToID = User.UserID
                  WHERE MessageID IN (
                    SELECT MAX(MessageID)
                    FROM (
                        SELECT FromID As UserID, MessageID
                        FROM Chat
                        WHERE ToID = 4
                      UNION
                        SELECT ToID As UserID , MessageID 
                        FROM Chat
                        WHERE FromID = 4
                    ) AS msg
                    GROUP BY msg.UserID
                  )
                  GROUP BY User.UserID;`,
                [userId, userId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else{
                    results.map(function(r) { 
                      r.Day      =  dateFormat(r.TimeSent, "dddd dS mmmm");
                      r.TimeSent =  dateFormat(r.TimeSent, "HH:MM");
                      return r;
                    });
                    resolve(results);
                  }
                });
    });
  },

  saveMessage: function(from, to, contents, timeSent) {
    return new Promise(function(resolve, reject) {
        db.query(`INSERT INTO Chat (MessageID, FromID, ToID, Contents, TimeSent)
                  VALUES (0, ?, ?, ?, ?)`, 
                [from, to, contents, timeSent], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else if (results.length == 0) {
                    console.log('Chat insert failed');
                    console.log(results);
                    reject('Chat insert failed');
                  }
                  else{
                    resolve(results);
                  }
                });
    });
  },

  searchUsers: function(name) {
      return new Promise(function(resolve, reject) {
          db.query(`Select * FROM User
                    WHERE MATCH(Firstname, Surname) 
                          AGAINST(? IN BOOLEAN MODE)`, 
                  [name], 
                  function (error, results, fields) {
                    if (error) { 
                      console.log(error); 
                      reject(error);
                    }
                    else{
                      resolve(results);
                    }
                  });
      });
    }
}