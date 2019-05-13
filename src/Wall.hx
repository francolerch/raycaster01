import Helpers;

class Wall {
    public var a:Point;
    public var b:Point;

    public function new(a:Point, b:Point) {
        this.a = {
            x: a.x,
            y: a.y
        };
        this.b = {
            x: b.x,
            y: b.y
        };
    }

    public function draw() {
        var ctx = Main.ctx;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y );
        ctx.lineTo(this.b.x, this.b.y);
        ctx.closePath();
        ctx.stroke();
    }
}
