import Main.Point;

class Ray {
	public var a:Point;
	public var b:Point;

	public function new(a:Point, b:Point) {
		this.a = a;
		this.b = b;
	}

	public function updatePos(a:Point) {
		this.a = a;
	}

	public function castTo(wall:Wall) {
		var x1 = wall.a.x;
		var y1 = wall.a.y;
		var x2 = wall.b.x;
		var y2 = wall.b.y;

		var x3 = this.a.x;
		var y3 = this.a.y;
		var x4 = this.a.x + this.b.x;
		var y4 = this.a.y + this.b.y;

		var den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return null;
		}

		var t = ((x1-x3) * (y3-y4) - (y1-y3) * (x3-x4)) / den;
		var u = -((x1-x2) * (y1-y3) - (y1-y2) * (x1-x3)) / den;

		if (t > 0 && t < 1 && u > 0) {
			return {
				x: x1+t*(x2-x1),
				y: y1+t*(y2-y1)
			}
		}

		return null;
	}
}
