import js.Browser;

class Boot {
    private static var inst : Main;

    public function new() {}

    static function main() {
        var centerElement = Browser.document.getElementById('canvas');
        var canvas = Browser.document.createCanvasElement();
        centerElement.appendChild(canvas);
        Browser.window.addEventListener('keydown', function (event){
            if (event.code == 'KeyR')
                Browser.window.location.reload();
        });

        canvas.height = 600;
        canvas.width = 600;

        if (canvas.getContext != null) {
            Boot.inst = new Main(canvas);
            Browser.window.onload = Boot.inst.drawLoop;
        }
    }
}