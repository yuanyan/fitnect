define(function () {

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

    //加入一个新box
    var setNewBox = function(){
        var favEle = document.querySelector('.fav'),
            favListEle = favEle.querySelectorAll('li'),
            newBox = document.createElement('li');
        favEle.appendChild(newBox);
        return ;
    }

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

    //飞过去
    var flyFn = function(insetFn, endFn){
        var shotEle = document.querySelector('.screenshot'),
            favEle = document.querySelector('.fav'),
            favListEle = favEle.querySelectorAll('li'),
            newBox = document.createElement('li'),
            posX,posY;
        shotEle.style.display = 'block';
        favEle.appendChild(newBox);
        posY = newBox.offsetTop;
        posX = newBox.offsetLeft;
        insetFn && insetFn(newBox);
        favEle.scrollTo(posY);
        setTimeout(function(){
            //
            addClass(shotEle, 'half');
        }, 0);
    }
//
//    document.querySelector('#test2').addEventListener('click', function(){
//        flashFn(flyFn);
//    });
//

    return {
        'show': function(){
            addClass(document.querySelector('.tools'), 'show');
            addClass(document.querySelector('.cabinet'), 'show');
        }
    };
});