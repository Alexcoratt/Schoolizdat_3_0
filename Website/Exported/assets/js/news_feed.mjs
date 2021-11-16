import "./news_feed_lib.js";

var feed = new Feed(document.getElementsByClassName("carousel slide")[0]);
var item2 = feed.getItem(0).getClone();
item2.deactivate();
feed.addItem(item2);
var item3 = item2.getClone();
feed.addItem(item3);

for (var i = 0; i < feed.items.length; i++){
    var len = feed.getItem(i).singleBoxList.length;
    for (var j = 0; j < len; j++){
        feed.getItem(i).getBox(j).setHeader("Новость " + (len * i + j + 1));
        }
    }

var lBtn = new SlideButton(document.getElementsByClassName("btn slide-button")[0]);
var rBtn = new SlideButton(document.getElementsByClassName("btn slide-button")[1]);
