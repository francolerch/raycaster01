typedef Point = {
    var x:Float;
    var y:Float;
}

typedef Intersection = {
    var p:Point;
    var w:Wall;
}

class Helpers {
    public static function toDegrees(x:Float) : Float {
        return x * (180/Math.PI);
    }

    public static function toRadians(x:Float) : Float {
        return x * (Math.PI/180);
    }

    public static function getDist(a:Point, b:Point) : Float {
        var c1 = a.x - b.x;
        var c2 = a.y - b.y;
        return Math.sqrt(c1*c1 + c2*c2);
    }
}