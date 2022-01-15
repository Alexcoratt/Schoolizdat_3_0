class WorkViewSlider extends CycledHatSlider {
    
    calculateParams(self=this) {
        var currentNum = self.getCurrentNum();
        self.activeMargin = 25;
        self.itemWidth = self.items[currentNum].getWidth();
        self.activeWidth = self.itemWidth;
        
        self.baseLeft = -2.33 * self.itemWidth;
        
        self.maxItemsCount = Math.ceil(self.node.offsetWidth / (self.itemWidth + self.activeMargin * 2));
        
        self.slideTo(currentNum);
    }
    
    slideTo(num, self=this, noDuration=false) {
        if (self.isOn){
            var index, i, len = self.items.length;
            for (i = 0; i < len; i++){
                self.items[i].makeNear();
                self.items[i].deactivate();
            }
            for (i = 0; i < len - self.maxItemsCount - 1; i++){
                self.items[(num + len + i + self.maxItemsCount) % len].makeFar();
            }
            for (i = 0; i < len; i++){
                index = (num + i + len - 2) % len;
                self.items[index].setLeft(self.baseLeft + (2 * self.activeMargin + self.itemWidth) * i);
            }
            self.items[num].activate();
        }
    }
    
    readContents(contentsId="work-output-contents") {
        try {
            var contents = document.getElementById(contentsId).children;
            var i, j;
            var newItem;
            for (i = 0; i < contents.length; i++){
                newItem = this.getItem(this.items.length - 1).getClone();
                newItem.node.style.backgroundImage = "url(\"" + contents[i].getAttribute("imageurl") + "\")";
                newItem.node.getElementsByClassName("work_link")[0].setAttribute("href", contents[i].getAttribute("imageurl"));
                newItem.node.getElementsByClassName("heading-work-box")[0].innerHTML = contents[i].getAttribute("heading");
                newItem.node.getElementsByClassName("text-work-box")[0].innerHTML = contents[i].getAttribute("text");
                this.addItem(newItem);
            }
            this.removeItem(0);
        } catch (TypeError){
            console.log("#" + contentsId + " contents are unavailable");
        }
    }
}

var wvs = new WorkViewSlider(document.getElementsByClassName("work-row")[0], "text-work-box");

$("#next-button").click(getListener(wvs.slideNext, wvs));
$("#prev-button").click(getListener(wvs.slidePrevious, wvs));
 
wvs.readContents();
wvs.fillWithItems();
