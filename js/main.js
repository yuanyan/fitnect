define(function(require) {

    var debug = false;
    var zoom = 1.1;
    if(location.hash){
        debug = true;
        zoom = parseFloat(location.hash.slice(1));
    }

    var operation = require('./operation');
    var cloth = require('./operation/cloth');
    var gender = require('./operation/gender');
    var shoot = require('./operation/shoot');
    var sidebar = require('./sidebar');
    var voice = require('./voice');

    // put all your jQuery goodness in here.
    var videoInput = document.getElementById('vid');
    var canvasInput = document.getElementById('compare');
    var canvasOverlay = document.getElementById('overlay');

    var overlayContext = canvasOverlay.getContext('2d');

    canvasOverlay.style.position = "absolute";
    canvasOverlay.style.top = '0px';
    canvasOverlay.style.zIndex = '1';
    canvasOverlay.style.display = 'block';

//    var debugOverlay = document.getElementById('debug');
//    debugOverlay.style.position = "absolute";
//    debugOverlay.style.top = '0px';
//    debugOverlay.style.zIndex = '2';
//    debugOverlay.style.display = 'none';


//    document.addEventListener("headtrackrStatus", function(event) {
//        if (event.status in supportMessages) {
//            var messagep = document.getElementById('gUMMessage');
//            messagep.innerHTML = supportMessages[event.status];
//
//        } else if (event.status in statusMessages) {
//            var messagep = document.getElementById('headtrackerMessage');
//            messagep.innerHTML = statusMessages[event.status];
//        }
//
//        console.log("headtrackrStatus:", event.status);
//    }, true);

    // the face tracking setup

    var htracker = new headtrackr.Tracker({
        altVideo : {mp4 : "./media/demo.mp4"},
        calcAngles : true,
        ui : false,
        headPosition : true
        //,debug : debugOverlay
    });

    htracker.init(videoInput, canvasInput);
    htracker.start();

    // for each facetracking event received draw rectangle around tracked face on canvas
    cloth.img = new Image();

    var zoomedClothSize = {
        width: 0,
        height: 0
    };

    function clothSelect(){
        cloth.img.src=  "./cloth/c6.png";
        cloth.img.onload = function(){
            zoomedClothSize = getZoomedSize(cloth.img, zoom);
            cloth.setClothDisplay(1);
        };

    }

    clothSelect();

    var xOffsetCloth = -120,
        yOffsetCloth = 44;

    function getZoomedSize(img, multiple){
        // console.dir(img);
        //debugger;
        return {
            width: img.width * multiple,
            height: img.height * multiple
        };
    }


//    var opAreaMap = {
//        "shoot" : [448, 32, 100, 100],  //left, top, width, height
//        "gender" : [901, 32, 100, 100],
//        "pre" : [442, 434, 80, 80],
//        "next" : [920, 434, 80, 80],
//        "c1" : [950, 152, 63, 63],
//        "c2" : [950, 220, 63, 63],
//        "c3" : [950, 286, 63, 63],
//        "c4" : [950, 351, 63, 63] // 286 + 65
//    };
//
//    var opArray = Object.keys(opAreaMap);


    // add some custom messaging

//    var statusMessages = {
//        "whitebalance" : "checking for stability of camera whitebalance",
//        "detecting" : "Detecting face",
//        "hints" : "Hmm. Detecting the face is taking a long time",
//        "redetecting" : "Lost track of face, redetecting",
//        "lost" : "Lost track of face",
//        "found" : "Tracking face"
//    };
//
//    var supportMessages = {
//        "no getUserMedia" : "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for bodydetection.",
//        "no camera" : "No camera found. Using fallback video for bodydetection."
//    };

    var isSidebarShow = false;
    document.addEventListener("facetrackingEvent", function( event ) {

        if(!isSidebarShow){
            sidebar.show();
            voice.init();
            isSidebarShow = true;
        }

        // clear canvas
        overlayContext.clearRect(0,0, videoInput.width, videoInput.height);
        // once we have stable tracking, draw rectangle
        if (event.detection == "CS") {

            if( debug ){
                overlayContext.translate(event.x, event.y);
                overlayContext.rotate(event.angle-(Math.PI/2));
                overlayContext.strokeStyle = "#00CC00";
                overlayContext.strokeRect( (-(event.width/2)) >> 0 ,  (-(event.height/2)) >> 0, event.width, event.height);
                overlayContext.rotate((Math.PI/2)-event.angle);
                overlayContext.translate( -event.x, -event.y );
            }


//            opArray.forEach(function(op){
//
//                var opArea = opAreaMap[op];
//
//                overlayContext.strokeRect(opArea[0] , opArea[1], opArea[2], opArea[3] );
//            });

            // draw cloth on overlay

            overlayContext.drawImage(cloth.img, event.x + xOffsetCloth, event.y + yOffsetCloth , zoomedClothSize['width'], zoomedClothSize['height']);

            operation.monitor();


        }


    });



    // turn off or on the canvas showing probability
    function showProbabilityCanvas() {
        var debugCanvas = document.getElementById('debug');
        if (debugCanvas.style.display == 'none') {
            debugCanvas.style.display = 'block';
        } else {
            debugCanvas.style.display = 'none';
        }
    }

    $("#showProbabilityCanvas").click(showProbabilityCanvas);
    $("#retry").click(function(){
        htracker.stop();
        htracker.start();
    });
});