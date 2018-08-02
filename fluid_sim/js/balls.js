/*
 *	Global Data Start
 */

var c1 = ctx1 = false;
var c2 = ctx2 = false;
var frameRate = 1/50; // Seconds
var frameDelay = frameRate * 1000; // ms
var loopTimer = false;
var yframe = 0;

/*
 * Experiment with values of mass, radius, restitution,
 * gravity (ag), and density (rho)!
 * 
 * Changing the constants literally changes the environment
 * the ball is in. 
 * 
 * Some settings to try:
 * the moon: ag = 1.6
 * water: rho = 1000, mass 5
 * beach ball: mass 0.05, radius 30
 * lead ball: mass 10, restitution -0.05
 */

// Ball Data:
var selectedBall = 0;
var balls = [
	// Ball 0, rubber
	{
		// --Initial position-- 
	    position: {x: false, y: false},
	    velocity: {x: 0, y: 0},
	    acc: {x: 0, y: 0},
	    // --Change ball data--
	    density: 920, // kg/m^3
	    radius: 30, // 1px = 1cm
	    restitution: -0.828,
	    Cd: 0.47,  // Dimensionless
	    colour: 'red',
	    // --Calculated automatically--
	    mass: false, //kg
	    A: false,
	    V: false,
	    buoyancy: false,
	},
	// Ball 1, wood
	{
		// --Initial position-- 
	    position: {x: false, y: false},
	    velocity: {x: 0, y: 0},
	    acc: {x: 0, y: 0},
	    // --Change ball data--
	    density: 800, // kg/m^3
	    radius: 20, // 1px = 1cm
	    restitution: -0.403,
	    Cd: 0.47,  // Dimensionless
	    colour: 'brown',
	    // --Calculated automatically--
	    mass: false, //kg
	    A: false,
	    V: false,
	    buoyancy: false,
	},
	// Ball 2, beach ball
	{
		// --Initial position-- 
	    position: {x: false, y: false},
	    velocity: {x: 0, y: 0},
	    acc: {x: 0, y: 0},
	    // --Change ball data--
	    density: 5.338, // kg/m^3
	    radius: 30, // 1px = 1cm
	    restitution: -0.752,
	    Cd: 0.47,  // Dimensionless
	    colour: 'pink',
	    // --Calculated automatically--
	    mass: false, //kg
	    A: false,
	    V: false,
	    buoyancy: false,
	},
	// Ball 3, lead
	{
		// --Initial position-- 
	    position: {x: false, y: false},
	    velocity: {x: 0, y: 0},
	    acc: {x: 0, y: 0},
	    // --Change ball data--
	    density: 11340, // kg/m^3
	    radius: 2, // 1px = 1cm
	    restitution: -0.08,
	    Cd: 0.47,  // Dimensionless
	    colour: 'black',
	    // --Calculated automatically--
	    mass: false, //kg
	    A: false,
	    V: false,
	    buoyancy: false,
	},

];

// Environment Data:

//var rho = 1.22; // kg / m^3
var rho = 1000; // oil
var ag = 9.81;  // m / s^2

var mouse = {x: 0, y: 0, isDown: false};

// Calculate the area, volume, mass and buoyancy for each ball
for(i = 0; i < balls.length; i++)
{
	balls[i].A = Math.PI * balls[i].radius * balls[i].radius / (10000); // m^2
	balls[i].V = 4 / 3 * Math.PI * balls[i].radius * balls[i].radius * balls[i].radius / 1000000;
	balls[i].mass = balls[i].density * balls[i].V; // kg/m^3
	balls[i].buoyancy = rho * balls[i].V * ag;
}
console.log(balls);

/*
 *	Global Data End
 */



/*
 *	Virtual Environment Functionality Start
 */

function c1_getMousePosition(e) {
    mouse.x = e.pageX - c1.offsetLeft;
    mouse.y = e.pageY - c1.offsetTop;
}

function c1_mouseDown(e) {
    if (e.which == 1) {
        c1_getMousePosition(e);
        mouse.isDown = true;
        balls[selectedBall].position.x = mouse.x;
        balls[selectedBall].position.y = mouse.y;
    }
}

function c1_mouseUp(e) { 
    if (e.which == 1) {
        mouse.isDown = false;
        balls[selectedBall].velocity.y = (balls[selectedBall].position.y - mouse.y) / 10;
        balls[selectedBall].velocity.x = (balls[selectedBall].position.x - mouse.x) / 10;
    }
}

function c2_mouseDown(e) {
	// Select Ball
	if (e.which == 1) {
		mouse.x = e.pageX - c1.offsetLeft;
    	selectedBall = Math.floor(mouse.x / (c2.width/12));
    	balls[selectedBall].position.x = c1.width/2;
		balls[selectedBall].position.y = c1.height/5;
		balls[selectedBall].velocity.x = 0;
		balls[selectedBall].velocity.y = 0;
		balls[selectedBall].acc.x = 0;
		balls[selectedBall].acc.y = 0; 
	}
}

function init_balls(){
	// Initialize balls menu
	let blen = c2.width/12;
	let center = c2.height/2;
	for (i = 0; i < balls.length; i++)
	{
		ctx2.beginPath();
		ctx2.fillStyle = balls[i].colour;
		ctx2.arc(i * blen + blen/2, center, balls[i].radius, 0, Math.PI*2, true);
		ctx2.fill();
		ctx2.closePath();
	}

	console.log('intialized balls');
}

function resizeCanvas() {
    c1.width = window.innerWidth * 0.9;
    c1.height = window.innerHeight * 0.7;

    c2.width = window.innerWidth * 0.9;
    c2.height = window.innerHeight * 0.1;

    init_balls();

    console.log('resized canvas');
}

function initialize() {
	// Register an event listener to call the resizeCanvas() function 
	// each time the window is resized.
	window.addEventListener('resize', resizeCanvas, false);

	// Draw canvas border for the first time.
	resizeCanvas();

	// Initialize first ball position
	balls[selectedBall].position.x = c1.width/2;
	balls[selectedBall].position.y = c1.height/5;
}

function setup() {
    c1 = document.getElementById("fluids");
    c2 = document.getElementById("balls");
    ctx1 = c1.getContext("2d");
    ctx2 = c2.getContext("2d");

    initialize();
    
    c1.onmousemove = c1_getMousePosition;
    c1.onmousedown = c1_mouseDown;
    c1.onmouseup = c1_mouseUp;

    c2.onmousedown = c2_mouseDown;
    
    ctx1.strokeStyle = '#000000';
    loopTimer = setInterval(loop, frameDelay);
}

function disp() {
	$("#Velocity").empty();
    $("#Acceleration").empty();
    $("#Distance").empty();
    $('#Velocity').append('x: '+(balls[selectedBall].velocity.x).toFixed(2)+'m/s y: '
    	+(balls[selectedBall].velocity.y).toFixed(2)+'m/s');
    $('#Acceleration').append('x: '+(balls[selectedBall].acc.x).toFixed(2)+'m/s^2 y: '
    	+(balls[selectedBall].acc.y).toFixed(2)+'m/s^2');
    let ypos = balls[selectedBall].position.y + yframe;
    $('#Distance').append('x: '+(balls[selectedBall].position.x/100).toFixed(2)+'m y: '+(ypos/100).toFixed(2)+'m');
}

/*
 *	Virtual Environment Functionality End
 */



function loop() {
	var ball = balls[selectedBall];

    if ( ! mouse.isDown) {
        // Do physics
            // Drag force: Fd = -1/2 * Cd * A * rho * v * v
        var Fx = -0.5 * ball.Cd * ball.A * rho * ball.velocity.x * ball.velocity.x * Math.sign(ball.velocity.x);
        var Fy = -0.5 * ball.Cd * ball.A * rho * ball.velocity.y * ball.velocity.y * Math.sign(ball.velocity.y) - ball.buoyancy;
        
        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);
        
            // Calculate acceleration ( F = ma )
        ball.acc.x = Fx / ball.mass;
        ball.acc.y = ag + (Fy / ball.mass);

            // Integrate to get velocity
        ball.velocity.x += ball.acc.x*frameRate;
        ball.velocity.y += ball.acc.y*frameRate;
        
            // Integrate to get position
        ball.position.x += ball.velocity.x*frameRate*100;
        //yframe += ball.velocity.y*frameRate*100;
        ball.position.y += ball.velocity.y*frameRate*100;
    }

    // Handle collisions
    if (ball.position.y > c1.height - ball.radius) {
        ball.velocity.y *= ball.restitution;
        ball.position.y = c1.height - ball.radius;
    }
    if (ball.position.y < ball.radius) {
        ball.velocity.y *= ball.restitution;
        ball.position.y = ball.radius;
    }
    if (ball.position.x > c1.width - ball.radius) {
        ball.velocity.x *= ball.restitution;
        ball.position.x = c1.width - ball.radius;
    }
    if (ball.position.x < ball.radius) {
        ball.velocity.x *= ball.restitution;
        ball.position.x = ball.radius;
    }

    // Draw the ball
    // ctx1.clearRect(ball.position.x - ball.radius, ball.position.y - ball.radius, 2 * ball.radius, 2 * ball.radius);
    ctx1.clearRect(0,0,c1.width,c1.height);
    
    ctx1.save();
    
    ctx1.translate(ball.position.x, ball.position.y);
    ctx1.beginPath();
    ctx1.fillStyle = ball.colour;
    ctx1.arc(0, 0, ball.radius, 0, Math.PI*2, true);
    ctx1.fill();
    ctx1.closePath();
    
    ctx1.restore();



    // Draw the slingshot
    if (mouse.isDown) {
        ctx1.beginPath();
        ctx1.moveTo(ball.position.x, ball.position.y);
        ctx1.lineTo(mouse.x, mouse.y);
        ctx1.stroke();
        ctx1.closePath();

    }

    disp();
}

//setup();
