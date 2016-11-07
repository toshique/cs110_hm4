"use strict";
const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const filePath = './public';
const tasks = [
      {id: Math.random() + '', message: "Sleep at 11pm", completed: false},
      {id: Math.random() + '', message: "Wake up at 7am", completed: false},
      ];
const server = http.createServer(function(req, res){
    const location = path.join(filePath, req.url);
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;    
    fs.readFile(location, function(err, data) {
       if(method === 'GET') {
            if(req.url.indexOf('/todos')>= 0) {
                let localTodos = tasks;
                if(parsedQuery.searchtext) {
                    localTodos = localTodos.filter(function(obj) {
                        return obj.message.toLowerCase().indexOf(parsedQuery.searchtext.toLowerCase()) >= 0;
                    });
                }
                return res.end(JSON.stringify({items : localTodos}));
            }
        }
 
    if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {
            
            let body = '';
            req.on('data', function (chunk) {
                body = body + chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  
                jsonObj.id = Math.random() + ''; 
                tasksList[tasks.length] = jsonObj;   
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }
    
     if(method === 'DELETE') {
        
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < tasks.length; i=i+1) {
                if(id === tasks[i].id) {
                    tasks.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
    if(method === 'PUT') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body = body + chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); 
                
                for(let i = 0; i < tasks.length; i=i+1) {
                    if(tasks[i].id === jsonObj.id) { 
                        tasks[i] = jsonObj; 
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(jsonObj));
                    }
                }
                res.statusCode = 404;
                return res.end('Task cannot be updated');
            });
            return;
        }
    }
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }
        res.statusCode = 200;
        return res.end(data);
    
});
});
server.listen(10);
