import Helpers;

class Particle {
    public var rays : Array<Ray>;
    public var a : Point;
    public var walls : Array<Wall>;

    public function new(boxes:Array<Box>, walls:Array<Wall>) {
        this.a = {
            x: 150,
            y: 150
        };

        this.walls = new Array<Wall>();
        this.rays = new Array<Ray>();

        for (b in boxes) {
            for (w in b.walls) {
                this.walls.push(w);
            }
            for (c in b.corners) {
                this.rays.push(new Ray(this.a, c));
            }
        }
    }

    public function update(walls) {
        var intersections = new Array<Intersection>();
        updatePos();
        this.rays = this.removeDuplicates(this.rays);
        for (r in rays) {
            r.update(this.a);
            r.castTo(walls, intersections);
        }
        if (intersections.length > 0) {
            drawIntersectionsMesh(intersections);
            //drawIntersectionsRays();
            draw();
        }
    }

    private function updatePos() {
        this.a = Main.mouse;
    }

    private function removeDuplicates(array:Array<Ray>) : Array<Ray> {
        var i = 0;
        return array.filter(function (e:Ray) {
            var index = array.indexOf(e);
            var arrayToReturn = array[index].angle == array[i].angle;
            i++;
            return arrayToReturn;
        });
    }

    private function drawIntersectionsMesh(intersections:Array<Intersection>) {
        if (intersections.length == 0)
            return;
        haxe.ds.ArraySort.sort(rays, function (e:Ray, n:Ray) {
            var eDegrees = Std.int(Helpers.toDegrees(e.angle) * 100);
            var nDegrees = Std.int(Helpers.toDegrees(n.angle) * 100);
            return eDegrees - nDegrees;
        });

        Main.ctx.fillStyle = '#cccccc';
        Main.ctx.moveTo(intersections[0].p.x, intersections[0].p.y);
        Main.ctx.beginPath();
        for (i in intersections) {
            if (i.p == intersections[0].p)
                continue;
            Main.ctx.lineTo(i.p.x, i.p.y);
        }
        Main.ctx.closePath();
        Main.ctx.fill();
    }

    private function drawIntersectionsRays() {
        for (r in rays)
            if (r.closest != null)
            r.draw();
    }

    private function draw() {
        Main.ctx.fillStyle = '#000000';
        Main.ctx.beginPath();
        Main.ctx.arc(this.a.x, this.a.y, 3, 0, 360, false);
        Main.ctx.closePath();
        Main.ctx.fill();
    }
}