class SingleBox{    // класс отдельной новостной ячейки в ленте
    
    constructor(node){
        this.node = node;
        
        this.imageBox = this.node.getElementsByClassName("image-box")[0];
        this.image = this.imageBox.getElementsByClassName("news-image")[0];
        
        this.textBox = this.node.getElementsByClassName("text-box")[0];
        this.newsHeader = this.textBox.getElementsByClassName("news-header")[0];
        
        this.newsText = this.textBox.getElementsByClassName("news-text")[0];    // переменная, содержащая HTML код текстового блока новостного элемента
        
        this.fullText = this.getText(); // переменная, содержащая полный, а не обрезанный текст новости
        this.setText(this.fullText);
    }
    
    setHeader(text="Heading"){
        this.newsHeader.innerHTML = text;
    }
    
    setText(text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."){
        this.fullText = text;
        this.splitText();
    }
    
    setImage(src="default.png"){
        this.image.setAttribute("src", src);
    }
    
    getText(){
        return this.newsText.innerHTML;
    }
    
    getHeader(){
        return this.newsHeader.innerHTML;
    }
    
    setDefault(){
        this.setImage();
        this.setHeader();
        this.setText();
    }
    
    getClone(){
        return new SingleBox(this.node.cloneNode(1));
    }
    
    splitText(reqLen=154){  // обезает текст до указанной длины для укороченного представления новости
        var text = this.fullText;
        var len = text.length;
        if (len > reqLen){
            len = reqLen;
            while (text[len] != " ")
                len--;
            text = this.fullText.slice(0, len) + "...";
        }
        this.newsText.innerHTML = text;
    }
}

class CarouselItem{ // страница карусели
    
    constructor(node){
        this.node = node;
        this.boxRow = this.node.getElementsByClassName("box-row")[0];
        this.singleBoxList = Array.from(this.boxRow.getElementsByClassName("single-box"));  // массив всех новостных ячеек на данной странице карусели 
        for (var i = 0; i < this.singleBoxList.length; i++)
            this.singleBoxList[i] = new SingleBox(this.singleBoxList[i]);
    }
    
    clear(){    // очистка новостей, записаных на новостной странице
        this.boxRow.innerHTML = "";
        this.singleBoxList = [];
    }
    
    getBox(num){    // получение новости с номером num на данной новостной странице
        return this.singleBoxList[num];
    }
    
    addBox(singleBox){  // добавление новости на данную новостную страницу
        this.singleBoxList.push(singleBox);
        this.boxRow.appendChild(singleBox.node);
    }
    
    removeBox(num){ // удаление новости под номером num с новостной страницы
        this.boxRow.removeChild(this.getBox(num).node);
        this.singleBoxList.splice(num, 1);
    }
    
    getClone(){
        return new CarouselItem(this.node.cloneNode(1));
    }
    
    activate(){
        this.node.setAttribute("class", "carousel-item active");
    }
    
    deactivate(){
        this.node.setAttribute("class", "carousel-item");
    }
}

class Feed{ // класс ленты новостей, содержит новостные страницы
    
    constructor(node){
        this.node = node;
        this.feed = this.node.getElementsByClassName("carousel-inner")[0];
        this.items = Array.from(this.feed.getElementsByClassName("carousel-item"));
        for (var i = 0; i < this.items.length; i++)
            this.items[i] = new CarouselItem(this.items[i])
        
        this.indicators_node = this.node.getElementsByClassName("carousel-indicators")[0];  // переменная, содержащая <ol>, включащий индикаторы
        this.indicators = Array.from(this.indicators_node.children) // массив индикаторов (Indicator)
        for (var i = 0; i < this.indicators.length; i++)
            this.indicators[i] = new Indicator(this.indicators[i]);
    }
    
    getItem(num){
        return this.items[num];
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
    
    addIndicator(){
        var newIndicator = this.indicators[0].getClone();
        newIndicator.deactivate()
        newIndicator.setTarget(this.indicators.length)
        this.indicators.push(newIndicator);
        this.indicators_node.appendChild(newIndicator.node);
    }
    
    removeIndicator(num){
        this.indicators_node.removeChild(this.indicators_list[num].node);
        this.indicators.splice(num, 1);
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
        this.node.setAttribute("class", "carousel-indicator active");
    }
    
    deactivate(){
        this.node.setAttribute("class", "carousel-indicator");
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

