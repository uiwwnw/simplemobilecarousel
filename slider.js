var slider = function (setting) {
    "use strict";
    function children(parent) {
        var node = parent.firstChild;
        var result = [];
        if (node) {
            do {
                if (node.nodeType === 1) {
                    result.push(node);
                }
            } while (node = node.nextSibling)
        }
        return result;
    }
    function scrollTo(element, to, duration) {
        if (to === 0) {
            element.scrollLeft = to;
        } else {
            if (duration <= 0) return;
            var difference = to - element.scrollLeft,
                perTick = difference / duration * 10;

            setTimeout(function () {
                element.scrollLeft = element.scrollLeft + perTick;
                if (element.scrollLeft === to) return;
                scrollTo(element, to, duration - 10);
            }, 10);
        }
    }
    function fnSlider(setting) {
        var ui_slide = {};
        if (setting === undefined) {
            ui_slide.dom = document.getElementById('slideWrap')
        } else {
            ui_slide.dom = document.getElementById(setting['id']);
            ui_slide.setInterval = setting['setInterval'];
            ui_slide.setIntervalTime = setting['setIntervalTime'] || 1000;
            ui_slide.setIntervalSpeed = setting['setIntervalSpeed'] || 200;
            ui_slide.button = setting['button'];
        }
        ui_slide.virtualWrap = document.createElement('div');
        ui_slide.item = ui_slide.dom.children || children(ui_slide.dom);
        ui_slide.itemLength = ui_slide.item.length;
        ui_slide.itemWidth = [];
        ui_slide.wrapWidth = 0;
        ui_slide.num = 0;
        ui_slide.dom.setAttribute('style', 'overflow:hidden;overflow-x:auto;');
        fnSlider.prototype.ptDo(ui_slide)
    }
    fnSlider.prototype = {
        ptStyle: function (ui_slide) {
            var i = 0;
            for (i; i < ui_slide.itemLength; i += 1) {
                var style = ui_slide.item[i].getAttribute('style');
                if (style !== null) {
                    style += ';float:left;'
                } else {
                    style = 'float:left;'
                }
                ui_slide.item[i].setAttribute('style', style);
                ui_slide.wrapWidth += ui_slide.item[i].clientWidth;
                ui_slide.itemWidth.push(ui_slide.wrapWidth);
            }
        },
        ptMoveItem: function (ui_slide) {
            while (ui_slide.item.length > 0) {
                ui_slide.virtualWrap.appendChild(ui_slide.item[0]);
            }
            ui_slide.virtualWrapStyle = 'width:' + ui_slide.wrapWidth + 'px;';
            ui_slide.dom.appendChild(ui_slide.virtualWrap).setAttribute('style', ui_slide.virtualWrapStyle);
            ui_slide.wrapHeight = ui_slide.dom.clientHeight;
        },
        ptSlide: function (ui_slide) {
            ui_slide.virtualWrapAni = 0;
            // console.log(ui_slide.num)
            if (ui_slide.num === 0) {
                var num = 0;
            } else {
                var num = ui_slide.num - 1;
                ui_slide.virtualWrapAni = ui_slide.virtualWrapAni + ui_slide.itemWidth[num];
            }
            // console.log(ui_slide.virtualWrapAni)
            scrollTo(ui_slide.dom, ui_slide.virtualWrapAni, ui_slide.setIntervalSpeed)
        },
        ptSetInt: function (ui_slide) {
            setInterval(function () {
                if (ui_slide.num < ui_slide.itemLength - 1) {
                    ui_slide.num += 1;
                } else {
                    ui_slide.num = 0;
                }
                fnSlider.prototype.ptSlide(ui_slide);
            }, ui_slide.setIntervalTime)
        },
        ptScrollCheck: function (ui_slide) {

        },
        ptMakeBtn: function (ui_slide) {
            var btnWidth = 50,
                btnHeight = 50,
                commonStyle = 'position: absolute;width:' + btnWidth + 'px;height:' + btnHeight + 'px;margin-top:' + (ui_slide.wrapHeight / 2 - btnHeight / 2) + 'px;',
                leftStyle = 'left:0;',
                rightStyle = 'right:0;',
                btnLeft = document.createElement('button'),
                btnRight = document.createElement('button');
            ui_slide.dom.appendChild(btnLeft);
            ui_slide.dom.appendChild(btnRight);
            btnLeft.setAttribute('style', commonStyle + leftStyle);
            btnRight.setAttribute('style', commonStyle + rightStyle);
        },
        ptBtnAct: function () {

        },
        ptDo: function (ui_slide) {
            this.ptStyle(ui_slide);
            this.ptMoveItem(ui_slide);
            if (ui_slide.setInterval) {
                this.ptSetInt(ui_slide);
                this.ptScrollCheck(ui_slide);
            }
            if (ui_slide.button) {
                this.ptMakeBtn(ui_slide);
                this.ptBtnAct(ui_slide);
            }
        },
    }
    var newSlider = new fnSlider(setting);
}
// uiwwnw 