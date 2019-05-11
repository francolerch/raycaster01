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

	private var particle:Particle;
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
		this.particle = new Particle(150, 300);
		this.walls = new Array();
		for (i in 0...9) 
			this.walls.push(
				new Wall(
					Math.random()*canvas.height,
					Math.random()*canvas.height,
					Math.random()*canvas.height,
					Math.random()*canvas.height
				)
			);
		
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
		this.particle.updatePos(mouse);
		Main.ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (w in walls)
			w.draw();
		this.particle.look(walls);
	}

	static function main() {
		var centerElement = Browser.document.getElementById('canvas');
		Main.canvas = Browser.document.createCanvasElement();
		Main.canvas.height = 800;
		Main.canvas.width = 600;
		centerElement.appendChild(Main.canvas);
		Browser.window.addEventListener('keydown', function (event){
			if (event.code == 'KeyR')
				Browser.window.location.reload();
		});

		if (Main.canvas.getContext != null) {
			Main.ctx = Main.canvas.getContext('2d');
			var main = new Main();
			Browser.window.onload = main.drawLoop;
		}
	}
}
