
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const mailChimpKey = "60fdee166fbc81515d062c987bde69e1-us18";

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){

    var fname = req.body.fname;
    var lname =  req.body.lname;
    var email =  req.body.passwd;

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields: {
                    FNAME : fname,
                    LNAME : lname
                }
            }
        ]
    };
    var JsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/9eccf11162";
    const option = {
        method : "POST",
        auth : "asalek:60fdee166fbc81515d062c987bde69e1-us18"
    }

    
    
    var request = https.request(url, option, function(response){
        
        if (response.statusCode == 200)
        {res.sendFile(__dirname + "/succes.html");}
        else 
            {res.sendFile(__dirname + "/failure.html");}
            
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(JsonData);
    request.end();
});

app.post("/failure", function(reqq, resq){
    resq.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
