var nom_links = $(".nomination-link");
var nom_link;

function activate(){
    $(this).parent(".nomination-box-tile").addClass("active");
    $(this).find(".nomination-icon-frame").addClass("active");
    $(this).find(".nomination-heading").addClass("active");
    $(this).find(".nomination-image").addClass("active");
}

function deactivate(){
    $(this).parent(".nomination-box-tile").removeClass("active");
    $(this).find(".nomination-icon-frame").removeClass("active");
    $(this).find(".nomination-heading").removeClass("active");
    $(this).find(".nomination-image").removeClass("active");
}

for(var i = 0; i < nom_links.length; i++){
    nom_link = $(nom_links[i]);
    nom_link.hover(activate, 
                   deactivate);
    nom_link.click(deactivate);
}