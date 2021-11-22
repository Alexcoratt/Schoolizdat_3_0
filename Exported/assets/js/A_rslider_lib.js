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
        this.isOn = true; // включен ли слайдер
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
        self=this;
        this.onWheelFunc = function(e){self.onWheel(e, self);};
        this.on();
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
    
    paginationHide(){
        $("#pagination").hide();
    }
    
    paginationShow(){
        $("#pagination").show();
    }
    
    off(self=this){
        self.isOn = false;
        self.paginationHide();
        document.getElementsByTagName("html")[0].style.overflow = "visible";
        window.removeEventListener("wheel", this.onWheelFunc, {passive: false});
    }
    
    on(self=this){
        self.isOn = true;
        self.paginationShow();
        self.completeSlide();
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
        window.addEventListener("wheel", this.onWheelFunc, {passive: false});
    }
    
    toggle(self=this){
        if (self.isOn)
            self.off();
        else
            self.on();
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
    
    slideTo(num, self=this, ignoreOff=false){    // ВНИМАНИЕ! slideTo привязан к id слайда на странице, то есть он не сможет перейти к слайду, id которого не указан
        num = num % self.slides.length;
        if (self.isOn || ignoreOff){
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
    
    onWheel(e, self=this){
        if (self.isOn){
            if (!self.isScrolling){
                var delta = e.deltaY,
                    absDelta = Math.abs(Math.round(delta));
                self.isMouseWheel = (absDelta == 4) || (absDelta == 16); // адаптивный скроллинг, в подавляющем большинстве случаев верно различающий
                                                                            // скроллинг мышью и тачпадом. (колесико прокручивает страницу на 4 единицы в
                var direction = Math.sign(delta);                           // chrome, safari, edge, и на 16 - в firefox)
                self.slideDirection(direction);
            }
            e.preventDefault();
        }
    }
}

/*====================
self=this
Использование переменной/аргумента self позволяет обойти особенность присваивания событию onClick внутренней функции какого-либо объекта:
передаваемая функция становится внутренней функцией метода onClick, а значит this становится совсем другим. Использование self позволяет присвоить
исходный объект извне, что и является решением
====================*/