import Main.Point;
import Main.ctx;

class Particle {

    public var rays : Array<Ray>;
    public var a : Point;

    public function new(x:Float, y:Float) {
        this.a = {
            x: x,
            y: y
        };

        this.rays = new Array();

        for (i in 0...360) {
            var b = {
                x: Math.cos(toRadians(i)),
                y: Math.sin(toRadians(i))
            };

            this.rays.push(new Ray(this.a, b));
        }

    }

    public function updatePos(a:Point) {
        this.a = a;
    }

    public function draw() {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.a.x, this.a.y,5,0,360,false);
        ctx.closePath();
        ctx.fill();
    }

    public function look(walls:Array<Wall>) {
		for (r in this.rays) {
            r.updatePos(this.a);
            var record : Float = 100000000;
		    var closest:Point = null;
			for (w in walls) {
                var pt = r.castTo(w);

                if(pt != null) {
                    var dist = getDist(r.a, pt);
                    if (dist < record) {
                        record = dist;
                        closest = pt;
                    }
                }
			}

            if (closest != null) {
                ctx.strokeStyle = '#FF0000';
                ctx.beginPath();
                ctx.moveTo(this.a.x, this.a.y);
                ctx.lineTo(closest.x, closest.y);
                ctx.closePath();
                ctx.stroke();
            }
		}
      
    }

	public function toRadians(x:Float) : Float {
		return x * (180/Math.PI);
	}

    public function getDist(a:Point, b:Point) : Float{
		var c1 = a.x - b.x;
		var c2 = a.y - b.y;
		return Math.sqrt(c1*c1 + c2*c2);
	}
}