src="index.html"
src="Canvas2ImagePlugin.js"

//List of All variables used
var p1; //Coordinates for location on the application canvas that has been touched.
var currentDrawCanvas; //Current canvas.
var ctx; //Drawing canvas.
var mouseX;
var mouseY;
var keys = ["first_name", "surname", "age", "dob", "q1", "q2", "q3", "q5a", "q5b", "q6", "q7a", "q7b", "q7c", "q7d", "q7e", "q8a", "q8b", "q8c", "q11a", "q11b", "q11c", "q11d"];
var currentValues = [];
totaltimer = [];
var circlecounter = 0;
var trianglecounter = 0;
var audiocounter = 0;


//Function. Used by moveEventFunction. Gets co-ordinate of touch
function getCoords(e) {
// Makes it work in Chrome / Safari (except on iPad/iPhone)
	if (e.offsetX) {
		return { x: e.offsetX, y: e.offsetY };
	}
	// Makes it work in Firefox
	else if (e.layerX) {
		return { x: e.layerX, y: e.layerY };
	}
	//Makes it work in Safari
	else {
		return { x: e.pageX - currentDrawCanvas.offsetLeft -10, y: e.pageY - currentDrawCanvas.offsetTop -150 };
	}
	}


// Function. Clears all local data stored after confirm
function clearLocalData(){
	if(confirm("really?")){
		localStorage.removItem("all_items");
		localStorage.removeItem("current_item");
		seeDatabase();
	}
}

//Function that create a 60 second countdown timer
var timeInSecs;
var ticker;
function startTimer(secs){
	timeInSecs = parseInt(secs)-1;
ticker = setInterval("tick()",1000); // every second
}


// Stops the current audio track
function stopaudio() {
	var audioPlayer = document.getElementsByTagName('audio')[0];
	audioPlayer.pause();
	audioPlayer.currentTime = 0;
}


function tick() {
	var secs = timeInSecs;
	if (secs>0) {
		timeInSecs--;
	}
	else {
clearInterval(ticker); // stop counting at zero
}
document.getElementById("countdown").innerHTML = secs;
}


function starttimer() {
	console.log("We pressed the button");
	startTimer(60);
}// 60 seconds


//Function. Needs user code to navigate to database
function admincheck() {
	var code = prompt("Please enter the password", "");
	if (code === "5219") {
	  location.hash = "#p29";
      $(".wholepage").hide();
      $("#p29").show()
	} else {
		alert("Sorry that is not the password");
	}
}


//Function. Displays the database
function seeDatabase(){
	$(".wholepage").hide();
	$("#local_database").show();
	var tr = $("<tr></tr>");
	$("thead").html("").append(tr);
	for(i=0; i<keys.length; i++) {
		tr.append("<th>"+keys[i]+"</th>")
	}
	if(localStorage.getItem("all_items")){
		var allAnswers = JSON.parse(localStorage.getItem("all_items"))
		console.log("all Answers: ", allAnswers)
		for(a=0;a<allAnswers.length;a++){
			var tr = $("<tr></tr>")
			$("tbody").append(tr)
			for(i=0;i<keys.length;i++){
				var val = allAnswers[a][keys[i]]
				tr.append("<td>"+val+"</td>");
			}
		}
	}
}
/*$("#local_database").html("").append(tr);
var keys = [];
var vals = [];
$("input,select").each(function(i,e){
if($(e).attr("name")){
//console.log(i,e)
name = $(e).attr("name");
value = $(e).val();
keys.push(name);
tr.append("<th>"+name+"</th>");
}
});
if(localStorage.getItem("all_items")){
console.log("all items");
var allAnswers = JSON.parse(localStorage.getItem("all_items"));
console.log(allAnswers.length);
for(a=0;a<allAnswers.length;a++){
//var tr = $("<tr>");
console.log(keys.length);
for(i=0;i<keys.length;i++){
var key = keys[i];
var val = allAnswers[a][key];
console.log(key + ": " + val);
tr.append("<td>"+val+"</td>");
}
}
}
else {
console.log("no all_items");
}*/
//tr.append("</tr>");


//Function. Saves all answers in the database
function saveCurrent(){
	if(localStorage.getItem("all_items")){
		var allAnswers = JSON.parse(localStorage.getItem("all_items"));
		var currentAnswers = JSON.parse(localStorage.getItem("current_item"));
		console.log(currentAnswers.length);
// console.log("Loaded current objects:", currentQuestion);
// allAnswers.push(currentQuestion);
allAnswers.push(currentAnswers);
allAnswers.push(totaltimer);
localStorage.setItem("all_items", JSON.stringify(allAnswers));
}
else {
	localStorage.setItem("all_items", "[]");
	var allAnswers = JSON.parse(localStorage.getItem("all_items"));
	var currentAnswers = JSON.parse(localStorage.getItem("current_item"));
	console.log(currentAnswers.length);
// console.log("Loaded current objects:", currentQuestion);
// allAnswers.push(currentQuestion);
allAnswers.push(currentAnswers);
allAnswers.push(totaltimer);
localStorage.setItem("all_items", JSON.stringify(allAnswers));
}
alert("results saved in db.")
//seeDatabase();
}


//Function. Sets p1 to initial touch point
function moveEventFunction(e) {
	if(currentDrawCanvas){
		ctx = currentDrawCanvas.getContext("2d");
// Does the line drawing
if (e.touches) {
	for (var i = 1; i <= e.touches.length; i++) {
var p = getCoords(e.touches[i - 1]); // Get info for finger i
console.log(p.x,p.y)
if(!p1){
	p1 = p
}else{
	ctx.beginPath();
	if(mode=="erase") {
ctx.fillStyle = "#FFFFFF"; // Fill colour white
} else {
	ctx.fillStyle = "#688Fc4";
}
ctx.beginPa
/* ctx.strokeStyle = "#FFFFFF"; // Line drawing colour */
ctx.moveTo(p1.x,p1.y);
ctx.lineTo(p.x,p.y);
ctx.stroke();
p1 = p;
}
}
}
}
else {
	sketchpad_mouseMove(e);
}
return false; // Stop event bubbling up and doing other stuff (like pinch zoom or scroll)
}


// Function. Mouse position relative to top left
function getMousePos(e) {
	if (!e)
		var e = event;
	if (e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
		console.log("offsetX: " + mouseX)
		console.log("offsetY: " + mouseY)
	}
	else if (e.layerX) {
		console.log("layerX: " + mouseX)
		console.log("layerY: " + mouseY)
		mouseX = e.layerX;
		mouseY = e.layerY;
	}
}


//Function. Adds mouse coords to array of coords
function recordClockCoords(coords) {
	p8.append(coords);
}


//Function. Draws circle on canvas
function drawCircle(domElement){
	$(domElement).attr("width", 300)
	$(domElement).attr("height",300)
	ctx = domElement.getContext("2d");
	ctx.clearRect(0, 0, domElement.width, domElement.height);
	ctx.strokeStyle = "black";
	ctx.arc(domElement.width / 2, domElement.height / 2, 145 , 0, Math.PI * 2);
	ctx.arc(512, 567, 145 , 0, Math.PI * 2);
	ctx.stroke();
	if (ctx) {
		domElement.addEventListener('mousedown', sketchpad_mouseDown, false);
		domElement.addEventListener('mousemove', sketchpad_mouseMove, false);
		window.addEventListener('mouseup', sketchpad_mouseUp, true);
	}
}


//Function. Draws box on canvas
function drawBoxes(domElement){
	console.log("drawBoxes")
	$(domElement).attr("width", 650)
	$(domElement).attr("height", 210)
	ctx=domElement.getContext("2d");
	ctx.clearRect(0, 0, domElement.width, domElement.height);
//Draws the square
ctx.strokeRect(1,1,200,200);
var d = 500;
//Draws the rectangle
ctx.strokeRect(1+d,1,100,200);
var tX = 350;
ctx.beginPath();
ctx.moveTo(tX,1);
//Draws the triangle
ctx.lineTo(tX+100,200);
ctx.lineTo(tX-100,200);
ctx.lineTo(tX,1);
ctx.stroke();
if (ctx) {
	domElement.addEventListener('mousedown', sketchpad_mouseDown, false);
	domElement.addEventListener('mousemove', sketchpad_mouseMove, false);
	window.addEventListener('mouseup', sketchpad_mouseUp, true);
}
}

function timer(){
var d = new Date();
var currentpage = d.getTime();
questiontime=(currentpage - lastpage)
page=location.hash
totaltimer.push(page + " " + questiontime)
console.log(totaltimer)
lastpage=currentpage
}


function starttest(){
	$("#local_database").hide();
	location.hash = "#p1";
	$(".wholepage").hide()//Hide previous page
	$("#p1").show() //Show next page
	d = new Date();
    lastpage = d.getTime();
    console.log(lastpage)
}


function submitData() {
	saveCurrent();
}

function emptystart(){
	location.hash = "#p0";
	$(".wholepage").hide();
	$("#p0").show();
	circlecounter=0;
	trianglecounter=0;
	audiocounter=0;
}

function backtostart(){
	location.hash = "#p0";
	$(".wholepage").hide();
	$("#p0").show();
	localStorage.removeItem("current_item");
	circlecounter=0;
	trianglecounter=0;
	audiocounter=0;
}


function admintest(){
	location.hash = "#p0";
}


function gotostory(){
	stopaudio()
	location.hash="#p28"
	$(".wholepage").hide()
	$("#p28").show()
}


function backtoquestion(){
	location.hash="#p23"
	$(".wholepage").hide()
	$("#p23").show()
}


function next(){
	var tonext=location.hash;
	tonext = tonext.replace(/[^0-9\.]+/g, "");
	tonext++;
	location.hash="#p"+tonext
	console.log("The next page is" + location.hash)
$(".wholepage").hide()//Hide previous page
$("#p"+tonext).show() //Show next page
timer();
stopaudio()
}


if(localStorage.getItem("current_item")){
	var currentQuestion = JSON.parse(localStorage.getItem("current_item"))
	console.log("Loaded current object:", currentQuestion)
}else{
	console.log("No current object.")
	var currentQuestion = {};
}


//Function. Draws on the Canvas
var mode = "pen"
function drawDot(ctx,x,y,size,e) {
	if(mode=="erase") {
ctx.fillStyle = "#FFFFFF"; // Fill colour white
}
else {
	ctx.fillStyle = "#688Fc4";
}
ctx.beginPath();
ctx.arc(x, y, size, 0, Math.PI*2, true);
ctx.closePath();
ctx.fill();
}



function clearcanvas1(){
	circlecounter++
	console.log(circlecounter)
	drawCircle($('#canvas1')[0])
}


function clearcanvas2(){
	trianglecounter++
	console.log(trianglecounter)
	drawBoxes($('#canvas2')[0])
}


// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
	mouseDown=1;
	drawDot(ctx,mouseX,mouseY,size, e);
}


// Keep track of the mouse button being released
function sketchpad_mouseUp() {
	mouseDown=0;
}


// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
// Update the mouse co-ordinates when moved
getMousePos(e);
// Draw a dot if the mouse button is currently being pressed
if (mouseDown==1) {
	drawDot(ctx,mouseX,mouseY,size,e);
}
}

function audiobutton() {
	var music = new Audio('objects list.mp3')
	music.play();
	audiocounter++
	console.log(audiocounter)

}




function exportData() {
// encode the data into base64
base64 = window.btoa(localStorage.getItem('all_items'));
// create an a tag
var a = document.createElement('a');
a.href = 'data:application/octet-stream;base64,' + base64;
a.innerHTML = 'Download';
// add to the body
document.body.appendChild(a);
var content = "";
var filename = "test.tsv";
var headings = "";
for(i=0; i<keys.length; i++) {
	headings+=keys[i]+"\t";
}
headings += "\n";
content += headings;
console.log(keys.length);
if(localStorage.getItem("all_items")) {
	var allAnswers = JSON.parse(localStorage.getItem("all_items"));
	for(a=0; a< allAnswers.length; a++) {
		var line = "";
		for(i = 0; i<keys.length; i++) {
			var value = allAnswers[a][keys[i]];
			line += value + "\t";
			console.log(value);
		}
		line += "\n";
		content += line;
	}
}
var body = encodeURIComponent(content);
var csvData = 'data:application/csv;charset=utf-8, ' + body;
$(this).attr({
	'download': filename,
	'href': csvData,
	'target': 'blank'
});
}

Function.prototype.bind = function(parent) {
    var f = this;
    var args = [];

    for (var a = 1; a < arguments.length; a++) {
        args[args.length] = arguments[a];
    }

    var temp = function() {
        return f.apply(parent, args);
    }

    return(temp);
}

function screenshot() {
submitData();
$(".wholepage").hide()//Hide previous page
$("#p19").show() //Show next page
}


//Attaches the event handler 'touchmove' to the document.
$(document).bind('touchmove', false);
//Holds off function execution till DOM completely loaded.
$(document).ready(function(){
	$("input, select").change(function(evt){
		currentQuestion[evt.target.name] = evt.target.value;
		localStorage.setItem("current_item", JSON.stringify(currentQuestion));
		console.log("saved:", currentQuestion);
	});


//Function. Applies next button to all question class
$(".wholepage").each(function(i,e){
	$(e).attr("id","p"+i)
//The 'Next' button
if (i===0 || i===6 || i===4 ) {
var btn = $('<input type="button" class="hide" value="Next">'); //Creates
} else if (i===12) {
var btn = $('<input type="button" class="infosubmit" value="Continue">');

}else if (i===1 || i===5 || i===9 || i===12 || i===13 || i===15 || i===21) {
	var btn =$('<input type="button" class="infosubmit" value="Continue">');
}else if (i<6 || i===14 || i===19 || i ===20 || i===22) {
	var btn = $('<input type="button" class="next" value="Submit">');
} else{
	var btn = $('<input type="button" class="hide" value="Next">');
} //the 'Next' button
console.log(i) // Writes to console what page we are on DEBUG
btn.attr("data-to",i+1) //'Next' Button associated with next page (question)
btn.attr("data-id",i) //Let the 'Next' button know what page (question) it's currently on.
/* Not a clue. dont think its needed
if (i===15) {
downloadCanvas("canvas1", "firstattempt.png")
console.log("We tried to download")
console.log(i)
}
*/
//Binds the event handler 'click' to the event where the 'Next' button is clicked.
btn.bind('click', function(ev){
	var toId = $(ev.target).data("to")
$(".wholepage").hide()//Hide previous page
$("#p"+toId).show() //Show next page
location.hash = "#p"+toId //Moves to next page.
timer()

if (i===10) {
	setTimeout(function() {
		$('.mathquestion').fadeOut('fast');
	}.bind(this), 10000)
}

if (i===12) {
	console.log("we got")
setTimeout(function() {
	console.log("to here")
   $('.topbumper').fadeOut('fast');
}.bind(this), 15000); // <-- time in milliseconds
} 


});
$(e).append(btn) //'Next' button now listens for events
});
//Logs the page identifier, unless empty then set to q0
if(location.hash){
	console.log(location.hash)
	var hId = location.hash
	var hId = location.hash
}else{
	var hId = "#p0"
}
//Display the question identifier
$(hId).show()
//Draws circle on 'canvas1'
var can = document.getElementById("canvas1");
drawCircle(can);
//When canvas1 is touched, associate it wth currentDrawCanvas so we know it is now available to act on.
can.ontouchstart = function(e){
	currentDrawCanvas = document.getElementById("canvas1");
}
can.onmousedown = function(e){
	currentDrawCanvas = document.getElementById("canvas1");
}
//Handle different types of input.
can.ontouchmove = moveEventFunction; //Associates touch with moveEventFunction.
can.onmousemove = moveEventFunction; //Associates mouse movement with moveEventFunction.
//When canvas interaction has ended, no more cooordinates recorded.
can.ontouchend = function(e){
//Resets p1
p1 = null;
};
can.onmouseup = function(e) {
	mouseDown = 0;
	p1 = null;
}
mouseDown = 0;
//Draws boxes on 'canvas2'
var can2 = document.getElementById("canvas2");
drawBoxes(can2);
//When canvas2 is touched, associate it with currentDrawCanvas so we know it is available to act on.
can2.ontouchstart = function(e){
	currentDrawCanvas = document.getElementById("canvas2");
}
can2.onmousedown = function(e) {
	currentDrawCanvas = document.getElementById("canvas2");
}
//Handle different types of input.
can2.ontouchmove = moveEventFunction; //Associates touch with moveEventFunction.
can2.onmousemove = moveEventFunction; //Associates mouse movement with moveEventFunction.
//When canvas interaction has ended, no more cooridnates recorded.
can2.ontouchend = function(e){
//Resets p1
p1 = null;
};
can2.onmouseup = function(e) {
	mouseDown = 0;
	p1 = null;
}
});





