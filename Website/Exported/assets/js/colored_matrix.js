class Pixel{
    constructor(size=4){
        this.size = size;
        this.node = document.createElement("div");
        this.node.className = "colorPixel";
        this.node.style.width = getPxSize(this.width);
        this.node.style.height = getPxSize(this.height);
        $(this.node).hover(function(){
            $(this.node).addClass("active");
        }, function(){
            $(this.node).removeClass("active");
        });
    }
}

class PixelRow{
    constructor(pxCount, pxSize){
        this.pxCount = pxCount;
        this.pxSize = pxSize;
        this.pixels = [];
        this.node = document.createElement("div");
        this.node.style.display = "flex";
        this.node.style.width = getPxSize(this.pxCount * this.pxSize);
        this.node.style.height = getPxSize(this.pxSize);
        for (var i = 0; i < this.pxCount; i++){
            this.pixels.push(new Pixel(this.pxSize));
            this.node.appendChild(this.pixels[i].node);
        }
    }
}

class PixelMatrix{
    constructor(width, height, pxSize){
        this.width = width;
        this.height = height;
        this.pxSize = pxSize;
        this.rowCount = Math.floor(this.height / this.pxSize);
        this.pxInRowCount = Math.floor(this.width / this.pxSize);
        this.rows = [];
        this.node = document.createElement("div");
        this.node.style.width = getPxSize(this.width);
        this.node.style.height = getPxSize(this.height);
        this.node.style.position = "absolute";
        var node;
        for (var i = 0; i < this.rowCount; i++){
            this.rows.push(new PixelRow(this.pxInRowCount, this.pxSize));
            node = this.rows[i].node;
            console.log(node);
            this.node.appendChild(node);
        }
    }
}
    
function getPxSize(pxNum){
    return pxNum + "px";
}


var pxMx = new PixelMatrix(300, 300, 30);
console.log(pxMx.node);