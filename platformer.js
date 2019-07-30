window.addEventListener("load", platformer, false);
function platformer() {
    canv = document.getElementById("platformer");
    ctx = canv.getContext("2d");
    let unit = 24;
    let maxVel = 6;
    let jump = 10;
    let friction = 1;
    var posX = 0;
    var posY = 0;
    var velX = 0;
    var velY = 0;
    var left = false;
    var up = false;
    var right = false;
    var down = false;
    var colLeft = false;
    var colUp = false;
    var colRight = false;
    var colDown = false;
    var score = 0;
    let arenaUnit = 10; 
    let jumpDistance;
    let arenaX = canv.width / arenaUnit;
    let arenaY = canv.height / arenaUnit;
    var arena;
    setInterval(function(){
        move();
    }, 1000/60)
    createArena();
    window.addEventListener("keyup", keyUp);
    function keyUp(evt) {
        if (evt.keyCode == 37) { // left
            left = false;
        }
        if (evt.keyCode == 38) { // up
            up = false;
        }
        if (evt.keyCode == 39) { // right
            right = false;
        }
        if (evt.keyCode == 40) { // down
            down = false;
        }
    }
    window.addEventListener("keydown", keyDown);
    function keyDown(evt) {
        if (evt.keyCode == 37) { // left
            left = true;
        }
        if (evt.keyCode == 38) { // up
            up = true;
        }
        if (evt.keyCode == 39) { // right
            right = true;
        }
        if (evt.keyCode == 40) { // down
            down = true;
        }
    }
    // this thing kinda is meh works ish could be better kinda sucks and is bad code but 
    // like it does the job not really i need to fix this but its good enough for my purposes 
    // because it works but it could work better as all things can but it does the job that i set 
    // out for it to do and its okay but it could be much better and i want to get on with my life now thanks
    function createArena() { // creates the arena randomly
        arena = new Array(arenaY);
        for (i = 0; i < arena.length; i++) { // creates large 2d array without needing to write the entire thing out
            arena[i] = new Array(arenaX);
        }
        jumpDistance = Math.round(jump * 2 *(maxVel / 10)) + maxVel + 2;
        y = arenaY / 3 * 2;
        yChange = 0;
        xChange = 0;
        for (x = 0; x < arenaX; x += xChange - 1) {
            for (i = 0; i < maxVel; i++) {
                arena[y][x + i] = 1;
            } 
            yChange = Math.floor(Math.floor(Math.random() * jumpDistance) / arenaUnit);
            xChange = jumpDistance - yChange - Math.floor(Math.random() * (jumpDistance - yChange))
            while (xChange < maxVel + 1) {
                xChange++;
            }
            while ((xChange > maxVel + 1) && (xChange < maxVel + 5)) {
                xChange++;
            }
            y -= yChange;
        }  
    }
    function move() { // moving the player, uses for loop method that makes collisions always work and never put player inside a solid
        velChange();
        nature();
        for (i = 0; i < Math.abs(velX); i++) { // horizontal movement
            edgeCollision();
            arenaCollision();
            if (((colLeft) && (velX < 0)) || ((colRight) && (velX > 0))) {
                velX = 0;
                break;
            }
            posX += velX / Math.abs(velX);
        }
        for (i = 0; i < Math.abs(velY); i++) { // vertical movement
            edgeCollision();
            arenaCollision();
            if (((colUp) && (velY < 0)) || ((colDown) && (velY > 0))) {
                velY = 0;
                break;
            }
            posY += velY / Math.abs(velY);
        }
    }
    function velChange() {
        if (colDown) { // can only change velocity when on the ground
            if ((left) && (velX > -maxVel) && (colLeft == false)) {
                velX--;
            }
            if ((up) && (velY > -maxVel) && (colUp == false)) {
                velY = -jump;
            }
            if ((right) && (velX < maxVel) && (colRight == false)) {
                velX++;
            }
        }
    }
    function nature() { // gravity and friction
        if ((colDown) && (left == false) && (right == false)) {
            if (velX > 0) {
                velX -= friction;
            }
            if (velX < 0) {
                velX += friction;
            }
        }
        else {
            velY++;
        }
    }
    function edgeCollision() { // collisions with the edges of the canvas
        if (posX == 0) { // left wall collisions
            colLeft = true;
        }
        else {
            colLeft = false;
        }
        if (posY == 0) { // roof collisions (not really needed but keeping everything for reuse)
            colUp = true;
        }
        else { 
            colUp = false;
        }
        if (posX == canv.width - unit) { // reset when right wall hit
            posX = 0;
            posY = 0;
            velX = 0;
            score++;
            createArena();
        }
        else {
            colRight = false;
        }
        if (posY == canv.height - unit) { // reset position when hitting bottome
            posX = 0;
            posY = 0;
            velX = 0;
        }
        else {
            colDown = false;
        }
    }
    function arenaCollision() { // collision with the arena
        for (y = 0; y < arenaY; y++) {
            for (x = 0; x < arenaX; x++) {
                if (arena[y][x] == 1) {
                    if ((posY + unit > y * arenaUnit) && (posY < (y + 1) * arenaUnit)) { // side collisions
                        if (posX + unit == x * arenaUnit) {
                            colRight = true;                            
                        }
                        if (posX == (x + 1) * arenaUnit) {
                            colLeft = true;
                        }
                    }
                    if ((posX + unit > x * arenaUnit) && (posX < (x + 1) * arenaUnit)) { // top collisions
                        if (posY + unit == y * arenaUnit) {
                            colDown = true;
                        }
                        if (posY == (y + 1) * arenaUnit) {
                            colUp = true;
                        }
                    }
                }
            }
        }
    }
    function draw() { // draws stuff
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height); // backdrop
        ctx.fillStyle = "lime"; 
        ctx.fillRect(posX, posY, unit, unit); // player
        ctx.fillStyle = "white";
        for (y = 0; y < arenaY; y++) {
            for (x = 0; x < arenaX; x++) {
                if (arena[y][x] == 1) {
                    
                    ctx.fillRect(x * arenaUnit, y * arenaUnit, arenaUnit, arenaUnit); // arena
                }
            }
        }
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Get to the right wall to score a point!", canv.width / 2, canv.height / 5);
        ctx.fillText("Score: " + score, canv.width / 2, canv.height / 3)
        window.requestAnimationFrame(draw); // animation
    }
    window.requestAnimationFrame(draw);
}