define(function () {

    var canvasSource = $('#compare')[0];
    var contextSource = canvasSource.getContext('2d');

    var canvasOverlay = $('#overlay')[0];
    var overlayContext = canvasOverlay.getContext('2d');

    var screenshotHeight = 900;
    var screenshotWidth = 612;

    var CachedCanvases = {}; // Canvas element cache

    function createCanvasCached(name) {
        if (!CachedCanvases[name]) {
            var canvas = document.createElement('canvas');
            CachedCanvases[name] = canvas;
            return canvas;
        }
        return CachedCanvases[name];
    }

    function takeScreenshot() {
        //StopAnimating(); // Stop the animation loop

        var bufferScreenshot = createCanvasCached("screenshot");
        bufferScreenshot.height = screenshotHeight;
        bufferScreenshot.width = screenshotWidth;
        var contextScreenshot = bufferScreenshot.getContext("2d");

        // Draw the layers in order
        contextScreenshot.drawImage(
            canvasSource, 0, 0, screenshotWidth, screenshotHeight);

        contextScreenshot.drawImage(
            canvasOverlay, 0, 0, screenshotWidth, screenshotHeight);


        // Save to a data URL as a jpeg quality 9
        var imgUrl = bufferScreenshot.toDataURL("image/jpeg");

        // StartAnimating(); // Restart the animation loop
        return imgUrl;
    }


    var hasClass = function (el, className) {
            if (!el || !className) {
                return false;
            }
            return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
        },
        addClass = function (el, className) {
            if (!el || !className || hasClass(el, className)) {
                return;
            }
            el.className += ' ' + className;
        },
        removeClass = function (el, className) {
            if (!el || !className || !hasClass(el, className)) {
                return;
            }
            el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
        };

    //闪屏
    var flashFn = function(callback){
        var flashEle = document.querySelector('.flash');
        flashEle.style.display = 'block';
        setTimeout(function(){
            addClass(flashEle, 'show');
        }, 0);
        flashEle.addEventListener('webkitTransitionEnd', function(){
            flashEle.style.display = 'none';
            removeClass(flashEle, 'show');
            callback && callback();
        });
    };


    function shoot(){
        var imgUrl = takeScreenshot();

        var el = "<li><div class='box'> <img height='226px' width='154px' src='"+imgUrl+"'> <div class='fn'> <span class='icon-like'>0</span></div></div></li>"
        $("ul.fav li:first").after(el);

        flashFn();

    }

    return {shoot: shoot};
});