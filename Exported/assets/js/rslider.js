function checkWidth(){
    if (window.innerWidth > 1000){
        fbSlider.setSlideMode("multi");
        newsSlider.off();
        $("#news-prev-button").hide();
        $("#news-next-button").hide();
    }
    else{
        fbSlider.setSlideMode("single");
        newsSlider.on();
        $("#news-prev-button").show();
        $("#news-next-button").show();
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
fbSlider.fillWithItems();
$("#prev-button").click(getListener(fbSlider.slidePrevious, fbSlider));
$("#next-button").click(getListener(fbSlider.slideNext, fbSlider));

var newsSlider = new CycledHatSlider(document.getElementsByClassName("news-row")[0], "news-box-paragraph", 700);
newsSlider.calculateParams();
newsSlider.setSlideMode("single");


$("#news-prev-button").click(getListener(newsSlider.slidePrevious, newsSlider));
$("#news-next-button").click(getListener(newsSlider.slideNext, newsSlider));

checkWidth();

window.addEventListener("resize", function(){
    fbSlider.durationOff(fbSlider);
    newsSlider.durationOff(newsSlider);
    checkWidth();
    setTimeout(function(){
        newsSlider.calculateParams(newsSlider);
        newsSlider.durationOn(newsSlider);
        fbSlider.calculateParams(fbSlider);
        fbSlider.durationOn(fbSlider);
    }, fbSlider.duration);
}, {passive: false});
//$("#to-nominations-button").click(getListener(rSlider.slideTo, 3, rSlider, true));