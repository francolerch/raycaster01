// Generated by Haxe 4.0.0-rc.2+77068e10c
(function () { "use strict";
class Box {
	constructor(a,size,rotation) {
		this.a = a;
		this.size = size;
		this.rotation = rotation;
		this.walls = [];
		this.corners = [];
		this.corners.push({ x : this.a.x, y : this.a.y});
		this.corners.push({ x : this.a.x + size, y : this.a.y});
		this.corners.push({ x : this.a.x + size, y : this.a.y + size});
		this.corners.push({ x : this.a.x, y : this.a.y + size});
		var _g = 0;
		var _g1 = this.corners.length;
		while(_g < _g1) {
			var i = _g++;
			this.corners[i] = this.calculateRotation(this.corners[i]);
		}
		this.walls.push(new Wall(this.corners[0],this.corners[1]));
		this.walls.push(new Wall(this.corners[1],this.corners[2]));
		this.walls.push(new Wall(this.corners[2],this.corners[3]));
		this.walls.push(new Wall(this.corners[3],this.corners[0]));
	}
	calculateRotation(a) {
		return this.rotate(this.a.x + this.size / 2,this.a.y + this.size / 2,a.x,a.y,this.rotation);
	}
	rotate(cx,cy,x,y,angle) {
		var radians = Math.PI / 180 * angle;
		var cos = Math.cos(radians);
		var sin = Math.sin(radians);
		var nx = cos * (x - cx) + sin * (y - cy) + cx;
		var ny = cos * (y - cy) - sin * (x - cx) + cy;
		return { x : nx, y : ny};
	}
}
class Main {
	constructor() {
		this.mouse = { x : 0, y : 0};
		this.updateCanvas = true;
		var _gthis = this;
		Main.canvas.onmousemove = function(event) {
			_gthis.mouse = { x : event.layerX, y : event.layerY};
			_gthis.updateCanvas = true;
		};
		this.particle = new Particle(150,300);
		this.boxes = [];
		this.walls = [];
		this.boxes.push(new Box({ x : 0, y : 0},Main.canvas.width,0));
		var _g = 0;
		while(_g < 20) {
			var i = _g++;
			var pos = { x : Math.random() * Main.canvas.width, y : Math.random() * Main.canvas.height};
			this.boxes.push(new Box(pos,60,Math.random() * 360));
		}
		var _g1 = 0;
		var _g2 = this.boxes;
		while(_g1 < _g2.length) {
			var b = _g2[_g1];
			++_g1;
			var _g11 = 0;
			var _g21 = b.walls;
			while(_g11 < _g21.length) {
				var w = _g21[_g11];
				++_g11;
				this.walls.push(w);
			}
		}
	}
	drawLoop(dt) {
		window.requestAnimationFrame($bind(this,this.drawLoop));
		if(this.updateCanvas) {
			this.update();
			this.updateCanvas = false;
		}
	}
	update() {
		this.particle.updatePos(this.mouse);
		Main.ctx.clearRect(0,0,Main.canvas.width,Main.canvas.height);
		var _g = 0;
		var _g1 = this.walls;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			w.draw();
		}
		this.particle.look(this.walls);
	}
	static main() {
		var centerElement = window.document.getElementById("canvas");
		Main.canvas = window.document.createElement("canvas");
		Main.canvas.height = 600;
		Main.canvas.width = 600;
		centerElement.appendChild(Main.canvas);
		window.addEventListener("keydown",function(event) {
			if(event.code == "KeyR") {
				window.location.reload();
			}
		});
		if(Main.canvas.getContext != null) {
			Main.ctx = Main.canvas.getContext("2d");
			var main = new Main();
			window.onload = $bind(main,main.drawLoop);
		}
	}
}
class Particle {
	constructor(x,y) {
		this.raysAmount = 50;
		this.a = { x : x, y : y};
		this.rays = [];
		var i = Math.PI * 2 / this.raysAmount;
		while(i < Math.PI * 2) {
			i += Math.PI * 2 / this.raysAmount;
			var b = { x : Math.cos(this.toRadians(i)), y : Math.sin(this.toRadians(i))};
			this.rays.push(new Ray(this.a,b));
		}
	}
	updatePos(a) {
		this.a = a;
	}
	look(walls) {
		var _g = 0;
		var _g1 = this.rays;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			r.updatePos(this.a);
			var record = 100000000;
			var closest = null;
			var _g2 = 0;
			while(_g2 < walls.length) {
				var w = walls[_g2];
				++_g2;
				var pt = r.castTo(w);
				if(pt != null) {
					var dist = this.getDist(r.a,pt);
					if(dist < record) {
						record = dist;
						closest = pt;
					}
				}
			}
			if(closest != null) {
				Main.ctx.strokeStyle = "#f55";
				Main.ctx.lineWidth = 1;
				Main.ctx.beginPath();
				Main.ctx.moveTo(this.a.x,this.a.y);
				Main.ctx.lineTo(closest.x,closest.y);
				Main.ctx.closePath();
				Main.ctx.stroke();
				Main.ctx.fillStyle = "#FF0000";
				Main.ctx.beginPath();
				Main.ctx.arc(closest.x,closest.y,5,0,360,false);
				Main.ctx.closePath();
				Main.ctx.fill();
			}
		}
	}
	toRadians(x) {
		return x * (180 / Math.PI);
	}
	getDist(a,b) {
		var c1 = a.x - b.x;
		var c2 = a.y - b.y;
		return Math.sqrt(c1 * c1 + c2 * c2);
	}
}
class Ray {
	constructor(a,b) {
		this.a = a;
		this.b = b;
	}
	updatePos(a) {
		this.a = a;
	}
	castTo(wall) {
		var x1 = wall.a.x;
		var y1 = wall.a.y;
		var x2 = wall.b.x;
		var y2 = wall.b.y;
		var x3 = this.a.x;
		var y3 = this.a.y;
		var x4 = this.a.x + this.b.x;
		var y4 = this.a.y + this.b.y;
		var den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if(den == 0) {
			return null;
		}
		var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if(t > 0 && t < 1 && u > 0) {
			return { x : x1 + t * (x2 - x1), y : y1 + t * (y2 - y1)};
		}
		return null;
	}
}
class Wall {
	constructor(a,b) {
		this.a = { x : a.x, y : a.y};
		this.b = { x : b.x, y : b.y};
	}
	draw() {
		Main.ctx.strokeStyle = "#000000";
		Main.ctx.lineWidth = 2;
		Main.ctx.beginPath();
		Main.ctx.moveTo(this.a.x,this.a.y);
		Main.ctx.lineTo(this.b.x,this.b.y);
		Main.ctx.closePath();
		Main.ctx.stroke();
	}
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
Main.main();
})();