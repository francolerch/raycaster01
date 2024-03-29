// Generated by Haxe 4.0.0-rc.2+77068e10c
(function () { "use strict";
class Boot {
	static main() {
		var centerElement = window.document.getElementById("canvas");
		var canvas = window.document.createElement("canvas");
		centerElement.appendChild(canvas);
		window.addEventListener("keydown",function(event) {
			if(event.code == "KeyR") {
				window.location.reload();
			}
		});
		canvas.height = 600;
		canvas.width = 600;
		if(canvas.getContext != null) {
			Boot.inst = new Main(canvas);
			window.onload = ($_=Boot.inst,$bind($_,$_.drawLoop));
		}
	}
}
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
class Helpers {
	static toDegrees(x) {
		return x * (180 / Math.PI);
	}
	static getDist(a,b) {
		var c1 = a.x - b.x;
		var c2 = a.y - b.y;
		return Math.sqrt(c1 * c1 + c2 * c2);
	}
}
class Main {
	constructor(canvas) {
		this.updateCanvas = true;
		this.canvas = canvas;
		Main.ctx = canvas.getContext("2d");
		this.canvas.onmousemove = $bind(this,this.onMouseMove);
		Main.boxes = [];
		this.walls = [];
		Main.boxes.push(new Box({ x : 0, y : 0},canvas.width,0));
		var _g = 0;
		while(_g < 20) {
			var i = _g++;
			var pos = { x : Math.random() * canvas.width, y : Math.random() * canvas.height};
			Main.boxes.push(new Box(pos,60,Math.random() * 360));
		}
		var _g1 = 0;
		var _g2 = Main.boxes;
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
		this.particles = [];
		this.particles.push(new Particle(Main.boxes,this.walls));
	}
	drawLoop(dt) {
		window.requestAnimationFrame($bind(this,this.drawLoop));
		if(this.updateCanvas) {
			this.update(dt);
			this.updateCanvas = false;
		}
	}
	update(dt) {
		Main.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		var _g = 0;
		var _g1 = this.walls;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			w.draw();
		}
		var _g2 = 0;
		var _g3 = this.particles;
		while(_g2 < _g3.length) {
			var p = _g3[_g2];
			++_g2;
			p.update(this.walls);
		}
	}
	onMouseMove(event) {
		Main.mouse = { x : event.layerX, y : event.layerY};
		this.updateCanvas = true;
	}
}
class Particle {
	constructor(boxes,walls) {
		this.a = { x : 150, y : 150};
		this.walls = [];
		this.rays = [];
		var _g = 0;
		while(_g < boxes.length) {
			var b = boxes[_g];
			++_g;
			var _g1 = 0;
			var _g11 = b.walls;
			while(_g1 < _g11.length) {
				var w = _g11[_g1];
				++_g1;
				this.walls.push(w);
			}
			var _g2 = 0;
			var _g3 = b.corners;
			while(_g2 < _g3.length) {
				var c = _g3[_g2];
				++_g2;
				this.rays.push(new Ray(this.a,c));
			}
		}
	}
	update(walls) {
		var intersections = [];
		this.updatePos();
		this.rays = this.removeDuplicates(this.rays);
		var _g = 0;
		var _g1 = this.rays;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			r.update(this.a);
			r.castTo(walls,intersections);
		}
		if(intersections.length > 0) {
			this.drawIntersectionsMesh(intersections);
			this.draw();
		}
	}
	updatePos() {
		this.a = Main.mouse;
	}
	removeDuplicates(array) {
		var i = 0;
		return array.filter(function(e) {
			var index = array.indexOf(e);
			var arrayToReturn = array[index].angle == array[i].angle;
			i += 1;
			return arrayToReturn;
		});
	}
	drawIntersectionsMesh(intersections) {
		if(intersections.length == 0) {
			return;
		}
		haxe_ds_ArraySort.sort(this.rays,function(e,n) {
			var eDegrees = Helpers.toDegrees(e.angle) * 100 | 0;
			var nDegrees = Helpers.toDegrees(n.angle) * 100 | 0;
			return eDegrees - nDegrees;
		});
		Main.ctx.fillStyle = "#cccccc";
		Main.ctx.moveTo(intersections[0].p.x,intersections[0].p.y);
		Main.ctx.beginPath();
		var _g = 0;
		while(_g < intersections.length) {
			var i = intersections[_g];
			++_g;
			if(i.p == intersections[0].p) {
				continue;
			}
			Main.ctx.lineTo(i.p.x,i.p.y);
		}
		Main.ctx.closePath();
		Main.ctx.fill();
	}
	draw() {
		Main.ctx.fillStyle = "#000000";
		Main.ctx.beginPath();
		Main.ctx.arc(this.a.x,this.a.y,3,0,360,false);
		Main.ctx.closePath();
		Main.ctx.fill();
	}
}
class Ray {
	constructor(a,b) {
		this.a = a;
		this.b = b;
		this.angle = this.getAngle();
		this.to = this.calculateTo();
	}
	update(a) {
		this.a = a;
		this.angle = this.getAngle();
		this.to = this.calculateTo();
	}
	calculateTo() {
		return { x : Math.cos(this.angle), y : Math.sin(this.angle)};
	}
	getAngle() {
		return Math.atan2(this.a.y - this.b.y,this.a.x - this.b.x);
	}
	castTo(walls,intersections) {
		var record = 100000000;
		var closest = null;
		var _g = 0;
		while(_g < walls.length) {
			var w = walls[_g];
			++_g;
			var pt = this.getClosestIntersection(w);
			if(pt != null) {
				var dist = Helpers.getDist(this.a,pt);
				if(dist < record) {
					record = dist;
					closest = { p : pt, w : w};
				}
			}
		}
		if(closest != null) {
			this.closest = closest;
			intersections.push(closest);
		}
	}
	getClosestIntersection(wall) {
		var x1 = wall.a.x;
		var y1 = wall.a.y;
		var x2 = wall.b.x;
		var y2 = wall.b.y;
		var x3 = this.a.x;
		var y3 = this.a.y;
		var x4 = this.a.x + this.to.x;
		var y4 = this.a.y + this.to.y;
		var den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if(den == 0) {
			return null;
		}
		var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if(t > 0 && t < 1.01 && u < 0) {
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
		var ctx = Main.ctx;
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.a.x,this.a.y);
		ctx.lineTo(this.b.x,this.b.y);
		ctx.closePath();
		ctx.stroke();
	}
}
class haxe_ds_ArraySort {
	static sort(a,cmp) {
		haxe_ds_ArraySort.rec(a,cmp,0,a.length);
	}
	static rec(a,cmp,from,to) {
		var middle = from + to >> 1;
		if(to - from < 12) {
			if(to <= from) {
				return;
			}
			var _g = from + 1;
			var _g1 = to;
			while(_g < _g1) {
				var i = _g++;
				var j = i;
				while(j > from) {
					if(cmp(a[j],a[j - 1]) < 0) {
						haxe_ds_ArraySort.swap(a,j - 1,j);
					} else {
						break;
					}
					--j;
				}
			}
			return;
		}
		haxe_ds_ArraySort.rec(a,cmp,from,middle);
		haxe_ds_ArraySort.rec(a,cmp,middle,to);
		haxe_ds_ArraySort.doMerge(a,cmp,from,middle,to,middle - from,to - middle);
	}
	static doMerge(a,cmp,from,pivot,to,len1,len2) {
		var first_cut;
		var second_cut;
		var len11;
		var len22;
		if(len1 == 0 || len2 == 0) {
			return;
		}
		if(len1 + len2 == 2) {
			if(cmp(a[pivot],a[from]) < 0) {
				haxe_ds_ArraySort.swap(a,pivot,from);
			}
			return;
		}
		if(len1 > len2) {
			len11 = len1 >> 1;
			first_cut = from + len11;
			second_cut = haxe_ds_ArraySort.lower(a,cmp,pivot,to,first_cut);
			len22 = second_cut - pivot;
		} else {
			len22 = len2 >> 1;
			second_cut = pivot + len22;
			first_cut = haxe_ds_ArraySort.upper(a,cmp,from,pivot,second_cut);
			len11 = first_cut - from;
		}
		haxe_ds_ArraySort.rotate(a,cmp,first_cut,pivot,second_cut);
		var new_mid = first_cut + len22;
		haxe_ds_ArraySort.doMerge(a,cmp,from,first_cut,new_mid,len11,len22);
		haxe_ds_ArraySort.doMerge(a,cmp,new_mid,second_cut,to,len1 - len11,len2 - len22);
	}
	static rotate(a,cmp,from,mid,to) {
		if(from == mid || mid == to) {
			return;
		}
		var n = haxe_ds_ArraySort.gcd(to - from,mid - from);
		while(n-- != 0) {
			var val = a[from + n];
			var shift = mid - from;
			var p1 = from + n;
			var p2 = from + n + shift;
			while(p2 != from + n) {
				a[p1] = a[p2];
				p1 = p2;
				if(to - p2 > shift) {
					p2 += shift;
				} else {
					p2 = from + (shift - (to - p2));
				}
			}
			a[p1] = val;
		}
	}
	static gcd(m,n) {
		while(n != 0) {
			var t = m % n;
			m = n;
			n = t;
		}
		return m;
	}
	static upper(a,cmp,from,to,val) {
		var len = to - from;
		var half;
		var mid;
		while(len > 0) {
			half = len >> 1;
			mid = from + half;
			if(cmp(a[val],a[mid]) < 0) {
				len = half;
			} else {
				from = mid + 1;
				len = len - half - 1;
			}
		}
		return from;
	}
	static lower(a,cmp,from,to,val) {
		var len = to - from;
		var half;
		var mid;
		while(len > 0) {
			half = len >> 1;
			mid = from + half;
			if(cmp(a[mid],a[val]) < 0) {
				from = mid + 1;
				len = len - half - 1;
			} else {
				len = half;
			}
		}
		return from;
	}
	static swap(a,i,j) {
		var tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
Main.mouse = { x : 0, y : 0};
Boot.main();
})();

//# sourceMappingURL=index.js.map