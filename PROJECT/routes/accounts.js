var express = require('express');
var router = express.Router();
var Account = require("../models/account");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");



const secret = "secret" //for JWT token

router.post("/create",function (req, res) { //create account route 
    Account.findOne({ username: req.body.username }, function (err, account) { //look for existing account username
        if (err) res.status(401).json({ success: false, err: err });
        else if (account) {
            res.status(401).json({ success: false, msg: "This username already used" }); //return error if found
        }
        else {
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            const newAccount = new Account({ //encrypt 
                username: req.body.username,
                password: passwordHash //store password as encrypted hash
            });
 
            newAccount.save(function (err, account) {
                if (err) {
                    res.status(400).json({ success: false, err: err }); //failed to save to database error 
                }
                else {
                    let msgStr = `Account (${req.body.username}) account has been created.`; //successful creation, return to user 
                    res.status(201).json({ success: true, message: msgStr });
                    console.log(msgStr);
                }
            });
        }
    });
 });

 router.post("/logIn",function (req, res) { //login route
    if (!req.body.username || !req.body.password) {
        res.status(401).json({ error: "Missing username and/or password" }); //fields are empty error 
        return;
    }
    // Find user from the database
    Account.findOne({ username: req.body.username }, function (err, account) {
        if (err) {
            res.status(400).send(err); //error with connecting to database
        }
        else if (account == null) {
            // Username not in the database error, return error to user
            res.status(401).json({ error: "Login failure!!" });
        }
        else {
            if (bcrypt.compareSync(req.body.password, account.password)) {//compare entered password with encrypted stored password
                const token = jwt.encode({ username: account.username }, secret); //encode token AUTH with "secret" defined above 
                
                
                
                res.status(201).json({ success: true, token: token, username: req.body.username, message: "Login success" }); // Send back a token that contains the user's username
                 
            }
            else {
                res.status(401).json({ success: false, message: "Email or password invalid." }); //incorrect details, return error to user 
            }
        }
    });
 });

 router.post('/changepassword',function (req, res){ //change password route 
    if (!req.body.password) {
        res.status(401).json({ error: "Missing password" });
        return; //password field empty,  return error to user 
    }
    if (!req.body.currentuser) {
        res.status(401).json({ error: "Not Logged In" });
        return; //field empty,  return error to user 
    }
    var newpassword = bcrypt.hashSync(req.body.password, 10) //encrypt new password (one way hash)
    Account.findOneAndUpdate({username: req.body.currentuser}, {password: newpassword}, function (err) {//find currently logged in user and change their password to updated HASHED password
        if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ success: false, message: msgStr, err: err });
        }
        else {
            let msgStr = "Password updated" //successful change, return to user 
            res.status(201).json({success: true, message: msgStr });
        }
        
    })
 });

 router.post('/adddevice', function (req, res){ //change password route 
    
    if (!req.body.devicename) {
        res.status(401).json({ error: "Missing device name" });
        return; //field empty,  return error to user 
    }
    if (!req.body.deviceid) {
        res.status(401).json({ error: "Missing device id" });
        return; //field empty,  return error to user 
    }
    if (!req.body.currentuser) {
        res.status(401).json({ error: "Not Logged In" });
        return; //field empty,  return error to user 
    }

    var tempDevice = {devicename: req.body.devicename, deviceid: req.body.deviceid}

    Account.findOne({username: req.body.currentuser}, function (err, account) {//find currently logged in user and add their device
        if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ success: false, message: msgStr, err: err });
        }
        else {
            account.devices.push(tempDevice)
            let msgStr = "Device Added" //successful change, return to user 
            res.status(201).json({success: true, message: msgStr });
        }
        
    })
 });

 router.post('/removedevice', function (req, res){ //change password route 
    
    var found = false

    if (!req.body.removename) {
        res.status(401).json({ error: "Missing device name" });
        return; //field empty,  return error to user 
    }

    if (!req.body.currentuser) {
        res.status(401).json({ error: "Not Logged In" });
        return; //field empty,  return error to user 
    }


    Account.findOne({username: req.body.currentuser}, function (err, account) {//find currently logged in user and add their device
        if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ success: false, message: msgStr, err: err });
        }
        else {
            for (let index = 0; index < account.devices.length; index++) {
                if (account.devices[index].name === req.body.removename) {
                    account.devices.splice(index, 1)
                    found = true; 
                }
                
            }
            if (found === true) {
            let msgStr = "Device Removed" //successful change, return to user 
            res.status(201).json({success: true, message: msgStr });
            }
            else {
            let msgStr = `This device doesnt exist`;
            res.status(201).json({ success: false, message: msgStr, err: err });
            }
        }
        
    })
 });

 router.post('/data', function (req, res) {

    if (!req.body.currentuser) {
        res.status(401).json({ error: "Not Logged In" });
        return; //field empty,  return error to user 
    }

    if (!req.body.data) {
        res.status(401).json({ error: "No Data "});
        return; //field empty,  return error to user 
    }

    var dataArray = []
    var timeCheck = 0
    

    Account.findOne({username: req.body.currentuser}, function(err, account) {
        
        dataArray.length = 0
        if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ success: false, message: msgStr, err: err });
        }
        else if(account.data.length == 0) { 
            
            
            let heartData = req.body.data
            
            heartData.forEach(feed=> {
                let tempObject = {
                    timestamp: feed.created_at,
                    spo: feed.field1,
                    heartrate: feed.field2
                }
                
                dataArray.push(tempObject)
            })
        }
        else { //attempting to remove duplicates
            let heartData = req.body.data
            heartData.forEach(element=> {
                let time = new Date(element.created_at)
                timeCheck = 0
                account.data.forEach(accdata=> {
                    if (time.getTime() != accdata.timestamp.getTime()) {
                        timeCheck = timeCheck + 1
                    }
                })
                if (timeCheck == account.data.length) {
                    //not a duplicate
                    let tempObject = {
                        timestamp: element.created_at,
                        spo: element.field1,
                        heartrate: element.field2
                    }
                    dataArray.push(tempObject)
                }
            })

    }

    Account.updateOne({username: req.body.currentuser}, {$push : {data: {$each: dataArray}}}, function (err) {
        if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ success: false, message: msgStr, err: err });
        }
        else {
            let msgStr = "Data Added" //successful add, return to user 
            res.status(201).json({success: true, message: msgStr });
        }

    })
   
    })
    
   
    // req.body.data.forEach(feed=> {
    //     let tempObject = {
    //         timestamp: feed.created_at,
    //         spo: feed.field1,
    //         heartrate: feed.field2
    //     }
    //     dataArray.push(tempObject)
    // })
   

    // Account.findOneAndUpdate({username: req.body.currentuser}, {$push : {data: {$each: dataArray}}}, function (err) {
    //     if (err) {
    //         let msgStr = `Something wrong....`;
    //         res.status(201).json({ success: false, message: msgStr, err: err });
    //     }
    //     else {
    //         console.log(dataArray)
    //         let msgStr = "Data Added" //successful add, return to user 
    //         res.status(201).json({success: true, message: msgStr });
    //     }

    // })
    

});
    
    
    



 

 router.post('/weekly', function (req, res) {

    if (!req.body.currentuser) {
        res.status(401).json({ error: "Not Logged In" });
        return; //field empty,  return error to user 
    }

    var now = new Date();
    var lastWeek = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));; // Getting last 7 days using JS time methods
    var heartData;
    var arrayToSend = [];

    
            
            Account.findOne({ username: req.body.currentuser}, function (err, account) {

            console.log(account.data)
            if (err) {
                    let msgStr = `Something wrong....`;
                    res.status(201).json({ success: false, message: msgStr, err: err });
            }
            else {
    
            heartData = account.data;
            console.log(account.data.length)

            heartData.forEach(element => { //Filtering by the last 7 days
                tempTime = new Date(element.timestamp)
                if (tempTime.getTime() >= lastWeek.getTime()) {
                    arrayToSend.push(element);
                }
            });

            var avgHeartRate = 0
            var averageSum = 0
            var averageLength =0
            var maxHeartRate = 0
            var minHeartRate = 1000
            

            arrayToSend.forEach(element => {
                if (isNaN(element.heartrate)==false) { //check if valid data point
                    if (element.heartrate > 0 && element.heartrate < 500) { //check if not extreme data point
                        averageSum = averageSum + element.heartrate //increment sum for end
                        averageLength = averageLength + 1
                        if (element.heartrate >= maxHeartRate) {
                            maxHeartRate = element.heartrate
                        }
                        if (element.heartrate <= minHeartRate) {
                            minHeartRate = element.heartrate
                        }
                    }

                }

            })
            avgHeartRate = Math.trunc((averageSum / averageLength)*100 / 100)

            res.status(200).json({ success: true, avgHeartRate: avgHeartRate, maxHeart: maxHeartRate, minHeart: minHeartRate});
        };
    })
})

 router.post('/daily', function(req, res) {

    if (!req.body.currentuser) {
        res.status(401).json({ error: "Not Logged In" });
        return; //field empty,  return error to user 
    }
    if (!req.body.date) {
        res.status(401).json({ error: "No Date Selected" });
        return; //date not selected,  return error to user 
    }

    var heartData
    var arrayToCheck = []
    var dateHeartRateArray = []
    var dateBloodArray = []
    var timeArray = []

    var wantDate = new Date(req.body.date)
    const regex = /T(\d{2}:\d{2}:\d{2})/ //to extract time out

    Account.findOne({ username: req.body.currentuser}, function (err, account) {

        if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ success: false, message: msgStr, err: err });
        }
        else {
           
             account.data.forEach(element=> {
                  if (wantDate.getFullYear() === element.timestamp.getFullYear() &&wantDate.getMonth() === element.timestamp.getMonth() && wantDate.getDate() === element.timestamp.getDate() && element.spo!=null && element.heartrate!=null && element.spo > 0 && element.spo < 300 && element.heartrate >0 && element.heartrate < 500) {
                      dateHeartRateArray.push(element.heartrate)
                      dateBloodArray.push(element.spo)
                      const tempdate = element.timestamp.toISOString()
                      const match = tempdate.match(regex)
                      const time = match[1]
                      timeArray.push(time)
                      
                  }

              })
            
            res.status(200).json({ success: true, hrvalues: dateHeartRateArray, bovalues: dateBloodArray, times: timeArray});
        }



    })
 })


module.exports = router;