define(function () {

    var cloth = new Image();
    var zoomedClothSize = {
        width: 0,
        height: 0
    };

    function loadCloth(url){
        cloth.src=url;
        cloth.onload = function(){
            zoomedClothSize = getZoomedSize(cloth, 1.2);
        };

        return cloth;
    }

    function getCloth(url){
        if(url != cloth.src) loadCloth(url);
        return cloth;
    }

    function getZoomedSize(img, multiple){
        // console.dir(img);
        //debugger;
        return {
            width: img.width * multiple,
            height: img.height * multiple
        };
    }

    var clothId = $("#clothTitle span"),
        clothTitle = $("#clothTitle");

    function setClothDisplay(id){
        clothId.text(id);
        clothTitle.show();
    }

    function set(op){
        setClothDisplay(op.charAt(1));
    }

    return {
        getCloth: getCloth,
        getClothZoomedSize: function(){
            return zoomedClothSize;
        }
        ,setClothDisplay: setClothDisplay

        ,set : set

    };
});