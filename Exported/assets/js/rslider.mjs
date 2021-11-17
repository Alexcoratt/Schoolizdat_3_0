import "./rslider_lib.js";

var rSlider = new RSlider(document.getElementsByClassName("rslider")[0], document.getElementsByClassName("rslider-indicator"));

rSlider.slideTo(rSlider.getCurrentSlideNum());

var fbSlider = new CycledHatSlider(document.getElementsByClassName("fb-slider")[0], 700);
fbSlider.calculateParams();

$("#prev-button").click(getListener(fbSlider.slidePrevious, fbSlider));
$("#next-button").click(getListener(fbSlider.slideNext, fbSlider));

window.addEventListener("resize", function(){
    fbSlider.durationOff(fbSlider);
    setTimeout(function(){
        fbSlider.calculateParams(fbSlider);
        rSlider.completeSlide(rSlider);
        fbSlider.durationOn(fbSlider);
    }, fbSlider.duration);
}, {passive: false});
$("#to-nominations-button").click(getListener(rSlider.slideTo, 3, rSlider, true));