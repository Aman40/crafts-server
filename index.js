#!/usr/bin/node
const express = require("express");
const app = express();
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const mysql = require('mysql');
const facade = require('./mod_facade');
const provider = require('./mod_provider');
const manager = require('./mod_manager');
app.listen(80);

/**
 * Connection options for the session store. 
 */
const store_options = {
    host: 'localhost',
    port: 3306,
    user: 'aman',
    password: 'password',
    database: 'crafts'
};
let sessionStore = new MySqlStore(store_options);

const session_options = {
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false,
        /*maxAge: 20*60*1000*/
    },
    // resave: true, //Reset maxAge counter
    rolling: true, //Session only expires if user is inactive for 
    //duration of maxAge,
    secret: 'sms-iwaly',
    store: sessionStore,
    unset: 'destroy',
    saveUninitialized: true
}

/**
 * Now we respond to the pre-flight requests.
 * These are sent when a cross-origin request is made.
 * Reply with the allowed http methods, origins, headers and 
 * credentials allowed or not, and content type
 */

 app.use('/', (req, res, next)=>{
     //log the date and time of the request for debugging purposes
     console.log(getCurrDate());

     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
     res.setHeader('Access-Control-Allow-Credentials', true);
     res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Cookie, Set-Cookie, '+
    'Access-Control-Allow-Heders, '+'Origin, Accept, X-Requested-With, '+
    'Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Content-Type', 'text/html');
    if(req.method!=='OPTIONS'){
        next();
    } else {
        res.end('OK');
    }
 });
 //Route the request for <domain>/favicon.ico here before sessions begin
 app.use(function(req, res, next){
     /**
      * When the client is provided by a react server running on localhost:3000, 
      * the requests it makes to the server arent simple request anymore. They 
      * <are|are seen as> cross-domain requests.
      * Hence, on the client side, for AJAX requests, the cookie has to be set
      * manually for sessions to work.
      */
     if(req.headers["set-cookie"]) {
		req.headers.cookie = req.headers["set-cookie"][0];
	}
	next();
 })

 app.use(session(session_options));
 
 //Do the routing
 app.use('/facade');
 app.use('/manager');
 app.use('/provider');
 app.use('/', send_session_data);

 function send_session_data(req, res){
     /**
      * When the user accesses the bare root of the server, return the session data
      * Could be used to check whether or not the user is logged in.
      */
     req.session.save((err)=>{
         if(err){
             console.log(`Error: ${err.message}`);
             //Respond with the error message
             res.statusCode = 500;
             console.log('Sent cookie: '+ res.getHeader('Set-Cookie'));
             res.end(JSON.stringify({
                msg: 'Connection refused',
                cookie: res.getHeader('Set-Cookie'),
                srv_res_status: 1
            }));
         }
         if(req.session.uid){
             //UID is set, therefore user is still logged in
             let usr_data = {}
             //Return something static for now
             res.statusCode = 200;
             console.log('Sent cookie: '+ res.getHeader('Set-Cookie'));
             res.end(JSON.stringify({
                 usr_info: {
                     name: 'Aman',
                     age: 25
                 },
                 cookie: res.getHeader('Set-Cookie'),
                 srv_res_status: 0
             }));
         } else {
             //TODO: Provide overhead.
             res.statusCode = 200;
             console.log('Sent cookie: '+ res.getHeader('Set-Cookie'));
             res.end(JSON.stringify({
                 msg: 'Just provide the overhead',
                 cookie: res.getHeader('Set-Cookie'),
                 srv_res_status: 1
             }))
         }
     })
 }

 function getCurrDate() {
	let dt  = new Date();
	//Get utc time in ms
	let utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
	//Create new date object for offset timezone
	let date = new Date(utc + (3600000 * 9));
	//YYYY:MM:DD HH:MM:SS Unix datetime string, mysql compatible
	let month = date.getMonth();
	month++; //Javascript month is 0 based. 0=January, 11=December
	if(month<10) {
		month="0"+month.toString();
	}
	let day = date.getDate();
	if(day<10) {
		day="0"+day.toString();
	}
	let hours = date.getHours();
	if(hours<10) {
		hours="0"+hours.toString();
	}
	let minutes = date.getMinutes();
	if(minutes<10) {
		minutes="0"+minutes.toString();
	}
	let seconds = date.getSeconds();
	if(seconds<10) {
		seconds="0"+seconds.toString();
	}
	return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}