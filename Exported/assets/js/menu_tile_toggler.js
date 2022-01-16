class BurgerLine{
    
    constructor(node, duration=600){
        this.node = node;
        this.duration = duration;
        this.setDuration(duration);
    }
    
    setDuration(duration){
        this.node.setAttribute("style", "transition-duration: " + (duration / 1000) + "s;");
        this.duration = duration;
    }
    
    toggle(){
        this.node.classList.toggle("active");
    }
}

class NavmenuContainer{
    
    constructor(node, duration=600){
        this.node = node;
        if (this.node == undefined)
            console.log("NavmenuContainer is undefined");
        this.duration = duration;
        this.setDuration(duration);
    }
    
    setDuration(duration){
        if (this.node != undefined)
            this.node.setAttribute("style", "transition-duration: " + (duration / 1000) + "s;");
        this.duration = duration;
    }
    
    toggle(){
        if (this.node != undefined)
            this.node.classList.toggle("active");
    }
}

class BurgerIcon{
    
    constructor(node, duration=600){
        this.node = node;
        this.lines = Array.from(this.node.children);
        for (var i = 0; i < this.lines.length; i++){
            this.lines[i] = (new BurgerLine(this.lines[i]));
        }
    }
    
    toggle(self=this){
        for (var i = 0; i < self.lines.length; i++){
            self.lines[i].toggle();
        }
        navbar.find("#log-in-link").toggleClass("active");
    }
}

function adjustLinks(){
    var mbMarg = (navbar.width() - mlo.offset().left - mlo.width()) + "px"; // отступ .menu-block от правого края
    for (var i = 0; i < mb.length; i++){
        mb[i].style.right = mbMarg;
    }
}

var duration = 750;
var bi = new BurgerIcon(document.getElementsByClassName("burger-icon")[0], duration);
var nmc = new NavmenuContainer(document.getElementsByClassName("navmenu-container")[0], duration);

var navbar = $("#navbar");
var mlo = $("#menu-link-open");
var mb = $(".menu-block");
var mt = $("#menu-tile");

adjustLinks();

mlo.click(function(){
    
    bi.toggle(bi);
    nmc.toggle(nmc);
    mt.toggle({
        effect: "slide",
        direction: "right",
        duration: duration,
        easing: "swing"
    });
}); // закрепление выдвигания панели меню за кнопкой меню

mlo.hover(function(){
    $(this).children(".burger-line").addClass("focused");
}, function(){
    $(this).children(".burger-line").removeClass("focused");
});

window.addEventListener("resize", adjustLinks, false);  // перерасчет отступа при изменении размеров окна