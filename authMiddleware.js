const jwt = require('jsonwebtoken');

const APP_SECRET = "myappecret";

const USERNAME = 'admin', PASSWORD = 'admin';

const anonOps = [
    {method: "GET", urls: ["/api/products", "/api/categories"]},
    {method: "POST", urls: ["/api/orders"]}
];

module.exports = function(req, res, next){
    if(anonOps.find(op => op.method === req.method && op.urls.find(url => req.url.startsWith(url)))){
        next();
    }
    else if(req.method === "POST" && req.url === "/login"){
        if(req.body.username === USERNAME && req.body.password === PASSWORD){
            res.json({
                success: true,
                token: jwt.sign({ data: USERNAME, expiresIn: "1h"}, APP_SECRET)
            })
        }
        else res.json({ data: false });
        res.end();
    }
    else{
        let token=req.headers["authorization"];
        if(token !== null && token.startsWith("Bearer<")){
            token = token.substring(7, token.length-1)
            jwt.verify(token, APP_SECRET);
            next();
        }
        else{
            res.statusCode = 401;
            res.end();
        }
    }
}