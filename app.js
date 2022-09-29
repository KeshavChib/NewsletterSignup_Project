
import express, { application } from "express";
import path from "path";
import http from "https";
import mailchimp from "@mailchimp/mailchimp_marketing";
import dotenv from "dotenv";


dotenv.config();


const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded( { extended : true } ));
app.use(express.static(__dirname));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

const apikey = process.env.API_KEY;
const listid = process.env.LIST_ID;
const Server = process.env.API_Server;



app.post("/", function(req, res){
 
    const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;
 
    // *** Construct Requesting data ***
    const data = {
        members: [
            {
              email_address: email,
              status: 'subscribed',
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
            }
          ]
    }
 
    // *** Stringify inputed data ***
    const jsonData = JSON.stringify(data);
 
    // *** url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}";
    const url = "https://" + Server +".api.mailchimp.com/3.0/lists/"+ listid;
 
    const options = {
        method: "POST",
        auth: "keshav:" + apikey
    };
    
    // *** Requesting and send back our data to mailchimp ***
    const request = http.request(url, options, function(response){

        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
 
    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (){
    console.log("Listening to port 3000");
});

