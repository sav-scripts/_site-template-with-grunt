/* change log
    1.0.1
        支援 addListener 和 removeListener
        移除 bind, 統一由 listener 回應捲動事件
    1.0.2
        新增 update 方法, 強制更新狀態
        改變 testDom 方法的判定
        新增 testDomFromMiddle 方法, 類似 testDom, 但是判定內容以判定目標的中間為準
 */

(function(){

    var _isLocking = false,
        _listenerDic = {},
        _scrollBound =
        {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        },
        _tweenDic = {scrollTop:0};

    var self = window.ScrollListener =
    {
        _isActive: false,

        init: function()
        {

            return self;
        },

        addListener: function(id, func)
        {
            _listenerDic[id] = func;

            return self;
        },

        removeListener: function(id)
        {
            delete _listenerDic[id];

            return self;
        },

        active: function()
        {
            self._isActive = true;

            $(window).on('scroll', updateScrollTop);
            updateScrollTop();

            return self;
        },

        disactive: function()
        {
            self._isActive = false;
            $(window).unbind('scroll', updateScrollTop);

            return self;
        },

        // topOffset and bottomOffset 代表檢測內容的上下偏移 (1.0.1版為容器的上下偏移)
        testDom: function(dom, topOffset, bottomOffset)
        {
            var bound = dom.getBoundingClientRect();

            if(topOffset === undefined) topOffset = 0;
            if(bottomOffset === undefined) bottomOffset = 0;

            var top = 0,
                bottom = _scrollBound.height;

            var boundTop = bound.top + topOffset,
                boundBottom = bound.bottom + bottomOffset;

            var topInside = (boundTop >= top && boundTop <= bottom) ,
                bottomInside = (boundBottom >= top && boundBottom <= bottom);

            return {
                bound: bound,
                topInside: topInside,
                bottomInside: bottomInside
            };
        },

        testDomFromMiddle: function(dom, topOffset, bottomOffset)
        {

            var bound = dom.getBoundingClientRect();

            if(topOffset === undefined) topOffset = 0;
            if(bottomOffset === undefined) bottomOffset = 0;

            var top = 0,
                bottom = _scrollBound.height;

            var boundMiddle = bound.top + bound.height * .5,
                boundTop = boundMiddle + topOffset,
                boundBottom = boundMiddle + bottomOffset;

            var topInside = (boundTop >= top && boundTop <= bottom) ,
                bottomInside = (boundBottom >= top && boundBottom <= bottom);

            return {
                bound: bound,
                topInside: topInside,
                bottomInside: bottomInside
            };
        },

        scrollTo: function(targetTop, cb, __speed)
        {

            var speed = __speed? __speed: 1000,
                //dy = Math.abs(targetTop - _tweenDic.scrollTop),
                dy = Math.abs(targetTop - $(window).scrollTop()),
                duration = Math.min(.8, dy/speed);



            //console.log($(window).scrollTop());

            TweenMax.killTweensOf(_tweenDic);
            _tweenDic.scrollTop = $(window).scrollTop();



            TweenMax.to(_tweenDic,duration, {scrollTop: targetTop, onStart: function()
            {
                //Menu.setLockFocus(true);
                //Menu.setFocusTo(anchor);
            }, onUpdate: function()
            {
                //console.log(_tweenDic.scrollTop + " : " + $(window).scrollTop());
                window.scrollTo($(window).scrollLeft(), _tweenDic.scrollTop);
                //$(window).scrollTop(_tweenDic.scrollTop);

            }, onComplete: cb});
        },

        update: function(specId)
        {
            updateScrollTop(true, specId);
        }
    };

    function updateScrollTop(forceExecute, specId)
    {
        if(!forceExecute && _isLocking) return;
        if(!forceExecute && !self._isActive) return;

        var doc = document.documentElement;
        _scrollBound.left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        _scrollBound.top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        _scrollBound.width = $(window).width();
        _scrollBound.height = $(window).height();

        _tweenDic.scrollTop = $(window).scrollTop();

        //if(_cbOnScrolling) _cbOnScrolling.call(null, _scrollBound);
        var id, func;
        for(id in _listenerDic)
        {
            func = _listenerDic[id];
            if(specId)
            {
                if(specId === id)
                {
                    func.call(null, _scrollBound);
                }
            }
            else
            {
                func.call(null, _scrollBound);
            }
        }
    }

}());
