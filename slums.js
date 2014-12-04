
//To make into app: http://matt.might.net/articles/how-to-native-iphone-ipad-apps-in-javascript/

var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring');
    geolocation = require('geolocation');
    csv = require('csv');

var DAY_MAP = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

var first_name;
var surname;
var patient_alert;
var education_level;
var dob;

var q1;
var q2;
var q3;
var q4;
var q5a;
var q5b;
var q6;
var q7;
var q8a;
var q8b;
var q8c;
var q9a;
var q9b;
var q10a;
var q10b;
var q11a;
var q11b;
var q11c;
var q11d;






function readFile(fn) {
    return fs.readFileSync(fn).toString();
};

var fileName = 'correct.txt';
var outfile = "SLUMSRawData.tsv";
var scoreOutFile = "SLUMSScores.tsv"
var now = new Date(Date.now());

var correct = readFile(fileName).split('\n');
var q1Correct = DAY_MAP[now.getDay()].toString();
var q2Correct = now.getFullYear().toString();
var q3Correct = correct[0];
var q5aCorrect = correct[1];
var q5bCorrect = correct[2];
var q7Correct = correct[4].split();
var q8aCorrect = correct[5];
var q8bCorrect = correct[6];
var q8cCorrect = correct[7];
var q9Correct = now.getTime();
var q11aCorrect = correct[8];
var q11bCorrect = correct[9];
var q11cCorrect = correct[10];
var q11dCorrect = correct[11];

var generator = csv.generate({seed: 1, columns: 2, length: 20});
var parser = csv.parse();
var transformer = csv.transform(function(data) {
    return data.map(function(value){return value.toUpperCase()});
});
var stringifier = csv.stringify();

var server = http.createServer(function (req,res){
    console.log("correct.length: " + correct.length.toString());

                            
    var url_parts = url.parse(req.url,true);
    
    var body = '';

    if(req.method === 'POST'){      
       // res.end('post');
       console.log('Request found with POST method');     
        req.on('data', function (data) {
            body += data;
            console.log('got data:'+data);
        });
        req.on('end', function () {

            var POST = qs.parse(body);
            // use POST
            var outString = getData(res,POST);
            res.end(outString);

        });
        
       
    }

    if(url_parts.pathname == '/') 
        
    fs.readFile('./index.html',function(error,data){ 
    console.log('Serving the page index.html');
    res.end(data);    
    });

    else if(url_parts.pathname == '/getData'){
        console.log('Serving the Got Data.');
        
        }
    
        

});
server.listen(8080);
console.log('Server listenning at localhost:8080');



function  getData(res,post){
    console.log("getData executed")

    first_name = post.first_name;
    surname = post.surname;
    patient_alert = post.alertlevel;
    education_Level = post.education.toString();
    dob = post.dob;
    age = post.age;

    q1 = post.q1;
    q2 = post.q2;
    q3 = post.q3;
    q5a = post.q5a;
    q5b = post.q5b;
    q6 = post.q6.split('\n').map(Function.prototype.call, String.prototype.trim);
    q7 = post.q7.split('\n').map(Function.prototype.call, String.prototype.trim);
    q8a = post.q8a;
    q8b = post.q8b;
    q9a = post.q9a;
    q9b = post.q9b;
    q10a = post.q10a;
    q10b = post.q10b;
    q11a = post.q11a;
    q11b = post.q11b;
    q11c = post.q11c;
    q11d = post.q11d;
    var outString = makeOutString();
    var score = getScore();
    console.log(outfile);
    console.log(outString);
    //fs.writeFileSync(outfile, outString); 
    fs.appendFile(outfile, outString, function (err) {
        if (err) throw err;
        console.log('Written to file.');
    }); 
    fs.appendFile(outfile, outString);  
    getScore();
    return outString;
}

/*
*Outputs a simple tab-separated string for the data file.
*Later we can use a more sophisticated data format, e.g. json, xml?
*/
function makeOutString() {
    var outString = "";
    outString += first_name + "\t"
    + surname + "\t"
    + patient_alert + "\t"
    + education_level + "\t"
    + dob + "\t"
    + q1 + "\t"
    + q2 + "\t"
    + q3 + "\t"
    + q5a + "\t"
    + q5b + "\t"
    + q6.toString() + "\t"
    + q7.toString() + "\t"
    + q8a + "\t"
    + q8b + "\t"
    + q9a + "\t"
    + q9b + "\t"
    + q10a + "\t"
    + q10b + "\t"
    + q11a + "\t"
    + q11b + "\t"
    + q11c + "\t"
    + q11d + "\t"
    + now.getFullYear().toString() + now.getMonth().toString() + now.getDate().toString()
    + "\n";
    
    return outString;
}

function getScore() {
    var score = 0;
    score += scoreQ1();
    score += scoreQ2();
    score += scoreQ3();
    score += scoreQ5a();
    score += scoreQ5b();
    score += scoreQ6();
    score += scoreQ7();
    score += scoreQ8a();
    score += scoreQ8b();
    score += scoreQ8c();
    score += scoreQ9();
    score += scoreQ10a();
    score += scoreQ10b();
    score += scoreQ11a();
    score += scoreQ11b();
    score += scoreQ11c();
    score += scoreQ11d();
    return score;
} 

//1. What day of the week is it?
//Some subtleties here - in the freeform questionnaire, participants can give a response which isn't the day of the week. 
//To keep this, a drop-down is not a good idea.
//But does spelling matter? 
//How much error are we willing to forgive?
function scoreQ1() {
    q1 =  q1.toLowerCase();
    console.log("Q1 answer: " + q1);
    console.log("Q1 correct: " + q1Correct)
    return (q1.substring(0, 2)!=q1Correct);

}

//2. What is the year?
function scoreQ2() {
    console.log("Q2 answer: " + q2)
    console.log("Q2 correct: " + q2Correct)
    return (q2 == q2Correct);
}

//3. What state are we in?
function scoreQ3() {
    console.log("Q3 answer: " + q3)
    console.log("Q3 correct: " + q3Correct)

    return (q3 == q3Correct);

}

//5. You have $100 and you go to the store to buy a dozen apples for $3 and a tricycle for $20.
//a. How much did you spend?
function scoreQ5a() {
    console.log("Q5a answer: " + q5a)
    console.log("Q5a correct: " + q5aCorrect)

    return (q5a == q5aCorrect);

} 
//b. How much do you have left?
function scoreQ5b() {
    console.log("q5b answer: " + q5b)
    console.log("Q5b correct: " + q5bCorrect)

    return (q5b == q5bCorrect);
}

//6. Please name as many animals as you can in one minute.
//List of animals at: http://a-z-animals.com/animals/
//Check each entry - is it an animal?
//Count number of valid entries.
function scoreQ6() {
    console.log("q6 answer: " + q6)
    console.log("q6 length: " + q6.length);
    return q6.length;

}

//7. What were the five objects I asked you to remember?
//Check against list in q4. Count each match only once. 
function scoreQ7() {
    console.log("q7 answer: " + q7)
    console.log("q7 length: " + q7.length);
    return q7;

}

//8. I am going to give you a series of numbers and I would like you to give them to be backwards. For example, if I say 42, you would say 24.
//a. 87
function scoreQ8a() {
    console.log("q8a answer: " + q8a)
    console.log("Q8a correct: " + q8aCorrect)
    return (q8a == q8aCorrect);
}
//b. 649
function scoreQ8b() {
    console.log("q8b answer: " + q8b)
    console.log("Q8b correct: " + q8bCorrect)

    return (q8b == q8bCorrect);
}
//c. 8537
function scoreQ8c() {
    console.log("q8c answer: " + q8c)
    console.log("q8c correct: " + q8cCorrect)

    return (q8c == q8cCorrect);

}

//9. This is a clock face. Please put in the hour markers and the time at ten minutes to eleven o'clock
//approx correct answer correct orientation - detect.
//error margin
function scoreQ9() {
    console.log("q9a answer: " + q9a)
    console.log("q9b answer: " + q9b)
    
    return 0;    
}

//a. Please place an X in the triangle
//need to find way of implementing this
//X over correct shape object (could do it by position on page or wrt different shapes)
function scoreQ10a() {
    console.log("q10a answer: " + q10a)
}
//b. Which of the above figures is the largest?
//need to find way of implementing this
//correct shape object selected
function scoreQ10b() {
    console.log("q10b answer: " + q10b)

}

//11. I am going to tell you a story. Please listen carefully because afterwards, I'm going to ask you some questions about it.
//Will this be audio?
//Jill was a very successful stockbroker. She made a lot of money on the stock market.
//She then met Jack, a devastatingly handsome man. She married him and had three children. They lived in Chicago.
//She then stopped work and stayed at home to bring up her children. When they were teenagers, she went back to work.
//She and Jack lived happily ever after.
//a. What was the female's name?            
function scoreQ11a() {
    console.log("q11a answer: " + q11a)
    console.log("q11a correct: " + q11aCorrect)

    return (q11a.toLowerCase() ==  q11aCorrect.toLowerCase());
}
//b. What work did she do?
function scoreQ11b() {
    console.log("q11b answer: " + q11b)
    console.log("q11b correct: " + q11bCorrect)

    return (q11b.toLowerCase() == q11bCorrect.toLowerCase());

}
//c. When did she go back to work?
function scoreQ11c() {
    console.log("q11c answer: " + q11c)
    console.log("q11c correct: " + q11cCorrect)

    return (q11c.toLowerCase() == q11cCorrect.toLowerCase());

}
//d. What state did she live in?
function scoreQ11d() {
    console.log("q11d answer: " + q11d)
    console.log("q11d correct: " + q11dCorrect)

    return (q11d.toLowerCase() == q11dCorrect.toLowerCase());
}