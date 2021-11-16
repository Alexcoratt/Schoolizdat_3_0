import "./rslider_lib.js";

function onWheel(e){
    if (!rSlider.isScrolling){
        var delta = e.deltaY,
            absDelta = Math.abs(Math.round(delta));
        rSlider.isMouseWheel = (absDelta == 4) || (absDelta == 16); // адаптивный скроллинг, в подавляющем большинстве случаев верно различающий
                                                                    // скроллинг мышью и тачпадом. (колесико прокручивает страницу на 4 единицы в
        var direction = Math.sign(delta);                           // chrome, safari, edge, и на 16 - в firefox)
        rSlider.slideDirection(direction);
    }
    e.preventDefault();
}

var isMobile;
var rSlider = new RSlider(document.getElementsByClassName("rslider")[0], document.getElementsByClassName("rslider-indicator"));
window.addEventListener("wheel", onWheel, {passive: false});

function rSliderToggle(){
     isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
     if (!isMobile){
        if (rSlider == undefined){
            rSlider = new RSlider(document.getElementsByClassName("rslider")[0], document.getElementsByClassName("rslider-indicator"));
            window.addEventListener("wheel", onWheel, {passive: false});
            $("#to-nominations-button").click(getListener(rSlider.slideTo, 3, rSlider));
        }
        rSlider.showIndicators();
        rSlider.completeSlide(rSlider);
    }
    else{
        if (rSlider != undefined){
            window.removeEventListener("wheel", onWheel, false);
            rSlider.hideIndicators();
            rSlider = undefined;
        }
    }
}

rSliderToggle();

var fbSlider = new CycledHatSlider(document.getElementsByClassName("fb-slider")[0], 700);
fbSlider.calculateParams();

$("#prev-button").click(getListener(fbSlider.slidePrevious, fbSlider));
$("#next-button").click(getListener(fbSlider.slideNext, fbSlider));

window.addEventListener("resize", function(){
    fbSlider.durationOff(fbSlider);
    setTimeout(function(){
        fbSlider.calculateParams(fbSlider);
        rSliderToggle();
        fbSlider.durationOn(fbSlider);
    }, fbSlider.duration);
}, {passive: false});