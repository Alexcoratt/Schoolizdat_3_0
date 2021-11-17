class Animated{
    
    constructor(node){
        this.node = node;
        this.properties = {};
        this.node.style.position = "relative";
        this.defineProperties();
        this.prepare();
    }
    
    defineProperties(){
        var attributes = this.node.attributes;
        for (var i = 0; i < attributes.length; i++){
            if (!["class", "style"].includes(attributes[i].name))
                this.properties[attributes[i].name] = attributes[i].value;
        }
    }
    
    prepare(){
        if (this.properties["a-property"] == "slide"){
            var x = this.node.offsetLeft;
            var width = this.node.offsetWidth;
            console.log(width);
            if (this.properties["a-direction"] == "right"){
                this.setStartPos(- x - width, 0);
            }
        }
    }
    
    setStartPos(x, y){
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    }
    
    setTriggers(){
        if (this.properties["a-trigger"] == "visible"){
            
        }
    }
}

/*var animatedElements = Array.from($(".animated"));
for (var i = 0; i < animatedElements.length; i++){
    animatedElements[i] = new Animated(animatedElements[i]);
}*/