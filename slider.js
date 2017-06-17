var slider = function (setting) {
    "use strict";
    function isMobile() {
        var UserAgent = navigator.userAgent;
        if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
            return true;
        } else {
            return false;
        }
    }
    function scrollTo(element, to, duration) {
        if (to === 'zero') {
            element.scrollLeft = 0;
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
        // console.log(isMobile())
        if (setting === undefined) {
        } else {
            ui_slide.dom = document.getElementById(setting['id']) || document.getElementById('slideWrap');
            ui_slide.setInterval = setting['setInterval'];
            ui_slide.setIntervalTime = setting['setIntervalTime'] || 1000;
            ui_slide.setIntervalSpeed = setting['setIntervalSpeed'] || 200;
            ui_slide.button = setting['button'];
            ui_slide.buttonWidth = setting['buttonWidth'] || 50;
            ui_slide.buttonHeight = setting['buttonHeight'] || 50;
            ui_slide.buttonLeftClassName = setting['buttonLeftClassName'] || 'btnLeft';
            ui_slide.buttonRightClassName = setting['buttonRightClassName'] || 'btnRight';
            ui_slide.fullWidth = setting['fullWidth'];
            ui_slide.magnet = setting['magnet'];
            (ui_slide.magnet === undefined) && (ui_slide.magnet = true);
            (ui_slide.fullWidth) && (ui_slide.windowWidth = window.innerWidth);
            if (ui_slide.button) { ui_slide.domX = ui_slide.dom.offsetLeft; ui_slide.domWidth = ui_slide.dom.clientWidth }
        }
        ui_slide.virtualWrap = document.createElement('div');
        ui_slide.item = ui_slide.dom.children;
        ui_slide.itemLength = ui_slide.item.length;
        ui_slide.itemWidth = [];
        ui_slide.wrapWidth = 0;
        ui_slide.num = 0;
        ui_slide.currentPosition = 0;
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
                (ui_slide.fullWidth) && (style += 'width:' + ui_slide.windowWidth + 'px;');
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
        ptSlideInit: function (ui_slide) {
            var i = 0,
                data = 0;
            ui_slide.scrollPosition = [];
            for (i; i < ui_slide.itemLength; i += 1) {
                ui_slide.scrollPosition[i] = ui_slide.itemWidth[i - 1] || data;
            }
        },
        ptSlide: function (ui_slide) {
            scrollTo(ui_slide.dom, ui_slide.scrollPosition[ui_slide.num], ui_slide.setIntervalSpeed);
        },
        ptSetInt: function (ui_slide) {
            ui_slide.setIntervalToggle = setInterval(function () {
                if (ui_slide.num < ui_slide.itemLength - 1 || ui_slide.num === 'zero') {
                    (ui_slide.num === 'zero') && (ui_slide.num = 0)
                    ui_slide.num += 1;
                } else {
                    ui_slide.num = 'zero';
                }
                fnSlider.prototype.ptSlide(ui_slide);
            }, ui_slide.setIntervalTime)
        },
        ptStopInt: function (ui_slide) {
            clearTimeout(ui_slide.setTimeoutToggle);
            clearInterval(ui_slide.setIntervalToggle);
            if (ui_slide.setInterval && ui_slide.switch === true) {
                ui_slide.setTimeoutToggle = setTimeout(function () {
                    fnSlider.prototype.ptSetInt(ui_slide);
                }, ui_slide.setIntervalTime * 2)
            }
        },
        ptBtnAct: function (ui_slide) {
            // 자석활성화, 버튼 클릭 시 ptScrollCheck 제거
            ui_slide.btnLeft.addEventListener('click', function () {
                ui_slide.num = (ui_slide.num > 0) && (ui_slide.num - 1);
                fnSlider.prototype.ptSlide(ui_slide);
            })
            ui_slide.btnRight.addEventListener('click', function () {
                ui_slide.num = (ui_slide.num < ui_slide.itemLength - 1) && (ui_slide.num + 1) || ui_slide.itemLength - 1;
                fnSlider.prototype.ptSlide(ui_slide);
            })
        },
        ptMouse: function (ui_slide) {
            ui_slide.dom.addEventListener('mousedown', function () {
                ui_slide.switch = false;
                (ui_slide.setInterval) && (fnSlider.prototype.ptStopInt(ui_slide));
            });
            ui_slide.dom.addEventListener('mouseup', function () {
                ui_slide.switch = true;
                (ui_slide.setInterval) && (fnSlider.prototype.ptStopInt(ui_slide));
                fnSlider.prototype.ptScrollCheck(ui_slide)
            });
        },
        ptTouch: function (ui_slide) {
            ui_slide.dom.addEventListener('touchstart', function () {
                ui_slide.switch = false;
                (ui_slide.setInterval) && (fnSlider.prototype.ptStopInt(ui_slide));
            });
            ui_slide.dom.addEventListener('touchend', function () {
                ui_slide.switch = true;
                (ui_slide.setInterval) && (fnSlider.prototype.ptStopInt(ui_slide));
                fnSlider.prototype.ptScrollCheck(ui_slide)
            });
        },
        ptScrollCheck: function (ui_slide) {
            if (ui_slide.setInterval || ui_slide.button) {
                ui_slide.currentPosition = ui_slide.dom.scrollLeft;
            } else if (ui_slide.magnet) {
                ui_slide.dom.addEventListener('scroll', function () {
                    ui_slide.currentPosition = ui_slide.dom.scrollLeft;
                })
            }
            var i = 0,
                absBtw = [],
                // btw = [],
                // dis,
                absDis;
            // num;
            for (i; i < ui_slide.itemLength; i += 1) {
                absBtw.push(Math.abs(ui_slide.scrollPosition[i] - ui_slide.currentPosition));
                // btw.push(ui_slide.scrollPosition[i] - ui_slide.currentPosition);
            }
            absDis = Math.min.apply(null, absBtw);
            ui_slide.num = absBtw.indexOf(absDis);
            if (isMobile()) {
                // ui_slide.dom.scrollLeft = 0;
            } else {
                if (ui_slide.magnet) {
                    this.ptSlide(ui_slide);
                }
            }
            // num = absBtw.indexOf(absDis);
            // dis = btw[num];
            // if (dis > 0) {
            //     ui_slide.num = num - 1;
            // } else {
            //     ui_slide.num = num;
            // }
            // return ui_slide.num;
        },
        ptMakeBtn: function (ui_slide) {
            var btnWidth = ui_slide.buttonWidth,
                btnHeight = ui_slide.buttonHeight,
                commonStyle = 'position: absolute;width:' + btnWidth + 'px;height:' + btnHeight + 'px;margin-top:' + (ui_slide.wrapHeight / 2 - btnHeight / 2) + 'px;font-size:' + btnHeight + 'px;line-height:' + btnHeight + 'px;',
                leftStyle = 'left:' + ui_slide.domX + 'px;',
                rightStyle = 'left:' + Number(ui_slide.domX + ui_slide.domWidth - ui_slide.buttonWidth) + 'px;';
            ui_slide.btnLeft = document.createElement('button');
            ui_slide.btnRight = document.createElement('button');
            ui_slide.dom.appendChild(ui_slide.btnLeft);
            ui_slide.dom.appendChild(ui_slide.btnRight);
            ui_slide.btnLeft.innerHTML = '<'
            ui_slide.btnRight.innerHTML = '>'
            ui_slide.btnLeft.setAttribute('style', commonStyle + leftStyle);
            ui_slide.btnLeft.setAttribute('class', ui_slide.buttonLeftClassName);
            ui_slide.btnRight.setAttribute('style', commonStyle + rightStyle);
            ui_slide.btnRight.setAttribute('class', ui_slide.buttonRightClassName)
        },
        ptDo: function (ui_slide) {
            this.ptStyle(ui_slide);
            this.ptMoveItem(ui_slide);
            this.ptSlideInit(ui_slide);
            if (isMobile()) {
                this.ptTouch(ui_slide);
            } else {
                this.ptMouse(ui_slide);
            }
            if (ui_slide.setInterval) {
                this.ptSetInt(ui_slide);
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