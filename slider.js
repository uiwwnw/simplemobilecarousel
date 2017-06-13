var slider = function () {
    "use strict";
    function children( parent ) {
        var node = parent.firstChild;
        var result = [];
        if( node ) {
            do {
                if( node.nodeType === 1 ) {
                    result.push( node );
                }
            } while( node = node.nextSibling )
        }
        return result;
    }
    function fnSlider(){
        var ui_slide = {};
            ui_slide.virtualWrap = document.createElement('div');
            ui_slide.dom = document.getElementById('slideWrap');
            ui_slide.item = ui_slide.dom.children || children(ui_slide.dom);
            ui_slide.dom.setAttribute('style','width: 100%;overflow: hidden;overflow-x: auto;');
            fnSlider.prototype.ptDo(ui_slide)
    }
    fnSlider.prototype = {
        ptStyle:function(ui_slide){
            var i = 0;
            ui_slide.itemLength = ui_slide.item.length,
            ui_slide.wrapWidth = 0;
            for(i; i < ui_slide.itemLength; i += 1){
                ui_slide.item[i].setAttribute('style','float:left;');
                ui_slide.wrapWidth += ui_slide.wrapWidth + ui_slide.item[i].clientWidth;
            }
            this.ptMoveItem(ui_slide);
        },
        ptMoveItem:function(ui_slide){
            while (ui_slide.item.length > 0) {
                ui_slide.virtualWrap.appendChild(ui_slide.item[0]);
            }
            ui_slide.dom.appendChild(ui_slide.virtualWrap).setAttribute('style','width:' + ui_slide.wrapWidth + 'px;');
        },
       ptDo:function(ui_slide){
           this.ptStyle(ui_slide)
        //    console.log(ui_slide)
       }
    }
    var newSlider = new fnSlider();
}