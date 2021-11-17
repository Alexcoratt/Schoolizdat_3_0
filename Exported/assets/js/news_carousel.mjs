import "./horisontal_sliders_lib.js";
import "./rslider_lib.js";


class NewsSingleBox extends SingleBox{

    bindArticleSlider(){
    
    }
}

class NewsRow extends BoxRow{
    
    constructor(node, singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        super(node, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        for (var i = 0; i < this.singleBoxList.length; i++)
            this.singleBoxList[i] = new NewsSingleBox(this.singleBoxList[i].node, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
    }
}

class NewsCarouselItem extends CarouselItem{

    constructor(node, rowClass="news-row", singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        super(node, rowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        for (var i = 0; i < this.boxRows.length; i++){
            this.boxRows[i] = new NewsRow(this.boxRows[i].node, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        }
    }
}

class NewsCarousel extends Feed{
    
    constructor(node, carItemRowClass="news-row", singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        super(node, carItemRowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        for (var i = 0; i < this.items.length; i++){
            this.items[i] = new NewsCarouselItem(this.items[i].node, carItemRowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        }
    }
}

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
            left: self.baseLeft - num * self.itemWidth
        },{
            duration: (!noDuration) ? self.duration : 0
        });
    }
}

var newsCar = new NewsCarousel(document.getElementById("carousel"));
newsCar.getSingleBox(0, 1, 0).setDefault();

var articleSlider = new ArticleSlider(document.getElementById("article-slider-inner"));
articleSlider.calculateParams();

$("#prev-button").click(getListener(articleSlider.slidePrevious, articleSlider));
$("#next-button").click(getListener(articleSlider.slideNext, articleSlider));
window.addEventListener("resize", getListener(articleSlider.calculateParams, articleSlider), {passive: false});
