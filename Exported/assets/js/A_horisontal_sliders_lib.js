class SingleBox{    // класс отдельной новостной ячейки в ленте
    
    constructor(node, headingClass="news-heading", paragraphClass="news-paragraph", imageClass="news-image"){
        this.node = node;
        
        this.image = this.node.getElementsByClassName(imageClass)[0];
        this.newsHeading = this.node.getElementsByClassName(headingClass)[0];
        
        this.newsParagraph = this.node.getElementsByClassName(paragraphClass)[0];    // переменная, содержащая HTML код текстового блока новостного элемента
        
        this.fullText = this.getText(); // переменная, содержащая полный, а не обрезанный текст новости
        this.setText(this.fullText);
    }
    
    setHeading(text="Heading"){
        this.newsHeading.innerHTML = text;
    }
    
    setText(text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."){
        this.fullText = text;
        this.newsParagraph.innerHTML = this.splitText(text);
    }
    
    setImageUrl(url="../default.png"){
        this.image.style.backgroundImage = "url(\"" + url + "\")";
    }
    
    getImageUrl(noSplit=false){
        var url = this.image.style.backgroundImage;
        if (noSplit){
            return url;
        }
        return url.substring(5, url.length - 2);
    }
    
    getText(isFull=false){
        if (isFull){
            return this.fullText;
        }
        return this.newsParagraph.innerHTML;
    }
    
    getHeading(){
        return this.newsHeading.innerHTML;
    }
    
    setDefault(){
        this.setImageUrl();
        this.setHeading();
        this.setText();
    }
    
    getClone(){
        return new SingleBox(this.node.cloneNode(1));
    }
    
    splitText(text, reqLen=128){  // обезает текст до указанной длины для укороченного представления новости
        var len = text.length;
        if (len > reqLen){
            len = reqLen;
            while (text[len] != " ")
                len--;
            return text.slice(0, len) + "...";
        }
        return text
    }
}

class BoxRow{
    
    constructor(node, singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        this.node = node;
        this.singleBoxList = Array.from(this.node.getElementsByClassName("single-box"));
        for (var i = 0; i < this.singleBoxList.length; i++)
            this.singleBoxList[i] = new SingleBox(this.singleBoxList[i], singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
    }
    
    getBox(num){    // получение новости с номером num на данной новостной странице
        return this.singleBoxList[num];
    }   
    
    getLength(){
        return this.singleBoxList.length;
    }
    
    addBox(singleBox){  // добавление новости на данную новостную страницу
        this.singleBoxList.push(singleBox);
        this.node.appendChild(singleBox.node);
    }
    
    removeBox(num){ // удаление новости под номером num с новостной страницы
        this.node.removeChild(this.getBox(num).node);
        this.singleBoxList.splice(num, 1);
    }
}

class CarouselItem{ // страница карусели
    
    constructor(node, rowClass="news-row", singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        this.node = node;
        this.boxRows = Array.from(this.node.getElementsByClassName(rowClass));
        for (var i = 0; i < this.boxRows.length; i++){
            this.boxRows[i] = new BoxRow(this.boxRows[i], singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        }
    }
    
    getRow(num){
        return this.boxRows[num];
    }
    
    getLength(){
        return this.boxRows.length;
    }
    
    addRow(boxRow){
        this.boxRows.push(boxRow);
        this.node.appendChild(boxRow.node);
    }
    
    removeRow(num){
        this.node.removeChild(this.getBox(num).node);
        this.boxRows.splice(num, 1);
    }
    
    getClone(){
        return new CarouselItem(this.node.cloneNode(1));
    }
    
    activate(){
        $(this.node).addClass("active");
    }
    
    deactivate(){
        $(this.node).removeClass("active");
    }
}

class Feed{ // класс ленты новостей, содержит новостные страницы
    
    constructor(node, carItemRowClass="news-row", singleBoxHeadingClass="news-heading", singleBoxParagraphClass="news-paragraph", singleBoxImageClass="news-image"){
        this.node = node;
        this.items = Array.from(this.node.getElementsByClassName("carousel-item"));
        for (var i = 0; i < this.items.length; i++)
            this.items[i] = new CarouselItem(this.items[i], carItemRowClass, singleBoxHeadingClass, singleBoxParagraphClass, singleBoxImageClass);
        
        this.indicatorsNode = this.node.getElementsByClassName("carousel-indicators")[0];
        this.indicators = Array.from(this.indicatorsNode.getElementsByClassName("carousel-indicator")); // массив индикаторов (Indicator)
        for (var i = 0; i < this.indicators.length; i++)
            this.indicators[i] = new Indicator(this.indicators[i]);
        
        for (var i = this.indicators.length; i > this.items.length; i--){
            this.removeLastIndicator();
        }
        for (var i = this.indicators.length; i < this.items.length; i++){
            this.addIndicator(i + 1);
        }
    }
    
    getItem(num){
        return this.items[num];
    }
    
    getLength(){
        return this.items.length;
    }
    
    getSingleBox(itemNum, rowNum, boxNum){
        return this.getItem(itemNum).getRow(rowNum).getBox(boxNum);
    }
    
    removeItem(num){
        this.feed.removeChild(this.getItem(num).node);
        this.items.splice(num, 1);
        this.removeIndicator(num);
    }
    
    addItem(item){
        this.feed.appendChild(item.node);
        this.items.push(item);
        this.addIndicator();
    }
    
    clear(){    // доработать
        this.feed.innerHTML = "";
        this.items = [];
    }
    
    addIndicator(innerText="indicator"){
        var newIndicator = this.indicators[0].getClone();
        newIndicator.deactivate()
        newIndicator.setTarget(this.indicators.length)
        this.indicators.push(newIndicator);
        this.indicatorsNode.appendChild(newIndicator.node);
        newIndicator.node.innerHTML = innerText;
    }
    
    removeIndicator(num){
        this.indicators_node.removeChild(this.indicators_list[num].node);
        this.indicators.splice(num, 1);
    }
    
    removeLastIndicator(){
        this.removeIndicator(this.indicators.length - 1);
    }
    
    slideTo(num){  // переворачивает страницу мгновенно без анимации прокрутки
        for (var i = 0; i < this.items.length; i++){
                this.items[i].deactivate();
                this.indicators[i].deactivate();
            }
        this.items[num].activate(); 
        this.indicators[num].activate();
    }
}

class Indicator{
    
    constructor(node){
        this.node = node;
    }
    
    getClone(){
        return new Indicator(this.node.cloneNode(1));
    }
    
    activate(){
        $(this.node).addClass("active");
    }
    
    deactivate(){
        $(this.node).removeClass("active");
    }
    
    setTarget(target){
        this.node.setAttribute("data-slide-to", target);
    }
}

class SlideButton{      // не является эффективным ввиду, насколько я понял (экспериментально), отсутствия передачи
                        // объекта и функции как единого целого при присваивании его к onclick событию
    constructor(node){
        this.node = node;
        this.direction = this.node.getAttribute("direction"); // атрибут direction указывается числом -1 или 1 в зависимости от направления прокрутки
        this.node.addEventListener("click", this.onclick)
    }
    
    onclick(){
        
        var currentItem = 0;
        var items = document.getElementsByClassName("carousel-item");
        var direction = parseInt(this.getAttribute("direction"));
        var itemsNum = items.length;
        
        while (!(items[currentItem].classList.contains("active")) && (currentItem < itemsNum - 1))
            currentItem++;
               
        var newTarget = currentItem + direction;
        
        if (newTarget < 0)
            newTarget += itemsNum;
        else if (newTarget >= itemsNum)
            newTarget -= itemsNum;
        
        this.setAttribute("data-slide-to", newTarget);
    }
        
}

class HatItem{
    
    constructor(node, textBoxClassName){
        this.node = node;
        this.isCurrent = this.node.classList.contains("active");
        this.textBoxClassName = textBoxClassName;
        this.fullText = this.node.getElementsByClassName(this.textBoxClassName)[0].innerHTML;
    }
    
    getClone(){
        var result = new HatItem(this.node.cloneNode(true), this.textBoxClassName);
        result.setText(this.getText());
        return result;
    }
    
    getText(){
        return this.fullText;
    }
    
    splitText(text, reqLen=128){  // обезает текст до указанной длины для укороченного представления новости
        var len = text.length;
        if (len > reqLen){
            len = reqLen;
            while (text[len] != " ")
                len--;
            return text.slice(0, len) + "...";
        }
        return text
    }
    
    setText(text, noSplit=true){
        this.fullText = text
        this.node.getElementsByClassName(this.textBoxClassName)[0].innerHTML = (noSplit) ? text : this.splitText(text);
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
        this.node.style.opacity = "0";
    }
    
    makeNear(){
        var classes = this.node.classList;
        if (classes.contains("far")){
            classes.remove("far");
        }
        this.node.style.opacity = "1";
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
    
    getHeight(){
        return this.node.offsetHeight;
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
    constructor(node, textBoxClassName, duration=1000){
        this.node = node;
        this.nodeSnapshot = node.cloneNode(true);
        this.node.parentElement.insertBefore(this.nodeSnapshot, this.node);
        this.items = Array.from(this.node.children);
        this.duration = duration;
        for (var i = 0; i < this.items.length; i++){
            this.items[i] = new HatItem(this.items[i], textBoxClassName);
            this.items[i].setDuration(this.duration);
            this.items[i].setPosition(this.getItemPos());
            //this.items[i].node.innerHTML = "<h1 style=\"position:absolute\">" + i + "</h1>" + this.items[i].node.innerHTML;    // нумерация для отладки
        }
        this.setPosition(this.getSelfPos());
        this.isOn = false;
        this.on();
    }
    
    getItem(num){
        return this.items[num];
    }
    
    getSelfPos(){
        return "relative";
    }
    
    setHeight(height, unit="px"){
        this.node.style.height = height + unit;
    }
    
    getItemPos(){
        return "initial";
    }
    
    addItem(item){
        if (item == undefined)
            item = this.items[this.items.length - 1].getClone();
        this.items.push(item);
        this.node.appendChild(item.node);
    }
    
    removeItem(num){
        this.node.removeChild(this.items[num].node);
        this.items.splice(num, 1);
    }
    
    removeLastItem(){
        this.removeItem(this.items.length - 1);
    }
    
    calculateParams(self=this){
        if (self.isOn) {
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
    
    off(self=this){
        if (self.isOn){
            self.nodeSnapshot.style.display = "";
            self.node.style.display = "none";
        }
        self.isOn = false;
    }
    
    on(self=this){
        if (!self.isOn){
            self.nodeSnapshot.style.display = "none";
            self.node.style.display = "";
        }
        self.isOn = true;
    }
    
    getItem(num){
        return this.items[num];
    }
    
    slideTo(num, self=this, noDuration=false){
        if (self.isOn){
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
}

class CycledHatSlider extends HatSlider{
    
    constructor(node, duration=1000){
        super(node, duration);
        var length = this.items.length;
        while (length < 5){
            for (var i = 0; i < length; i++){
                this.addItem(this.items[i].getClone());
            }   
            length = this.items.length;
        }
        this.slideMode = "multi";
    }
    
    setSlideMode(mode="multi"){
        this.slideMode = mode;
        this.calculateParams();
    }
    
    getSelfPos(){
        return "initial";
    }
    
    getItemPos(){
        return "absolute";
    }

    calculateParams(self=this){
        if (self.isOn) {
            var currentNum = self.getCurrentNum();
            var parentWidth = self.node.parentElement.offsetWidth;
            self.items[currentNum].setMargin();
            self.itemWidth = self.items[currentNum].getWidth();
            if (self.slideMode == "multi"){
                self.activeWidth = parentWidth - self.itemWidth;
                self.baseLeft = -1.5 * self.itemWidth;
            }
            else if (self.slideMode == "single"){
                self.activeWidth = parentWidth;
                self.baseLeft = -2 * self.itemWidth;
            }
            self.activeMargin = (self.activeWidth - self.itemWidth) / 2;
            self.width = self.itemWidth * 4 + self.activeWidth;
            self.setHeight(this.items[currentNum].getHeight() + 64);
            self.slideTo(currentNum);
        }
    }
    
    slideTo(num, self=this, noDuration=false){
        
        function f(x){
            return (x + 1 + Math.abs(2 - Math.abs(x - 3))) / 2 - 1;
        } //График функции принимает значения по y = 0 при x < 2, y = 1 при x = 2, y = 2 - в остальных случаях 
        
        if (self.isOn){
            var index, i, len = self.items.length;
            for (i = 0; i < len; i++){
                self.items[i].makeNear();
                self.items[i].deactivate();
            }
            for (i = 0; i < len - 3; i++){
                self.items[(num + 2 + len + i) % len].makeFar();
            }
            for (i = 0; i < 5; i++){
                index = (len + num - 2 + i) % len;
                self.items[index].setLeft(self.baseLeft + self.itemWidth * i + f(i) * self.activeMargin); // при значениях i = 2 или 3 необходимо добавлять дополнительные промежутки, поскольку элемент №2 - средний
            }
            self.items[num].activate();
        }
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

