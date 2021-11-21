import "./rslider_lib.js";
import "./horisontal_sliders_lib.js";

function checkWidth(){
    if (window.innerWidth > 1000){
        fbSlider.setSlideMode("multi");
    }
    else{
        fbSlider.setSlideMode("single");
    }
    /*if (window.innerWidth > 825){
        if (!rSlider.isOn){
            rSlider.on();
        }
        rSlider.completeSlide();
    }
    else{
        if (rSlider.isOn){
            rSlider.off();
        }
        fbSlider.setSlideMode("single");
    }*/
}

//var rSlider = new RSlider(document.getElementsByClassName("rslider")[0], document.getElementsByClassName("rslider-indicator"));
//rSlider.slideTo(rSlider.getCurrentSlideNum());

var fbSlider = new CycledHatSlider(document.getElementsByClassName("fb-slider")[0], "fb-paragraph", 700);
fbSlider.calculateParams();

checkWidth();

$("#prev-button").click(getListener(fbSlider.slidePrevious, fbSlider));
$("#next-button").click(getListener(fbSlider.slideNext, fbSlider));

window.addEventListener("resize", function(){
    fbSlider.durationOff(fbSlider);
    checkWidth();
    setTimeout(function(){
        fbSlider.calculateParams(fbSlider);
        fbSlider.durationOn(fbSlider);
    }, fbSlider.duration);
}, {passive: false});
//$("#to-nominations-button").click(getListener(rSlider.slideTo, 3, rSlider, true));