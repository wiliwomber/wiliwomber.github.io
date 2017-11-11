"use strict";

// JavaScript Documentr

function dragDropFunctionality(){
	//add drag and drop to color pallete
	console.log('drag wurde aufgerugen');
	let colors = document.getElementsByClassName("color");
	for (let i = 0; i < colors.length; i++){
		colors[i].addEventListener('dragstart', startdrag, false);
		colors[i].addEventListener('dragend', enddrag, false);
		colors[i].addEventListener('drop', handleDrop, false);
	}
	//add drop enter to positions of current round
	for (let i = 0; i < 4; i++) {
		let id = 4*round + i;
		//clone all elements so they will have a new listener in the next round
		if (round > 0){
		let oldposition = document.getElementById(id-4);
    	let positionClone = oldposition.cloneNode(true);
		oldposition.parentNode.replaceChild(positionClone, oldposition);
		}
		let position = document.getElementById(id);
		console.log('listener to: ' + id);
		position.addEventListener('dragover', elementover, false);
		position.addEventListener('dragenter', enterdrag, false);
		position.addEventListener('dragleave', leavedrag, false);
		position.addEventListener('drop', handleDrop, false);
	}
}


function startdrag(e){
	this.style.opacity = '0.3';
	let dragImage = new Image(25,25);
	dragImage.src = "../images/" + this.getAttribute("id") + ".png";
	dragImage.style.width = '25px';
	dragImage.style.height = '25px';
    let div = document.createElement('div');
    div.appendChild(dragImage);
    div.style.position = "absolute"; div.style.top = "0px";
	div.style.left = "-500px";
	document.querySelector('body').appendChild(div);
	e.dataTransfer.setDragImage(dragImage,13,13);
	e.dataTransfer.setData('text/plain', this.getAttribute('id'));
}


function enddrag(e){
	this.style.opacity = "1";
}


function elementover(e){
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';
}


function enterdrag(e){
	console.log('drag was entered');
	this.style.backgroundImage = 'url(../images/ondrag.png)';
}


function leavedrag(e){
	if(typeof board[round][this.getAttribute('id')] == 'undefined'){
		this.style.backgroundImage = 'url(../images/hole.png)';
	} else {
		this.style.backgroundImage = 'url(../images/' + board[round][this.getAttribute('id')] + '.png';
	}


}

function handleDrop(e){
	e.preventDefault();
	console.log('datentransfer: ' + e.dataTransfer.getData('text/plain'));
	//console.log('this elements id' + this.Element.getAttribute('id'));
	console.log(round);
	board[round][(this.getAttribute('id')%4)] = e.dataTransfer.getData('text/plain');
	let url = 'url(../images/' + e.dataTransfer.getData('text/plain') + '.png)';
	this.style.backgroundImage = url;
	submit();
}


function submit() {
	let allGuessesSet = true;
	for (let i = 0; i < 4; i++) {
		console.log('type of board: ' + typeof board[round][i]);
		if (typeof board[round][i] === 'undefined'){
			allGuessesSet = false;
		}
	}
	if (allGuessesSet) {
		console.log('All guesses were set');
		$('#submitButtonContainer').show('slide', {direction: 'right'}, 1000);
		$('.submitButton').off().click(finishRound); ///wird je aufruf der if-schleife nochmal aufgerufen
	}
}

function finishRound(){
	$('#submitButtonContainer').hide('slide', {direction: 'right'}, 1000);
	generateFeedback();
	round++;
	console.log('main should ne stated');
	dragDropFunctionality();
}



function initializeBoard(rows) {
	let board = new Array(rows);
	for (let i = 0; i < rows; i++){
		board[i] = new Array(4);
	}
	return board;
}

function generateScode(){
	let scode = new Array(4);
	let availableColors = ['purple','blue','green','yellow','orange','red'];
	for (let i = 0; i < 4; i++){
		scode[i] = availableColors[(Math.floor(Math.random() * 6))];
		console.log(scode[i]);
	}
	return scode;
}


function generateFeedback(){
	let rightPlace = 0;
	let rightColor = 0;
	//create temp arrays to compare witheach other
	let tempScode = scode.slice(0);
	let currentRow = new Array(4);
	for (let i = 3; i >= 0; i--){
		//make copy of current row
		currentRow[i] = board[round][i];
		//check if right positions are given
	}
	for (let i = 3; i >= 0; i--){
		if (currentRow[i] == tempScode[i]){
			rightPlace++;
			currentRow.splice(i,1);
			tempScode.splice(i,1);
		}
	}
	console.log('row: ' + currentRow);
	console.log('scode: ' + tempScode);
		// check if right colors are given
		for (let i = currentRow.length-1; i >= 0; i--){
			for (let m = 0; m < tempScode.length; m++){
				if (currentRow[i] == tempScode[m]){
					tempScode.splice(m,1);
					rightColor++;
					break;
				}
			}
		}
//to be deleted
		console.log('2row: ' + currentRow);
		console.log('2scode: ' + tempScode);
		//add right places
		for (let i = 1; i < (rightPlace+1); i++){
			$('.round'+round+' #f'+i).css('backgroundImage',"url('../images/rightplace.png')");
		}
		//add right colors
		for (let i = 1; i < rightColor+1; i++){
			$('.round'+round+' #f'+(i+rightPlace)).css('backgroundImage',"url('../images/rightcolor.png')");
		}
	if (rightPlace == 4){
		$('.completed').fadeIn(400);
		$('#replay').click(function() {
 location.reload();
});
	}

}

////////Code
function main(){
console.log('main wurde aufgerugen');
window.removeEventListener('load', dragDropFunctionality, false);
window.addEventListener('load', dragDropFunctionality, false);
}


// global variables
let round = 0;
let board = initializeBoard(12);
let scode = generateScode();
//control of one round
main();
