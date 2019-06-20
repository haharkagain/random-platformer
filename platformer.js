window.addEventListener("load", platformer, false);
function platformer() {
    canv = document.getElementById("platformer");
    ctx = canv.getContext("2d");
    var unit = 50;
    var posX = 0;
    var posY = 0;
    var velX = 0;
    var velY = 0;
    var maxVel = 10;
    var acc = 1;
    var friction = 1;
    var jump = -20;
    var left = false;
    var up = false;
    var right = false;
    var down = false;
    var ground = false;
    var leftEdge = false;
    var rightEdge = false;
    setInterval(function(){
        move();
    }, 1000/60)
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
    function move() {  
        if (left) {
            if (ground) {
                if (leftEdge == false) {
                    if (velX > -maxVel) {
                        velX -= acc;
                        rightEdge = false;
                    }
                }
            }
        }
        if (right) {
            if (ground) {
                if (rightEdge == false) {
                    if (velX < maxVel) {
                        velX += acc;
                        leftEdge = false;
                    }
                }
            }
        }
        if (up) {
            if (ground) {
                velY = jump;
                ground = false;
            }
            
        } 
        nature();
        collision();
        posX += velX;
        posY += velY;
    }
    function nature() {
        if (ground) {
            if (velX > 0) {
                if (right == false) {
                    velX -= friction;
                    if (velX < 0) {
                        velX = 0;
                    }
                }
                
            }
            if (velX < 0) {
                if (left == false) {
                    velX += friction;
                    if (velX > 0) {
                        velX = 0;
                    }
                }
                
            }
        }
        else {
            velY += 1;
        }
    }
    function collision() {
        if (posX > canv.width - unit) {
            velX = 0;
            posX = canv.width - unit;
            rightEdge = true;    
        }
        if (posX < 0) {
            velX = 0;
            posX = 0;
            leftEdge = true;    
        }
        if (posY > canv.height - unit) {
            velY = 0;
            posY = canv.height - unit;
            ground = true;    
        }
        if (posY < 0) {
            velY = 0;
            posY = 0;    
        }
    }
    function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);
        ctx.fillStyle = "lime";
        ctx.fillRect(posX, posY, unit, unit);
        ctx.fillStyle = "red";
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(velX, canv.width / 2, canv.height / 2);
        ctx.fillText(velY, canv.width / 2, canv.height / 2 + 30);
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}