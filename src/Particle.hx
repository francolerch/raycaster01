import Helpers;

class Particle {
    public var rays : Array<Ray>;
    public var a : Point;
    public var walls : Array<Wall>;

    public function new(boxes:Array<Box>, walls:Array<Wall>) {
        this.a = {
            x: 0,
            y: 0
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
        updatePos();
        this.rays = this.removeDuplicates(this.rays);
        for (r in rays) {
            r.update(this.a);
            r.castTo(walls);
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
}