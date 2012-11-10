(function() {

    var canvasSource = $('#compare')[0];
    var contextSource = canvasSource.getContext('2d');

    var canvasBlended = $('#blended')[0];
    var contextBlended = canvasBlended.getContext('2d');

    var lastImageData;

    document.addEventListener("facetrackingEvent", function( event ) {

        blend();
        checkAreas();

    });


    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();


    // @See http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html
    function blend() {
        var width = canvasSource.width;
        var height = canvasSource.height;
        // get webcam image data
        var sourceData = contextSource.getImageData(0, 0, width, height);
        // create an image if the previous image doesn鈥檛 exist
        if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
        // create a ImageData instance to receive the blended result
        var blendedData = contextSource.createImageData(width, height);
        // blend the 2 images
        differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
        // draw the result in a canvas
        contextBlended.putImageData(blendedData, 0, 0);
        // store the current webcam image
        lastImageData = sourceData;
    }

    function fastAbs(value) {
        // funky bitwise, equal Math.abs
        return (value ^ (value >> 31)) - (value >> 31);
    }

    function threshold(value) {
        return (value > 0x15) ? 0xFF : 0;
    }

//    function difference(target, data1, data2) {
//        // blend mode difference
//        if (data1.length != data2.length) return null;
//        var i = 0;
//        while (i < (data1.length * 0.25)) {
//            target[4*i] = data1[4*i] == 0 ? 0 : fastAbs(data1[4*i] - data2[4*i]);
//            target[4*i+1] = data1[4*i+1] == 0 ? 0 : fastAbs(data1[4*i+1] - data2[4*i+1]);
//            target[4*i+2] = data1[4*i+2] == 0 ? 0 : fastAbs(data1[4*i+2] - data2[4*i+2]);
//            target[4*i+3] = 0xFF;
//            ++i;
//        }
//    }

    function differenceAccuracy(target, data1, data2) {
        if (data1.length != data2.length) return null;
        var i = 0;
        while (i < (data1.length * 0.25)) {
            var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
            var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
            var diff = threshold(fastAbs(average1 - average2));
            target[4*i] = diff;
            target[4*i+1] = diff;
            target[4*i+2] = diff;
            target[4*i+3] = 0xFF;
            ++i;
        }
    }

    var opAreaMap = {
        "shoot" : [448, 32, 100, 100],  //left, top, width, height
        "gender" : [901, 32, 100, 100],
        "pre" : [442, 434, 80, 80],
        "next" : [920, 434, 80, 80],
        "c1" : [950, 152, 63, 63],
        "c2" : [950, 220, 63, 63],
        "c3" : [950, 286, 63, 63],
        "c4" : [950, 351, 63, 63] // 286 + 65
    };

    var opArray = Object.keys(opAreaMap);

    function checkAreas() {
        // loop over the note areas

        opArray.forEach(function(op){


            var opArea = opAreaMap[op];

            var blendedData = contextBlended.getImageData(opArea[0] , opArea[1], opArea[2], opArea[3]); //left, top, width, height
            console.log(contextBlended, blendedData);
            var i = 0;
            var average = 0;
            // loop over the pixels
            while (i < (blendedData.data.length * 0.25)) {
                // make an average between the color channel
                average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
                ++i;
            }
            // calculate an average between of the color values of the note area
            average = Math.round(average / (blendedData.data.length * 0.25));
            if (average > 10) {
                console.log("op success:", op);
                // over a small limit, consider that a movement is detected
                // play a note and show a visual feedback to the user
//                playSound(notes[r]);
//                if(!notes[r].visual.is(':animated')) {
//                    notes[r].visual.css({opacity:1});
//                    notes[r].visual.animate({opacity:0}, 700);
//                }

            }
        });

    }


})();