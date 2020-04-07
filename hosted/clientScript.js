"use strict";

const randomGen = (low, high) => Math.floor((Math.random() * (high - low)) + low);

let socket;

let movables = [];
let currentWords = [];
let distance = 0;
let maxSpeed = 30;
let currSpeed = 0;
let numWords = 100;
let currMoves = 0;
let totalMoves = 0;

let moving = false;

const connectSocket = (e) => {
	socket = io.connect();
	
	socket.on('connect', () => {
		console.log("connecting");
		socket.emit('join', null);
	});
	
	socket.on('response', (data) => {
		handleMessage(data);
	});
};

const handleMessage = (data) => {
	let choice = data[randomGen(0, data.length)]
	
	currentWords = data;
	
	var nameDiv = document.getElementById("nameDiv");
	while (nameDiv.firstChild) {
		nameDiv.removeChild(nameDiv.firstChild);
	}
	
	for (let i = 0; i < numWords; i++)
	{
		var para = document.createElement("P");                
		var t = document.createTextNode(data[randomGen(0, data.length)]);
		para.classList.add('slots');
		para.appendChild(t);                                   
		document.getElementById("nameDiv").appendChild(para);                       
	}

	distance = 0;
	totalMoves = (((29 * (numWords)) / maxSpeed) * 2);
	currMoves = totalMoves;
	currSpeed = maxSpeed;
	moving = true;
};

const requestWords = () => {
	socket.emit('requestWords', null);
};

const moveSlots = () => {
	if (moving)
	{
		currMoves--;
		
		currSpeed = (currMoves / totalMoves) * maxSpeed;
		
		console.log(currSpeed);
		
		distance -= currSpeed;
		
		var movables = document.getElementsByClassName("slots");

		for (let i = 0; i < movables.length; i++)
		{
			movables[i].style.top = distance + "px";
		}
		
		if (currMoves <= 0)
		{
			moving = false;
		}
	}
};

const init = () => {
	connectSocket();
	document.querySelector("#request").addEventListener('click', requestWords);
};

window.onload = init;

setInterval(moveSlots, 10);