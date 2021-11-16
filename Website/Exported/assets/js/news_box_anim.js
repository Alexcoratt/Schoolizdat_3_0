var news_boxes = $(".news-column");

function activate(){
    $(this).find(".news-tile").addClass("active");
    $(this).find(".news-frame").addClass("active");
}

function deactivate(){
    $(this).find(".news-tile").removeClass("active");
    $(this).find(".news-frame").removeClass("active");
}

for (var i = 0; i < news_boxes.length; i++){
    $(news_boxes[i]).hover(activate, deactivate);
}