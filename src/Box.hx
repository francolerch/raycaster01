import Helpers;

class Box {
    
    public var walls : Array<Wall>;
    public var corners : Array<Point>;
    public var a : Point;
    public var size : Float;
    public var rotation : Float;

    public function new(a:Point, size:Float, rotation:Float) {
        this.a = a;
        this.size = size;
        this.rotation = rotation;

        this.walls = new Array();
        this.corners = new Array();

        this.corners.push({x: this.a.x,  y: this.a.y});
        this.corners.push({x: this.a.x + size,  y: this.a.y});
        this.corners.push({x: this.a.x + size,  y: this.a.y + size});
        this.corners.push({x: this.a.x,  y: this.a.y + size});

        for (i in 0...corners.length) {
            this.corners[i] = calculateRotation(this.corners[i]);
        }

        this.walls.push(new Wall(this.corners[0], this.corners[1]));
        this.walls.push(new Wall(this.corners[1], this.corners[2]));
        this.walls.push(new Wall(this.corners[2], this.corners[3]));
        this.walls.push(new Wall(this.corners[3], this.corners[0]));
        
    }

    public function calculateRotation(a:Point) : Point {
        return rotate(this.a.x + (this.size / 2), this.a.y + (this.size / 2), a.x, a.y, this.rotation);
    }

    function rotate(cx:Float, cy:Float, x:Float, y:Float, angle:Float) : Point{
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return {
            x: nx,
            y: ny
        }
    }
}