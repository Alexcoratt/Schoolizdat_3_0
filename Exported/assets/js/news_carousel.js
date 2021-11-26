class NewsSingleBox extends SingleBox{

    constructor(node, headingClass="news-heading", paragraphClass="news-paragraph", imageClass="news-image"){
        super(node, headingClass, paragraphClass, imageClass);
        this.articleButton = this.node.getElementsByClassName("new-button")[0];
    }

    bind(articleItem){
        this.boundArticleItem = articleItem;
        this.boundArticleItem.bind(this);
    }
    
    bindButton(articleSlider, slideNum){
        $(this.articleButton).click(function(){
            articleSlider.slideTo(slideNum);
            $("html, body").animate({
                scrollTop: 0,
            }, {
                duration: 500,
                easing: "swing"
            });
        });
    }
}

class NewsRow extends BoxRow{
    
    constructor(node, singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        super(node, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        for (var i = 0; i < this.singleBoxList.length; i++)
            this.singleBoxList[i] = new NewsSingleBox(this.singleBoxList[i].node, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
    }
    
    getBoxesNum(){
        return this.singleBoxList.length;
    }
}

class NewsCarouselItem extends CarouselItem{

    constructor(node, rowClass="news-row", singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        super(node, rowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        for (var i = 0; i < this.boxRows.length; i++){
            this.boxRows[i] = new NewsRow(this.boxRows[i].node, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        }
    }
    
    getBoxesNum(){
        var i, result = 0;
        for (i = 0; i < this.boxRows.length; i++){
            result += this.getRow(i).getBoxesNum();
        }
        return result;
    }
}

class NewsCarousel extends Feed{
    
    constructor(node, articleSlider, carItemRowClass="news-row", singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        super(node, carItemRowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        this.articleSlider = articleSlider;
        for (var i = 0; i < this.items.length; i++){
            this.items[i] = new NewsCarouselItem(this.items[i].node, carItemRowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        }
    }
    
    getBoxesNum(){
        var i, result = 0;
        for (i = 0; i < this.items.length; i++){
            result += this.getItem(i).getBoxesNum();
        }
        return result;
    }
    
    bindAll(){
        var boxesNum = this.getBoxesNum(), i;
        var articleItemsNum = this.articleSlider.getLength();
        for (i = articleItemsNum; i > boxesNum; i--){
            this.articleSlider.removeLastItem();
        }
        for (i = articleItemsNum; i < boxesNum; i++){
            this.articleSlider.addItem();
        }
        this.articleSlider.calculateParams();
    
        var itemNum, rowNum, boxNum, counter = 0;
        for (itemNum = 0; itemNum < this.items.length; itemNum++){
            for (rowNum = 0; rowNum < this.getItem(itemNum).getLength(); rowNum++){
                for (boxNum = 0; boxNum < this.getItem(itemNum).getRow(rowNum).getLength(); boxNum++){
                    this.getSingleBox(itemNum, rowNum, boxNum).bind(this.articleSlider.getItem(counter));
                    this.getSingleBox(itemNum, rowNum, boxNum).bindButton(this.articleSlider, counter);
                    counter++;
                }
            }
        }
    }
}

class ArticleItem extends HatItem{

    constructor(node){
        super(node, "article-paragraph");
        this.imageNode = this.node.getElementsByClassName("article-image")[0];
        this.headingNode = this.node.getElementsByClassName("article-heading")[0];
        this.paragraphNode = this.node.getElementsByClassName("article-paragraph")[0];
    }
    
    setImageUrl(url){
        this.imageNode.style.backgroundImage = url;
    }
    
    setHeading(text){
        this.headingNode.innerHTML = text;
    }
    
    setParagraph(text){
        this.paragraphNode.innerHTML = text;
    }
    
    bind(singleBox){
        this.boundSingleBox = singleBox;
        this.setImageUrl(this.boundSingleBox.getImageUrl(true));
        this.setHeading(this.boundSingleBox.getHeading());
        this.setParagraph(this.boundSingleBox.getText(true));
    }
    
    checkBound(){
        this.setImageUrl(this.boundSingleBox.getImageUrl(true));
        this.setHeading(this.boundSingleBox.getHeading());
        this.setParagraph(this.boundSingleBox.getText(true));
    }
    
    getClone(){
        return new ArticleItem(this.node.cloneNode(true));
    }
}

class ArticleSlider extends HatSlider{

    constructor(node, duration=1000){
        super(node, "article-paragraph", duration);
        for (var i = 0; i < this.items.length; i++){
            this.items[i] = new ArticleItem(this.items[i].node);
            this.items[i].setDuration(this.duration);
            this.items[i].setPosition(this.getItemPos());
        }
    }
    
    calculateParams(self=this){
        var currentNum = self.getCurrentNum();
        var parentWidth = self.node.parentElement.offsetWidth;
        self.itemWidth = parentWidth;
        self.width = self.itemWidth * self.items.length;
        self.setWidth(self.width);
        self.baseLeft = 0;
        self.slideTo(self.getCurrentNum(), self, true);
    }
    
    getLength(){
        return this.items.length;
    }
    
    ready(){
        $(this.node).addClass("ready");
    }
    
    unready(){
        $(this.node).removeClass("ready");
    }
    
    addItem(item){
        if (item == undefined)
            item = this.items[this.getLength() - 1].getClone();
        return super.addItem(item);
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

var articleSlider = new ArticleSlider(document.getElementById("article-slider-inner"));
articleSlider.unready();
articleSlider.calculateParams();
$("#prev-button").click(getListener(articleSlider.slidePrevious, articleSlider));
$("#next-button").click(getListener(articleSlider.slideNext, articleSlider));
window.addEventListener("resize", getListener(articleSlider.calculateParams, articleSlider), {passive: false});

var newsCar = new NewsCarousel(document.getElementById("carousel"), articleSlider);
newsCar.bindAll();
articleSlider.ready();
articleSlider.checkView();
