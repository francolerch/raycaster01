import js.html.MouseEvent;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import Helpers;
import js.Browser;

class Main {
    public static var ctx:CanvasRenderingContext2D;
    public static var boxes:Array<Box>;
    public static var mouse : Point = {x:0, y:0};

    private var canvas:CanvasElement;
    private var particle:Particle;
    private var walls:Array<Wall>;
    private var updateCanvas:Bool = true;

    public function new(canvas:CanvasElement) {
        this.canvas = canvas;
        Main.ctx = canvas.getContext('2d');
        this.canvas.onmousemove = this.onMouseMove;

        boxes = new Array();
        this.walls = new Array();
        boxes.push(new Box({x: 0, y: 0}, canvas.width, 0));

        for (i in 0...20) {
            var pos = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            }
            boxes.push(new Box(pos, 60, Math.random() * 360));
        }
        for (b in boxes) {
            for (w in b.walls) {
                this.walls.push(w);
            }
        }
        this.particle = new Particle(boxes, walls);
    }

    public function drawLoop(dt:Float) {
        Browser.window.requestAnimationFrame(drawLoop);
        if (updateCanvas) {
            update(dt);
            updateCanvas = false;
        }
    }

    private function update(dt:Float) {
        Main.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (w in walls)
            w.draw();
        this.particle.update(walls);
    }

    private function onMouseMove(event:MouseEvent){
        Main.mouse = {
            x: event.layerX,
            y: event.layerY
        }
        this.updateCanvas = true;
    }
}
