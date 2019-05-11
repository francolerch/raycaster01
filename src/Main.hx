import js.html.CanvasElement;
import js.Browser;

typedef Point = {
	var x:Float;
	var y:Float;
}

typedef Segment = {
	var a:Point;
	var b:Point;
}

class Main {
	public static var canvas:js.html.CanvasElement;
	public static var ctx:js.html.CanvasRenderingContext2D;

	private var ray:Ray;
	private var walls:Array<Wall>;
	private var updateCanvas:Bool = true;
	private var mouse : Point = {x:0, y:0};

	public function new() {
		Main.canvas.onmousemove = function(event) {
			this.mouse = {
				x: event.layerX,
				y: event.layerY
			}
			updateCanvas = true;
		}
		this.ray = new Ray(150, 300);
		this.walls = new Array();
		for (i in 0...9) 
			this.walls.push(new Wall(Math.random()*600, Math.random()*800, Math.random()*600, Math.random()*800));
		
		this.walls.push(new Wall(0, 0, canvas.width, 0));
		this.walls.push(new Wall(canvas.width, 0, canvas.width, canvas.height));
		this.walls.push(new Wall(canvas.width, canvas.height, 0, canvas.height));
		this.walls.push(new Wall(0, canvas.height, 0, 0));
	}

	public function drawLoop(dt:Float) {
		Browser.window.requestAnimationFrame(drawLoop);
		if (updateCanvas) {
			update();
			updateCanvas = false;
		}
	}

	public function update() {
		Main.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.ray.lookAt(this.mouse.x, this.mouse.y);
		var record : Float = 100000000;
		var closest = {x:0., y:0., t: 10000000000.};

		for (w in walls) {
			w.draw();

			var pt = this.ray.castTo(w);
			if(pt != null) {
				var dist = getDist(this.ray.a, pt);
				if (dist < record) {
					record = dist;
					closest = pt;
				}
				
				
			}

			
			
			
		}

		ctx.strokeStyle = '#FF0000';
		ctx.beginPath();
		ctx.moveTo(this.ray.a.x, this.ray.a.y);
		ctx.lineTo(closest.x, closest.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(closest.x, closest.y, 6, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
		

		
		
		//trace(pt);

		this.ray.draw();
	}

	public function getDist(a:Point, b:Point) : Float{
		var c1 = a.x - b.x;
		var c2 = a.y - b.y;
		return Math.sqrt(c1*c1 + c2*c2);
	}

	static function main() {
		//var center = Browser.document.createDivElement();
		//center.setAttribute('style', 'text-align: center');
		
		Main.canvas = Browser.document.createCanvasElement();
		Main.canvas.height = 800;
		Main.canvas.width = 600;
		Main.canvas.setAttribute('text-align', 'center');
		//center.appendChild(Main.canvas);
		Browser.document.body.appendChild(Main.canvas);

		if (Main.canvas.getContext != null) {
			Main.ctx = Main.canvas.getContext('2d');
			var main = new Main();
			Browser.window.onload = main.drawLoop;
		}
	}
}
