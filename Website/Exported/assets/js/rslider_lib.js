class RSliderIndicator{
    
    constructor(node){
        this.node = node;
    }
    
    activate(){
        var classes = this.node.classList;
        if (!classes.contains("active"))
            classes.add("active");
    }
    
    deactivate(){
        var classes = this.node.classList;
        if (classes.contains("active")){
            classes.remove("active");
        }
    }
    
    getClone(){
        return new RSliderIndicator(this.node.cloneNode());
    }
}

class RSlide{
    
    constructor(node, indicator){
        this.node = node;
        this.indicator = indicator;
        this.parameters = this.node.getBoundingClientRect();
    }
    
    activate(){
        var classes = this.node.classList;
        if (!classes.contains("active"))
            classes.add("active");
        this.indicator.activate();
    }   // метод активации слайда
    
    deactivate(){
        var classes = this.node.classList;
        if (classes.contains("active"))
            classes.remove("active");
        this.indicator.deactivate();
    }   // метод деактивации слайда
    
    getClone(){
        return new RSlide(this.node.cloneNode(), this.indicator);
    }
}

class RSlider{
    
    constructor(node, paginationNodeList, hatSlider=undefined, slideDuration=750){
        this.node = node;
        this.slides = Array.from(this.node.children);
        this.indicators = Array.from(paginationNodeList);
        this.currentSlideNum = undefined;
        this.isScrolling = false;
        this.slideDuration = slideDuration;
        this.hatSlider = (hatSlider != undefined) ? new HatSlider(hatSlider, 222, this.slideDuration) : undefined;
        this.isMouseWheel = false;
        var indicator;
        for (var i = 0; i < this.slides.length; i++){
            
            if (this.indicators[i] == undefined)
                this.addIndicator();
            else
                this.indicators[i] = new RSliderIndicator(this.indicators[i]);
            
            this.slides[i] = new RSlide(this.slides[i], this.indicators[i]);
            this.slides[i].indicator.node.addEventListener("click", getListener(this.slideTo, i, this));
        }
        this.currentSlideNum = this.getCurrentSlideNum();
    }
    
    getCurrentSlideNum(){
        var position = (window.pageYOffset !== undefined) ? window.pageYOffset : 0;
        var slideHeight = this.slides[0].node.offsetHeight;
        return Math.floor(position / slideHeight);
    }
    
    addIndicator(){
        var newIndicator = this.indicators[0].getClone();
        newIndicator.deactivate();
        this.indicators.push(newIndicator);
        this.indicators[0].node.parentNode.appendChild(newIndicator.node);
    }
    
    hideIndicators(){
        this.indicators[0].node.parentElement.parentElement.style.display = "none";
    }
    
    showIndicators(){
        this.indicators[0].node.parentElement.parentElement.style.display = "";
    }
    
    slidePrevious(self=this){
        self.slideDirection(-1);
    }
    
    slideNext(self=this){
        self.slideDirection(1);
    }
    
    slideDirection(num, self=this){
        self.slideTo((self.slides.length + self.currentSlideNum + num) % self.slides.length);
    }
    
    completeSlide(self=this){
        var nearestSlideNum,
            nearestDistance = self.slides[0].node.offsetHeight,
            distance;
        for (var i = 0; i < self.slides.length; i++){
            distance = Math.abs($(self.slides[i].node).offset().top - $(window).scrollTop());
            if (distance <= nearestDistance){
                nearestDistance = distance;
                nearestSlideNum = i;
            }
        }
        self.slideTo(nearestSlideNum);
    }   // доводка слайда
    
    slideTo(num, self=this){    // ВНИМАНИЕ! slideTo привязан к id слайда на странице, то есть он не сможет перейти к слайду, id которого не указан
        self.isScrolling = true;
        self.slides.forEach(function(slide){slide.deactivate();});
        self.slides[num].activate();
        if (self.hatSlider != undefined)
            self.hatSlider.slideTo(num);
        var scrollElement = $("#" + self.slides[num].node.getAttribute("id"));
        var scrollTop = scrollElement.offset().top;
        
        $("html, body").animate({
            scrollTop: scrollTop,
        }, {
            duration: self.slideDuration,
            easing: "swing",
            complete: function(){
                if (self.isMouseWheel)
                    self.isScrolling = false;
                else
                    setTimeout(function(){self.isScrolling = false;}, self.slideDuration);
            }
        });
        
        self.currentSlideNum = num;
    }   // при использовании this, функция, передаваемая в событие onClick, например, начинает работать иначе, поскольку новый
        // this это объект, событие onClick которого изменено. self=this - решение данной проблемы. Ниже описан механизм его работы
}

class HatItem{
    
    constructor(node){
        this.node = node;
        this.isCurrent = this.node.classList.contains("active");
    }
    
    getClone(){
        return new HatItem(this.node.cloneNode(true));
    }
    
    activate(){
        var classes = this.node.classList;
        if (!classes.contains("active")){
            classes.add("active");
            this.isCurrent = true;
        }
    }
    
    deactivate(){
        var classes = this.node.classList;
        if (classes.contains("active")){
            classes.remove("active");
            this.isCurrent = false;
        }
    }
    
    makeFar(){
        var classes = this.node.classList;
        if (!classes.contains("far")){
            classes.add("far");
        }
    }
    
    makeNear(){
        var classes = this.node.classList;
        if (classes.contains("far")){
            classes.remove("far");
        }
    }
    
    setWidth(width){
        this.node.style.width = (width) + "px";
    }
    
    setMargin(top=0, right=0, bottom=0, left=0){
        this.node.style.margin = top + "px " + right + "px " + bottom + "px " + left + "px";
    }
    
    getWidth(){
        return this.node.offsetWidth;
    }
    
    setDuration(duration){
        this.node.style.transitionDuration = (duration / 1000) + "s";
    }
    
    setPosition(position){
        this.node.style.position = position;
    }
    
    setLeft(value, unit="px"){
        this.node.style.left = value + unit;
    }
}

class HatSlider{
    constructor(node, duration=1000){
        this.node = node;
        this.items = Array.from(this.node.children);
        this.duration = duration;
        for (var i = 0; i < this.items.length; i++){
            this.items[i] = new HatItem(this.items[i]);
            this.items[i].setDuration(this.duration);
            this.items[i].setPosition(this.getItemPos());
            this.items[i].node.innerHTML = "<h1 style=\"position:absolute\">" + i + "</h1>" + this.items[i].node.innerHTML;    // нумерация для отладки
        }
        this.setPosition(this.getSelfPos());
    }
    
    getSelfPos(){
        return "relative"
    }
    
    getItemPos(){
        return "initial"
    }
    
    calculateParams(self=this){
        var currentNum = self.getCurrentNum();
        var parentWidth = self.node.parentElement.offsetWidth;
        self.items[currentNum].setMargin();
        self.itemWidth = self.items[currentNum].getWidth();
        self.width = self.itemWidth * self.items.length;
        self.setWidth(self.width);
        self.baseLeft = (parentWidth - self.itemWidth) / 2;
        self.node.style.left = self.baseLeft + "px";
        self.activeWidth = self.baseLeft * 2;
        self.activeMargin = (self.activeWidth - self.itemWidth) / 2;
        self.activeLeft = self.baseLeft - self.activeMargin;
        self.slideTo(self.getCurrentNum(), self, true);
    }
    
    getCurrentNum(){
        for (var i = 0; i < this.items.length; i++){
            if (this.items[i].isCurrent)
                return i;
        }
        return 0;
    }
    
    durationOff(self=this){
        for (var i = 0; i < self.items.length; i++){
            self.items[i].setDuration(0);
        }
    }
    
    durationOn(self=this){
        for (var i = 0; i < self.items.length; i++){
            self.items[i].setDuration(self.duration);
        }
    }
    
    slideNext(self=this){
        self.slideTo((self.getCurrentNum() + 1) % self.items.length);
    }
    
    slidePrevious(self=this){
        self.slideTo((self.getCurrentNum() - 1 + self.items.length) % self.items.length);
    }
    
    setWidth(width, unit="px"){
        this.node.style.width = width + unit;
    }
    
    setPosition(position){
        this.node.style.position = position;
    }
    
    slideTo(num, self=this, noDuration=false){
        for (var i = 0; i < self.items.length; i++){
            self.items[i].deactivate();
            self.items[i].setMargin();
            if (Math.abs(i - num) > 1)
                self.items[i].makeFar();
            else
                self.items[i].makeNear();
        }
        self.items[num].activate();
        self.items[num].setMargin(0, self.activeMargin, 0, self.activeMargin);
        
        $(self.node).animate({
            left: self.activeLeft - num * self.itemWidth
        },{
            duration: (!noDuration) ? self.duration : 0
        });
    }
}

class CycledHatSlider extends HatSlider{
    
    constructor(node, duration=1000){
        super(node, duration);
        var length = this.items.length;
        while (length < 5){
            for (var i = 0; i < length; i++){
                this.items.push(this.items[i].getClone());
                this.node.appendChild(this.items[this.items.length - 1].node);
            }   
            length = this.items.length
        }
    }
    
    getSelfPos(){
        return "initial"
    }
    
    getItemPos(){
        return "absolute"
    }

    calculateParams(self=this){
        var currentNum = self.getCurrentNum();
        var parentWidth = self.node.parentElement.offsetWidth;
        self.items[currentNum].setMargin();
        self.itemWidth = self.items[currentNum].getWidth();
        self.width = self.itemWidth * self.items.length;
        self.activeWidth = parentWidth - self.itemWidth;
        self.activeMargin = (self.activeWidth - self.itemWidth) / 2;
        self.baseLeft = -1.5 * self.itemWidth;
        self.slideTo(currentNum);
    }
    
    slideTo(num, self=this, noDuration=false){
        var index, i, len = self.items.length;
        for (i = 0; i < len; i++){
            self.items[i].makeNear();
            self.items[i].deactivate();
        }
        for (i = 0; i < len; i++){
            if (i < len - 3){
                self.items[(num + 2 + len + i) % len].makeFar();
            }
            index = (len + num - 2 + i) % len;
            self.items[index].setLeft(self.baseLeft + self.itemWidth * i + (2 - Math.abs(i - 3) + Math.abs(2 - Math.abs(i - 3))) / 2 * self.activeMargin); // при значениях i = 2 или 3 необходимо добавлять дополнительные промежутки, поскольку элемент №2 - средний. График той длинной функции с модулями выглядит, как _/\_, принимающий значения по y = 1 при x = 2 или 4, y = 2 при x = 3, y = 0 - в остальных случаях 
        }
        self.items[num].activate();
    }
}

function getListener(...args){  // функция, возвращающая функцию, для передачи внутрь метода onClick
    var fn = args.shift();
    return function(){
        fn(...args);
    }
}

/*====================
self=this
Использование переменной/аргумента self позволяет обойти особенность присваивания событию onClick внутренней функции какого-либо объекта:
передаваемая функция становится внутренней функцией метода onClick, а значит this становится совсем другим. Использование self позволяет присвоить
исходный объект извне, что и является решением
====================*/