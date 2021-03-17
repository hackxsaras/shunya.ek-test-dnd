
let ball = document.getElementById('ball');

ball.ondragstart = function() {  // Removing all drag events
	return false;
};


let currentDroppable = document.querySelector('.droppable'), ballghost = null;

ball.onmousedown = function(event) {

	let shiftX = event.clientX - ball.getBoundingClientRect().left;
	let shiftY = event.clientY - ball.getBoundingClientRect().top;

	ball.style.position = 'absolute';
	ball.style.zIndex = 1000;

	moveAt(event.pageX, event.pageY);

	function moveAt(pageX, pageY) {	
		ball.style.left = pageX - shiftX + 'px';
		ball.style.top = pageY - shiftY + 'px';
	}
	function snapAt(p){
		p = centered(ball, p);

		ballghost.style.left = p.x + 'px';
		ballghost.style.top = p.y + 'px';
	}
	function onMouseMove(event) {
		moveAt(event.pageX, event.pageY);

		ball.style.hidden = true;
		let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
		ball.style.hidden = false;

		if (!elemBelow) return;

		let droppableBelow = currentDroppable;

		// console.log(droppableBelow);
		
		snapOnProximity(droppableBelow);

		// if (currentDroppable != droppableBelow) {
		// 	if(currentDroppable){
		// 	}
		// 	currentDroppable = droppableBelow;

		// 	if (currentDroppable) { // null when we were not over a droppable before this event
		// 		missedit(currentDroppable);
		// 	}
		// 	currentDroppable = droppableBelow;
		// 	if (currentDroppable) { // null if we're not coming over a droppable now
		// 		// (maybe just left the droppable)
		// 		goal(currentDroppable);
		// 	}
		// }
	}
	function snapOnProximity(droppable){

		ballghost = document.getElementById("ballghost");

		if(getDistanceBetweenElements(ball, droppable) < 50){

			if(!ballghost){
				ballghost = ball.cloneNode(true);
				ballghost.id = "ballghost";
				ballghost.style.zIndex = 500;
				document.body.appendChild(ballghost);
			}
			// console.log(getPositionAtCenter(droppable));
			snapAt(getPositionAtCenter(droppable));
			
			ball.style.opacity = 0;
			goal(droppable);

		} else if(ballghost){

			missedit(droppable);
			
			ballghost.parentNode.removeChild(ballghost);
			ball.style.opacity = 1;
		}
	}
	document.addEventListener('mousemove', onMouseMove);

	ball.onmouseup = function() {
		// console.log('called');
		document.removeEventListener('mousemove', onMouseMove);
		if(ballghost = document.getElementById('ballghost')){
			ball.style.left = ballghost.style.left;
			ball.style.top = ballghost.style.top;
			ballghost.parentNode.removeChild(ballghost);
			ball.style.opacity = 1;
		}
		ball.onmouseup = null;
	};
};

function goal(elem) {
	if(elem)
		elem.style.background = 'pink';
}

function missedit(elem) {
	if(elem)
		elem.style.background = '';
}

 function centered(element, p){
 	return {x : (p.x - element.offsetWidth/2) , y : (p.y -  element.offsetHeight/2)}
 }
 function getPositionAtCenter(element) {
   if(!element) return {x : 0, y : 0};
   const top = element.offsetTop;
   const left = element.offsetLeft;
   const width = element.offsetWidth
   const height = element.offsetHeight;

   return {
     x: left + width / 2,
     y: top + height / 2
   };
 }

function getDistanceBetweenElements(a, b) {
  
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);  
}