
/**
 * jquery.catSlider-1.0.0
 * @author icemokacat <icemokacat@gmail.com>
 * depend on jQuery Mobile v1.5.0-alpha.1
 */

(function($) {
    
    $.catSlider = {
        
        /**
         * variable
         */
        totalCount  : 0,
        currentNum  : 1,
        currentX    : 0,
        movePx      : 0,

        touchX      : 0,
        touchY      : 0,
        triggerPx   : 30,       // 해당 픽셀 만큼 이동하면 슬라이딩

        space       : false,
        margin      : 0,

        isFirst     : true,
        isLast      : false,
        isInit      : false,

        wrapperTarget   : null,
        target          : null,
        childtarget     : null,

        setMoveFunc         : null,
        leftCallBackFunc    : null,
        rightCallBackFunc   : null,

        oneImgOnSlide       : false,

        /**
         * $.catSlider.init
         */
        init : function(params){

            // set params
            $.catSlider.wrapperTarget       = params.wrapperTarget;
            $.catSlider.target              = params.target;
            $.catSlider.childtarget         = params.childtarget;
            $.catSlider.setMoveFunc         = params.setMoveFunc;
            $.catSlider.leftCallBackFunc    = params.leftCallBackFunc;
            $.catSlider.rightCallBackFunc   = params.rightCallBackFunc;

            if(typeof params.oneImgOnSlide != "undefined" && params.oneImgOnSlide != "" ){
                $.catSlider.oneImgOnSlide   = params.oneImgOnSlide;
            } 
                     
            if(typeof params.space != "undefined" && params.space != "" ){
                $.catSlider.space   = params.space;
            }  

            if(params.spacepx && $.isNumeric(params.spacepx)){
                $.catSlider.margin = params.spacepx;
            }       

            if($.catSlider.oneImgOnSlide){
                $.catSlider.margin = 0;
                $.catSlider.childtarget.css('margin',0);
            }else if($.catSlider.space){
                $.catSlider.childtarget.css('margin-left'   ,$.catSlider.margin+"px");
                $.catSlider.childtarget.css('margin-right'  ,$.catSlider.margin+"px");
            }
            
            $.catSlider.destory();

            // set swipe event
            $.catSlider.siwpeEventSet($.catSlider.target);

            $.catSlider.reset();
            
        },

        /** 
         *  $.catSlider.reset
         */
        reset : function(){
            $.catSlider.currentX    = 0;
            var childWd             = $.catSlider.childtarget.eq(0).width();
            var slideMargin	        = $.catSlider.margin;

            var oneWidth            = childWd+slideMargin*2;

            /* wrapper width set */
            if($.catSlider.oneImgOnSlide){
                $.catSlider.wrapperTarget.css('width',oneWidth+'px');
            }else{
                $.catSlider.wrapperTarget.css('width',oneWidth*2+'px');
            }

            /* 화면크기에 따른 움직임 값 설정 */	
            if($.catSlider.setMoveFunc && $.isFunction($.catSlider.setMoveFunc)){
                $.catSlider.setMoveFunc();
            }else{
                $.catSlider.defaultSetMove();
            }

            // init x
            if($.catSlider.currentNum == 1){
                if($.catSlider.oneImgOnSlide){
                    
                }else{
                    var initX = 0;
                    initX = oneWidth/2;
                    $.catSlider.transMove($.catSlider.target,initX);
                    $.catSlider.currentX = initX;
                }               
            }

            // 슬라이더 wrapper width setting
            // 슬라이더 wrapper 애니메이션 효과 적용
            $.catSlider.totalCount = $.catSlider.childtarget.length;
            $.catSlider.target.css('width',$.catSlider.totalCount*childWd+'vw');
            $.catSlider.target.css('transition','all 0.3s ease');
            
        },

        destory : function(){
            if($.catSlider.target){
                var target = $.catSlider.target;
                $(target).off('touchstart')
                $(target).off('touchend')
                $(target).off('touchmove')
            }
        },

        /** 
         *  $.catSlider.defaultSetMove
         *  set movePx
         */
        defaultSetMove : function(){
            var slideW	        = $.catSlider.childtarget.eq(0).width();
            var slideMargin	    = $.catSlider.margin;
            $.catSlider.movePx	= slideW+slideMargin*2;
        },

        /**
         *  $.catSlider.slideXmove
         */
        slideXmove : function(movePoint){
            $.catSlider.currentX = $.catSlider.currentX+movePoint;
            $.catSlider.transMove($.catSlider.target,$.catSlider.currentX);
        },

        /** 
         *  $.catSlider.transMove
         */
        transMove : function(target,movePx){
            $(target).css('transform'			,	'translateX('+movePx+'px)');
		    $(target).css('-webkit-transform'	,	'translateX('+movePx+'px)');
		    $(target).css('-ms-transform'		,	'translateX('+movePx+'px)');
        },

        /**
         * $.catSlider.slideMove 
         */
        slideMove : function(isRight){
            
            /**
             * isRight : user touch move
             * sliding direction is left 
             */

            if($.catSlider.isFirst){
                if(isRight){
                    return;
                }
            }
            if($.catSlider.isLast){
                if(isRight == false){
                    return;
                }
            }
            
            if(isRight){
                $.catSlider.currentX = $.catSlider.currentX+$.catSlider.movePx;
                $.catSlider.currentNum--;
            }else{
                $.catSlider.currentX = $.catSlider.currentX-$.catSlider.movePx;
                $.catSlider.currentNum++;
            }
            
            // first last set
            if($.catSlider.currentNum == 1){
                $.catSlider.isFirst	= true;
                if($.catSlider.currentNum != $.catSlider.totalCount) $.catSlider.isLast	= false;
            }else if($.catSlider.currentNum == $.catSlider.totalCount){
                $.catSlider.isLast	= true;
                if($.catSlider.totalCount > 1) $.catSlider.isFirst	= false;
            }else{
                if($.catSlider.currentNum != $.catSlider.totalCount) $.catSlider.isLast	= false;
                if($.catSlider.totalCount > 1) $.catSlider.isFirst	= false;
            }
                        
            // sliding
            $.catSlider.transMove($.catSlider.target,$.catSlider.currentX);
                        
            // callback func
            if(isRight){
                // user touch right
                // slide left
                if($.catSlider.leftCallBackFunc && $.isFunction($.catSlider.leftCallBackFunc)){
                    $.catSlider.leftCallBackFunc();
                }
            }else{
                if($.catSlider.rightCallBackFunc && $.isFunction($.catSlider.rightCallBackFunc)){
                    $.catSlider.rightCallBackFunc();
                }
            }
        },

        /** 
         *  $.catSlider.siwpeEventSet
         */
        siwpeEventSet : function(target){
            
            // touchstart
            $(target).touchstart(function(e){
                $.catSlider.target  = $(this);
                var touch           = e.touches[0] || e.changedTouches[0];
                $.catSlider.touchX  = touch.pageX; // e.touches[0].clientX;
                $.catSlider.touchY	= touch.pageY; // e.touches[0].clientY;
            })

            // touchend
            $(target).touchend(function(e){
                var touch = e.touches[0] || e.changedTouches[0];
                var moveX = touch.pageX; // e.originalEvent.changedTouches[0]
                var gap;
                var isRight = false;
                if(moveX>$.catSlider.touchX){
                    gap = moveX-$.catSlider.touchX;
                    isRight = true;
                }else{
                    gap = $.catSlider.touchX-moveX;
                }			
                if(gap > $.catSlider.triggerPx){
                    if(isRight){
                        //console.log('Right Move ['+moveX+":"+_touchX+"]");
                        $.catSlider.slideMove(isRight);
                    }else{
                        //console.log('Left Move ['+_touchX+":"+moveX+"]");
                        $.catSlider.slideMove(isRight);
                    }
                }	
            })

            // touchMove
            $(target).touchmove(function(e){
                var touch = e.touches[0] || e.changedTouches[0];
                var chX = Math.abs($.catSlider.touchX-touch.pageX);
                var chY = Math.abs($.catSlider.touchY-touch.pageY);
                var isPrevent = false;
                if(chX>chY){
                    isPrevent = true;
                }
                if(isPrevent){
                    e.preventDefault();
                }else{
                    //this.moved = true;
                }
            })
        }, // end siwpeEventSet

    }
}(jQuery));