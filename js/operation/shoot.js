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
            canvasSource, 414, 0, screenshotWidth, screenshotHeight);

        contextScreenshot.drawImage(
            canvasOverlay, 414, 0, screenshotWidth, screenshotHeight);


        // Save to a data URL as a jpeg quality 9
        var imgUrl = bufferScreenshot.toDataURL("image/jpeg", .9);

        // StartAnimating(); // Restart the animation loop
        return imgUrl;
    }


    return {shoot: takeScreenshot};
});