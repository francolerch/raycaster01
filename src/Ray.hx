import Helpers;

class Ray {
    public var a:Point;
    public var b:Point;
    public var to:Point;
    public var angle:Float;

    public function new(a:Point, b:Point) {
        this.a = a;
        this.b = b;
        this.angle = getAngle();
        this.to = calculateTo();
    }

    public function update(a:Point) {
        this.a = a;
        this.angle = getAngle();
        this.to = calculateTo();
    }

    private function calculateTo() : Point {
        return {
            x: Math.cos(this.angle),
            y: Math.sin(this.angle)
        };
    }

    public function getAngle() {
        return Math.atan2(this.a.y - this.b.y, this.a.x - this.b.x);
    }

    public function castTo(walls:Array<Wall>) {
        var record : Float = 100000000;
        var closest:Point = null;

        for (w in walls) {
            var pt = getClosestIntersection(w);

            if(pt != null) {
                var dist = Helpers.getDist(this.a, pt);
                if (dist < record) {
                    record = dist;
                    closest = pt;
                }
            }
        }

        if (closest != null) {
            draw(closest);
        }


    }

    public function getClosestIntersection(wall:Wall) {
        var x1 = wall.a.x;
        var y1 = wall.a.y;
        var x2 = wall.b.x;
        var y2 = wall.b.y;

        var x3 = this.a.x;
        var y3 = this.a.y;
        var x4 = this.a.x + this.to.x;
        var y4 = this.a.y + this.to.y;

        var den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return null;
        }

        var t = ((x1-x3) * (y3-y4) - (y1-y3) * (x3-x4)) / den;
        var u = -((x1-x2) * (y1-y3) - (y1-y2) * (x1-x3)) / den;

        if (t >= -0.01 && t <= 1.01 && u < 0) {
            return {
                x: x1+t*(x2-x1),
                y: y1+t*(y2-y1)
            }
        }

        return null;
    }

    private function draw(closest:Point) {
        drawRay(closest);
        drawHit(closest);
    }

    private function drawRay(closest:Point) {
        Main.ctx.strokeStyle = '#f55';
        Main.ctx.lineWidth = 1;
        Main.ctx.beginPath();
        Main.ctx.moveTo(this.a.x, this.a.y);
        Main.ctx.lineTo(closest.x, closest.y);
        Main.ctx.closePath();
        Main.ctx.stroke();
    }

    private function drawHit(closest:Point) {
        Main.ctx.fillStyle = '#FF0000';
        Main.ctx.beginPath();
        Main.ctx.arc(closest.x, closest.y, 5, 0, 360, false);
        Main.ctx.closePath();
        Main.ctx.fill();
    }
}
