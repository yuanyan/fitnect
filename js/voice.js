// JavaScript Document

define(function(){


(function(){
	var root  = this, $ = root.$ || (root.$ = function(o){
		var o = Object.prototype.toString.call(o) === '[object String]'?document.getElementById(o):o;
		return o;
	});
	var fn = $.fn || ($.fn = {});
	fn.voice = function(){
		if(document.createElement('input').webkitSpeech !== undefined){
			//是否支持语音识别
			this.wrap('<div class="voice-div">').html('<input type="text" class="voice-text" lang="zh-CN" x-webkit-speech  x-webkit-grammar="builtin:search"/>');
			
			var _voice_input = this.parent('.voice-div').find('.voice-text').css({
				border: "none",
				color: "transparent",
				background: "transparent",
				cursor : "pointer",
				outline : 'none',
				width: function() {
					return $(this).css("font-size");
				}				 
			});//添加css
			_voice_input.attr('title','打开语音识别');
			
			var _this = this;
			return _voice_input.bind('webkitspeechchange',function(e){
				return _this.attr('value',$(this).val());
			});
		}
		return null;
	};
}).call(this);

//example var speech = new Speech();
var Speech = function(opt){
	opt = opt || {};
	this.id = opt.id;
	var cb = opt.cb;
	var input = $(this.id).voice();	
	
	
	this.getId = function(){
		return this.id;
	}
	
	var _value  = '';
	
	this.getValue = function(){
		return _value = input.val();
	}

	if(typeof cb == 'function'){
		//添加语音更改函数
		input.bind('webkitspeechchange',function(){
			cb.apply(this,arguments);
		});
	}
}

//
//    // JavaScript Document
//    var Move = (function(){
//        //ClassName处理方法
//        var hasClass = function (el, className) {
//                if (!el || !className) {
//                    return false;
//                }
//                return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
//            },
//            addClass = function (el, className) {
//                if (!el || !className || hasClass(el, className)) {
//                    return;
//                }
//                el.className += ' ' + className;
//            },
//            removeClass = function (el, className) {
//                if (!el || !className || !hasClass(el, className)) {
//                    return;
//                }
//                el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
//            };
//
//        //加入一个新box
//        var setNewBox = function(){
//            var favEle = document.querySelector('.fav'),
//                favListEle = favEle.querySelectorAll('li'),
//                newBox = document.createElement('li');
//            favEle.appendChild(newBox);
//            return ;
//        }
//        //闪屏
//        var flashFn = function(callback){
//            var flashEle = document.querySelector('.flash');
//            flashEle.style.display = 'block';
//            setTimeout(function(){
//                addClass(flashEle, 'show');
//            }, 0);
//            flashEle.addEventListener('webkitTransitionEnd', function(){
//                flashEle.style.display = 'none';
//                removeClass(flashEle, 'show');
//                callback && callback();
//            });
//        }
//
//        //飞过去
//        var flyFn = function(insetFn, endFn){
//            var shotEle = document.querySelector('.screenshot'),
//                favEle = document.querySelector('.fav'),
//                favListEle = favEle.querySelectorAll('li'),
//                newBox = document.createElement('li'),
//                posX,posY;
//            shotEle.style.display = 'block';
//            favEle.appendChild(newBox);
//            posY = newBox.offsetTop;
//            posX = newBox.offsetLeft;
//            insetFn && insetFn(newBox);
//            favEle.scrollTo(posY);
//            setTimeout(function(){
//                //
//                addClass(shotEle, 'half');
//            }, 0);
//        }
//
//        var init = function(){
//            //flashFn(flyFn);
//            document.querySelector('#test1').addEventListener('click', function(){
//                addClass(document.querySelector('.tools'), 'show');
//                addClass(document.querySelector('.cabinet'), 'show');
//            });
//            document.querySelector('#test2').addEventListener('click', function(){
//                flashFn(flyFn);
//            });
//        }
//
//        return {
//            init : init
//        }
//    })()

    var Matching = (function(){
        var pageLength = 0;
        var viewLength = 5;

        var curActive = 0;

        var clothData = null;
        var sex = 1;

        //获取用户数据
        var user = function(cb){
            DataBase.createUser({},cb);
        }

        var msgs = [];
        var Test = function(index){
            //测试试穿
            console.log(index);
            $('#silde_list').find('li:nth('+ index +')').click();
        }

        var Share = function(id){
            //分享功能
            DataBase.shareCloth({'col_id':'111'},function(data){
            });
        }

        var Page = function(add){
            //跳转页码
            gotoPage(index + add);
        }
        //页码
        var createPage = function(){
            var str = '';
            var lis = [];
            for(var i =0; i < pageLength; i++){
                lis.push('<li title="查看第'+ (i + 1) +'页" rel="'+ i +'"'+ (i==index?' class="active"':'') +'></li>');
            }
            $('#cicle').html(lis.join(''));
            $('#total').html('共'+ pageLength * viewLength +'件');

            $('.cicle li').click(function(){
                var rel = $(this).attr('rel');
                gotoPage(+rel);
            });
        }
        //绑定节点
        var bind = function(){
            $('.tab a').click(function(){

                $('.tab a[rel='+ sex +']').removeClass('active');

                var _this = $(this);
                sex = +_this.attr('rel');
                clothData = null;

                _this.addClass('active');

                getlist();
            });
        }

        var gotoType = function(rel){
            console.log($('.tab a[rel='+ rel +']'));
            $('.tab a[rel='+ rel +']').click();
        }

        //页码跳转
        var index = 0;
        var gotoPage = function(_index){
            if(_index == index) return;
            $('#cicle li:nth('+  index +')').removeClass('active');
            index = _index;
            $('#cicle li:nth('+  index +')').addClass('active');
            getlist();
        }

        var creatList = function(data){
            //生成列表
            if(!data || !data.length) return;
            var silde_list = $('#silde_list');
            var lis = [];
            for(var i = 0,len = data.length; i<len ; i++){
                var _data = data[i];
                if(!_data) continue;
                lis.push('<li'+  (i == curActive?' class="active"':'' ) +' rel="'+ i +'">\
						<div class="number" rel="'+ _data.cloth_id +'">'+ (i + 1) +'</div>\
						<div class="content">\
							<img src="cloth/'+ _data.url + '" />\
							<p class="name">'+ _data.name +'</p>\
							<p>价格：'+ (Math.floor(Math.random() * 70)+ 70) +'元</p>\
							<p><a href="#">进入店铺>></a></p>\
							<div><a class="btn-red" href="#">放入购物车</a></div>\
						</div>\
					</li>');
            }

            var _lis = lis.join('');
            silde_list.html(_lis?'<ul class="list">'+ _lis +'</ul>':'');//添加到页面

            silde_list.find('li').click(function(){
                var rel = $(this).attr('rel');
                silde_list.find('li:nth('+ curActive +')').removeClass('active');
                curActive = rel;
                $(this).addClass('active');
            });
        }


        //拉去衣服列表
        var getlist = function(){
            curActive =  0;//重置

            var _data = clothData && clothData.slice(index * viewLength, (index + 1) * viewLength);
            if(_data && _data.length){
                creatList(_data);
            }else{
                DataBase.getRecCloth({'sex' : sex},function(data){
                    if(!data) return;
                    pageLength = data.length / viewLength;
                    var _data = data.slice(index * viewLength, (index + 1) * viewLength);
                    creatList(_data);

                    createPage();
                });
            }
        }

        //获取收藏夹衣服列表
        var getCloth = function (){
            DataBase.getColCloth({},function(data){
                var fav_list = $('#fav_list');
                var lis = [],len = data.length;
                //console.log(data);
                for(var i = 0; i < len ; i++){
                    var _data = data[i];
                    if(!_data) continue;
                    lis.push('<li>\
						 	<div class="box">\
                    			<img src="cloth/'+ _data.img_url +'" />\
								<div class="fn">\
									<span class="icon-like">'+ _data.good +'</span>\
								</div>\
                    		</div>\
						</li>');
                }
                lis.push('<li>\
						 	<div class="box">\
                    			<div class="box plus"></div>\
                    		</div>\
						</li>');
                fav_list.html(lis.join(''));//添加照片收藏记录到页面
                $('#total_cache').html('已照'+ (len || 0) +'张');//添加照片总记录
            });
        }

        var viewCurCloth = function(){
            //显示当前衣服
            var _data = clothData['index'];
        }

        //添加到收藏
        var collectCloth = function(id){
            DataBase.collectCloth({'cloth_id' : id},function(data){
                console.log(data);
            });
        }

        //加载语音组件
        var initVoice = function(){
            var speech = new Speech({id:'#myvoice',cb:function(){
                var _val = $(this).val();
                MathingVoice.match(_val);
            }});
        }

        //初始化函数
        var init = function(){
            user();
            getlist();
            bind();
            getCloth();
            //Move.init();
            initVoice();
        }

        var getData = function(_index){

            clothData = clothData || {};

            return clothData[_index || index] || {};//返回查询的data
        }

        var getStatus = function(){
            return {
                index : index,//当前页码
                length : pageLength,//当前页面总长度
                vlength : viewLength//当前数据长度
            }
        }

        return {
            init : init,
            Test : Test,
            Share : Share,
            Page : Page,
            getData : getData,
            getStatus : getStatus,
            gotoType : gotoType
        }
    })();



    var MathingVoice = (function(){
        var voicedata = {
            '一号':{text:'试穿一号',cb:function(){
                Matching.Test(0);
            }},
            '二号':{text:'试穿二号',cb:function(){
                Matching.Test(1);
            }},
            '三号':{text:'试穿三号',cb:function(){
                Matching.Test(2);
            }},
            '四号':{text:'试穿四号',cb:function(){
                Matching.Test(3);
            }},
            '享一':{text:'分享一号',cb:function(){
                Matching.Share(0);
            }},
            '享二':{text:'分享二号',cb:function(){
                Matching.Share(1);
            }},
            '享三':{text:'分享三号',cb:function(){
                Matching.Share(2);
            }},
            '享四':{text:'分享四号',cb:function(){
                Matching.Share(3);
            }},
            '上':{text:'上一页',cb:function(){
                Matching.Page(-1);
            }},
            '下':{text:'下一页',cb:function(){
                Matching.Page(1);
            }},
            '男':{text:'男装',cb:function(){
                Matching.gotoType(1);
            }},
            '女':{text:'女装',cb:function(){
                Matching.gotoType(2);
            }}
        }

        var _regExp;
        var match = function(value){
            var _r = _regExp || (_regExp = (function(d){
                var s = '';
                for(var i in d){
                    s +=  s?'|' + i : i;
                }
                return new RegExp('(['+ s +'])','i')
            })(voicedata));

            var _ms = value.match(_r);
            console.log(_ms);
            if(_ms && _ms[0]){
                var _obj = voicedata[_ms[0]];
                if(_obj && _obj.cb){
                    _obj.cb();
                }
            }
        }
        return {
            match : match
        }
    })();

    var DataBase = (function(){

        var ajax = function(args,cb){
            var url = '';
            var urls = [];

            for(var i in args){
                urls.push(i + '=' + args[i]);
            }

            var url = '/mls/command.php?' + urls.join('&');

            $.get(url,function(data){
                if(!data) return;
                if(typeof cb == 'function'){
                    cb(eval('('+ data +')'));
                }
            });
        }

        var createUser = function(opt,cb){
            opt = opt || {};
            opt.opt = 'new_user';
            ajax(opt,cb);
        }

        var getRecCloth = function(opt,cb){
            opt = opt || {};
            opt.opt = 'get_rec_cloth';
            ajax(opt,cb);
        }

        var collectCloth = function(opt,cb){
            opt = opt || {};
            opt.opt = 'collect_cloth';
            ajax(opt,cb);
        }

        var getColCloth = function(opt,cb){
            opt = opt || {};
            opt.opt = 'get_col_cloth';
            ajax(opt,cb);
        }

        var shareCloth = function(opt,cb){
            opt = opt || {};
            opt.opt = 'share_cloth';
            ajax(opt,cb);
        }

        var getComment = function(opt,cb){
            opt = opt || {};
            opt.opt = 'get_comment';
            ajax(opt,cb);
        }

        return {
            createUser : createUser,
            getRecCloth : getRecCloth,
            collectCloth : collectCloth,
            getColCloth : getColCloth,
            shareCloth : shareCloth,
            getComment : getComment
        }
    })();


    Matching.init();


    return Matching;


});
