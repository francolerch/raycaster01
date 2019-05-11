import Main.Point;
import Main.ctx;

class Wall {
	public var a:Point;
	public var b:Point;

	public function new(ax:Float, ay:Float, bx:Float, by:Float) {
		this.a = {
			x: ax,
			y: ay
		};
		this.b = {
			x: bx,
			y: by
		};
	}

	public function draw() {
		ctx.strokeStyle = '#999';
		ctx.beginPath();
		ctx.moveTo(this.a.x, this.a.y );
		ctx.lineTo(this.b.x, this.b.y);
		ctx.closePath();
		ctx.stroke();
	}
}
