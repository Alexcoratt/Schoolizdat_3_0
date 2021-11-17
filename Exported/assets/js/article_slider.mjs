import "./rslider_lib.js";

class ArticleSlider extends HatSlider{
    
    calculateParams(self=this){
        var currentNum = self.getCurrentNum();
        var parentWidth = self.node.parentElement.offsetWidth;
        self.itemWidth = parentWidth / 2;
        self.width = self.itemWidth * (self.items.length + 1);
        self.setWidth(self.width);
        self.baseLeft = 0;
        self.slideTo(self.getCurrentNum(), self, true);
    }
    
    slideTo(num, self=this, noDuration=false){
        for (var i = 0; i < self.items.length; i++){
            self.items[i].deactivate();
        }
        self.items[num].activate();
        
        $(self.node).animate({
            left: self.activeLeft - num * self.itemWidth
        },{
            duration: (!noDuration) ? self.duration : 0
        });
    }
}

var articleSlider = new ArticleSlider(document.getElementById("article-slider-inner"));
articleSlider.calculateParams();

$("#prev-button").click(getListener(articleSlider.slidePrevious, articleSlider));
$("#next-button").click(getListener(articleSlider.slideNext, articleSlider));
