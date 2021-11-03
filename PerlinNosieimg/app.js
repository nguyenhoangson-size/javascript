var inc = 0.1;
var scl = 100;
var cols;
var rows;

var zoff = 0;
var fr;
var particles = [];

var flowfeild;

var img;

function preload(){
	img = loadImage("./anhcu.jpg");
}

function setup() {
	createCanvas(img.width, img.height);


	//colorMode(HSB, 255);
	cols = floor(width / scl);
	rows = floor(height / scl);

	flowfield = new Array(cols * rows);

	for (var i = 0; i < 300; i++) {
		particles[i] = new Particle();
	}
	background(255);
}

function draw(){
	//background(240);

	var yoff = 0;

	for (var y = 0; y < rows; y++) {
		var xoff = 0;
		for (var x = 0; x < cols; x++) {
			var index = x + y * cols;
			var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
			var v = p5.Vector.fromAngle(angle);
			v.setMag(1);
			flowfield[index] = v;
			xoff += inc;
			stroke(0, 50);
		}
		yoff += inc;

		zoff += random(0.0001, 0.0001);
	}

	for (var i = 0; i < particles.length; i++) {
		particles[i].follow(flowfield);
		particles[i].update();
		particles[i].edges();
		particles[i].draw();
	}


}

class Particle{
	constructor(){

		this.pos = createVector(random(width), random(height));
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);

		this.maxSpeed = 20;
		this.h = 0;
		this.cc = color(200, 0, 0);

		this.prevPos = this.pos.copy();

	}

	update(){
			this.vel.add(this.acc);
			this.vel.limit(this.maxSpeed);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}

		follow(vectors){
			var x = floor(this.pos.x/scl);
			var y = floor(this.pos.y/scl);
			var index = x + y * cols;
			var force = vectors[index];
			this.applyForce(force);
		}

		applyForce(force){
			this.acc.add(force);
		}

		draw(){

			var newColour = color(img.get(this.pos.x, this.pos.y));
			stroke(red(newColour), green(newColour), blue(newColour), 30);
			this.h = this.h + 1;
			if (this.h > 100){
				this.h = 0;
			}

			//strokeWeight(1);
			line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos
				.y);
			this.updatePrev();
		}

		updatePrev(){
			this.prevPos.x = this.pos.x;
			this.prevPos.y = this.pos.y;
		}

		edges(){
			if(this.pos.x > width){
				this.pos.x = 0;
				this.updatePrev();
			}
			if(this.pos.x < 0){
				this.pos.x = width;
				this.updatePrev();
			}
			if(this.pos.y > height){
				this.pos.y = 0;
				this.updatePrev();
			}
			if (this.pos.y < 0){
				this.pos.y = height;
				this.updatePrev();
			}
		}


}