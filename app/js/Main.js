(function(){

    "use strict";
    var self = window.Main =
    {
        viewport:
        {
            width: 0,
            height: 0,
            ranges: [640],
            index: -1,
            changed: false
        },

        init: function()
        {
            if(Utility.urlParams.logger==1)
            {
                Logger.init(true).show().open();
            }

            $(window).on("resize", onResize);
            onResize();
        }
    };

    function onResize()
    {
        var oldIndex = self.viewport.index;

        self.viewport.width = window.innerWidth;
        self.viewport.height = window.innerHeight;

        self.viewport.index = self.viewport.width <= self.viewport.ranges[0]? 0: 1;

        console.log(self.viewport.width);

        if(oldIndex !== self.viewport.index) self.viewport.changed = true;
    }

}());
