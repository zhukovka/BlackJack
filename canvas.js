var Canvas = (function(selector, img){

    return {
        init: function (c, ctx, img) {
            console.log('INIT Canvas');
            var self = this;
            /*context*/
                this.width = c.width;
                this.height = c.height;
                this.ctx = ctx;
                Shape.prototype.ctx = ctx;
            /*cursor*/
                var cursor = this.setCursor(ctx);
                // cursor.draw();
            /*image*/
                this.addImage(img, 'cardsImg');
                this.addImage('startGame.jpg', 'startImg');
            /*listeners*/
                // document.body.addEventListener('keydown', function (e) {
                //     var code = e.keyCode || e.charCode;
                //     if(code >= 65 && code <= 90){
                //         self.drawName(String.fromCharCode(code));
                //     }
                //     if(e.keyIdentifier=="Enter"){
                //         console.log(e.keyIdentifier);
                //         cursor.stop();
                //     }
                // });
        },
        addImage: function (path, name) {
            var img = new Image();
            img.src = path/*'classic-playing-cards.png'*/;
            /*if we want to save image to the Canvas object we name it*/
            if(name){
                this[name] = img;
            }
            return img;
        },
        setCursor: function (ctx) {
            // body...
            this.cursor = {
                x: 10,
                y: 10,
                height: 20,
                width:2,
                draw: function () {
                    console.log('Draw', this.y,this.height);
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x, this.y+this.height);
                    ctx.stroke();
                    this.interval = setTimeout(this.clear.bind(this), 500);
                },
                clear: function () {
                    ctx.clearRect(this.x-1, this.y, this.width, this.height);
                    this.interval = setTimeout(this.draw.bind(this), 500);
                },
                stop: function () {
                    clearTimeout(this.interval);
                    ctx.clearRect(this.x-1, this.y, this.width, this.height);
                },
                move: function (x,y) {
                    ctx.clearRect(this.x-1, this.y, this.width, this.height);
                    this.x = x || this.x;
                    this.y = y || this.y;
                }
            }
            return this.cursor;
        },
        drawCard: function (card, canvasX, canvasY, cardsNum, width, height) {
            var pos = (card.name==14) ? 1 : card.name;
            col = (pos-1)*width,/*column(name)*/
            row = (cardMap[card.shape]-1)*height;/*row(shape)*/
            // console.log('CanvasX', canvasX);
            this.ctx.drawImage(this.cardsImg, col, row, width, height, canvasX, canvasY, width, height);
        },
        drawCards : function (player) {
            // console.log('player', player);
            var width = cardMap.width,
                height = cardMap.height,
                canvasY = player.y,
                font = 20,
                n = 0;
                // txt = 'Value:'+player.value;
                // console.log('ctx.measureText(txt)',ctx.measureText(txt));
                this.ctx.clearRect(player.x, player.y, (width)+n, height);
                // var txt = 'Value:'+player.value;
                // drawText(txt, player.x, player.y-10, font);
                
                player.cards.forEach(function(card, index){
                    // console.log('Draw', card);
                    var canvasX = n+player.x-width*index;
                    if(player.cards.length>2){
                        n = 30*(index+1);
                    }
                    this.drawCard(card, canvasX, canvasY, index, width, height);
                }, this);
                // ctx.fillRect(player.x, player.y-10, 5, 5);

        },
        drawText: function(text, x, y, font, line) {
            console.log('Text', text);
            /*context.fillText(text,x,y,maxWidth);*/
            this.ctx.font = font+"px Arial";
            this.ctx.textBaseline = line || "middle"; 
            this.ctx.clearRect(x, y-(font/2), this.ctx.measureText(text).width+1, font);
            this.ctx.fillText(text,x,y);
        },
        drawName: function(char) {
        
            this.drawText(char, this.cursor.x, this.cursor.y, 20, 'top');
            this.cursor.move(this.cursor.x + this.ctx.measureText(char).width+1);
        },
        drawTable: function () {
            var i = 0,
                r = 550,
                x = this.width/2,
                y = 100,
                width = 150,
                height = 50,
                deg = (Math.PI/180),
                pos1 = pos2 = 90;
            

            this.dealerPlace = new Rect({x:x, y:y, width:30, height:30});
            this.dealerPlace.draw('green');
            this.playerPlaces = [];
            while(i<=4){
                console.log('I', i, pos1, pos2);
                if(i%2==0){
                    var rect = new Rect({x:Math.cos(deg*(pos1))*r+(x-width/2), y:Math.sin(deg*(pos1))*r-y, width:width, height:height});
                    pos1 -= 30; 
                }else{
                    pos2 += 30;
                    var rect = new Rect({x:Math.cos(deg*(pos2))*r+(x-width/2), y:Math.sin(deg*(pos2))*r-y, width:width, height:height});
                }
                rect.draw('black');
                this.playerPlaces.push(rect);
                i+=1;
            }
        },
        drawStartGame: function () {
            
            var im = new Img({img: this.startImg, width: this.width, height: this.height});
            console.log('img', im);
            im.draw();

        },
        clear: function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
        },
        renderDialog: function (name, value) {
            var container = document.querySelector('.start');
            var template = document.querySelector('#choise_dialog').innerHTML
                            .replace('{{name}}', name)
                            .replace('{{value}}', value);
            if(container){
                container.innerHTML = template;
                container.style.display = 'block';
            }
            return container;
        }

    }
})('#myCanvas', 'classic-playing-cards.png');

function Shape (opts) {
    var options = (arguments.length > 1) ? arguments : opts || {};
    
    if(options[0] instanceof Point){
        // console.log('ShapeFromPoints', options);
        Shape.prototype.ShapeFromPoints.call(this, options);
    }else{

        this.x = options.x || options[0] || 0;
        this.y = options.y || options[1] || 0;
        /*this.width = options.width || options[2] || 10;
        this.height = options.height || options[3] || 10;*/
    }
}

Shape.prototype.move = function(point){
    /*@point - Point or arguments (x,y)*/
    this.x = point.x || arguments[0];
    this.y = point.y || arguments[1];
};

Shape.prototype.draw = function(opts){
    console.log('draw', opts);
    if(opts.fill){
        this.ctx.fillStyle=opts.fill;
    }
    if(opts.close){
        this.ctx.closePath();
    }
    if(opts.stroke){
        this.ctx.strokeStyle=opts.stroke;
    }
};

Shape.prototype.ShapeFromPoints = function () {
    var points = Array.prototype.slice.call(arguments[0]);
    console.log('points', points[0].x, points[0].y);
    this.x = points[0].x || 0;
    this.y = points[0].y || 0;
    // this.width = points[points.length-1].x || 10;
    // this.height = points[points.length-1].y || 10;
}



function Point (x,y) {
    this.x = x;
    this.y = y;
}

function Line (opts) {
    Shape.call(this, opts);
}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.draw = function(opts) {
    /*points, stroke, fill, close*/
    var options = (typeof arguments[0] === "string") ? {stroke:opts} : opts || {};
    // var options = (arguments.length > 1) ? arguments : opts || {};
    Shape.prototype.draw.call(this, options);
    this.ctx.beginPath();
    this.ctx.moveTo(this.x,this.y);
    if(!options.points){
        var x = options.x || this.x+10;
        var y = options.y || this.y+10;
        this.ctx.lineTo(x, y);
    }else{
        options.points.forEach(function(point, index){
            this.ctx.lineTo(point.x, point.y);
        }, this);
    }
    
    this.ctx.stroke();
};

function Text (opts) {
    var options = (typeof arguments[0] === "string") ? {x: 0, y: 0, text: opts} : opts;
    Shape.call(this, options);
    this.text = options.text || 'Hello';
}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.draw = function(opts) {
    var options = (typeof arguments[0] === "string") ? {fill:opts} : opts || {};
    /*fill, font, textBaseline, stroke, lineWidth*/
    Shape.prototype.draw.call(this, options);
    this.ctx.font = options.font || "20px Georgia";
    this.ctx.textBaseline= options.textBaseline || "middle"; 
    if(options.stroke){
        this.ctx.lineWidth = options.lineWidth || 1;
        this.ctx.strokeText(this.text,this.x,this.y);
    }
    this.ctx.fillText(this.text,this.x,this.y);
};

function Circle (opts) {
    /*context.arc(x,y,r,sAngle,eAngle,counterclockwise);*/
    var options = (arguments.length > 1) ? arguments : opts || {};
    Shape.call(this, options);
    this.r = options.r || options[2] || 50;
    this.sAngle = options.sAngle || options[3] || 0;
    this.eAngle = options.eAngle || options[4] || (2*Math.PI);
    this.counterclockwise = options.counterclockwise || options[5] || false;
}
Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.draw = function(opts){
    var options = (typeof arguments[0] === "string") ? {stroke:opts} : opts || {};
    this.ctx.beginPath();
    Shape.prototype.draw.call(this, options);
    this.ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle,this.counterclockwise);
    this.ctx.stroke();
    if(options.fill){
        this.ctx.fill();
    }
};

function Rect (opts) {
    /*x,y,width,height*/
    var options = (arguments.length > 1) ? arguments : opts || {};
    Shape.call(this, options);
    this.width = options.width || options[2] || 50;
    this.height = options.height || options[3] || 50;
}
Rect.prototype = Object.create(Shape.prototype);

Rect.prototype.draw = function(opts){
    var options = (typeof arguments[0] === "string") ? {stroke:opts} : opts || {};
    this.ctx.beginPath();
    Shape.prototype.draw.call(this, options);
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.stroke();
    if(options.fill){
        this.ctx.fill();
    }
};

function RoundedRect (opts) {
    /*x,y,width,height,radius*/
    var options = (arguments.length > 1) ? arguments : opts || {};
    Rect.call(this, options);
    this.radius = options.radius || options[4] || 10;
}
RoundedRect.prototype = Object.create(Rect.prototype);
RoundedRect.prototype.draw = function(opts) {
    /*points, stroke, fill, close*/
    var options = (typeof arguments[0] === "string") ? {stroke:opts} : opts || {};
    // var options = (arguments.length > 1) ? arguments : opts || {};
    Shape.prototype.draw.call(this, options);
    this.ctx.beginPath();
    var x = this.x,
        y = this.y,
        r = this.radius,
        w = this.width,
        h = this.height;
    this.ctx.moveTo((x+r), y);
    this.ctx.arcTo((x+w), y, (x+w), (y+r), r);
    
    this.ctx.lineTo((x+w), (y+h-r));
    this.ctx.arcTo((x+w), (y+h), (x+w-r), (y+h), r);

    this.ctx.lineTo((x+r), (y+h));
    this.ctx.arcTo((x), (y+h), x, (y+h-r), r);

    this.ctx.lineTo((x), (y+r));
    this.ctx.arcTo(x, y, (x+r), y, r);

    this.ctx.closePath();
    this.ctx.stroke();
};

function Img (opts) {
    var img, options = {};
    if(typeof arguments[0] === "string"){
        img = new Image();
        img.src = arguments[0];
    }else{
        options = (arguments.length > 1) ? arguments : opts || {};
    }
    Shape.call(this, options);
    this.img = img || options.img || options[2];
    this.width = options.width || options[3] || 900;
    this.height = options.height || options[4] || 450;
}
Img.prototype = Object.create(Shape.prototype);

Img.prototype.draw = function(opts){
    /*context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);*/
    var options = (arguments.length > 1) ? arguments : opts || {};
    var sx = options.sx || this.x,
        sy = options.sy || this.y,
        swidth = options.swidth || this.width,
        sheight = options.sheight || this.height,
        width = options.width || this.width || 900,
        height = options.height || this.height || 450;
    console.log(this.img, sx, sy, swidth, sheight, this.x, this.y, width, height);
    this.ctx.drawImage(this.img, sx, sy, swidth, sheight, this.x, this.y, width, height);
};
// Shape.prototype.draw = function(){
    
// };
// console.log(Canvas.ctx);
var p1 = new Point(10,10);
var p2 = new Point(20,20);
var s0 = new Shape();
var s1 = new Shape([15,15,30,30]);
var s2 = new Shape([p1, p2]);
var s3 = new Shape({x:45,y:45,width:60,height:60});
var l1 = new Line();
console.log('s1', s1);
console.log('s2', s2);
console.log('s3', s3);
var txt = new Text('ololo');
// var c = new Circle(140,140, 70);
var r = new RoundedRect(20,20, 100, 70, 14);
// var im = new Img('startGame.jpg');
// console.log('s0 s1 s1 s2 l1', s0, s1, s1, s2, l1); // s1.setContext(Canvas.ctx);
    // var ctx = 


    // document.body.addEventListener('keydown', function (e) {
    //     var code = e.keyCode || e.charCode;
    //     if(code >= 65 && code <= 90){
    //         drawName(String.fromCharCode(code));

    //     }
    //     if(e.keyIdentifier=="Enter"){

    //         console.log(e.keyIdentifier);
    //     }
    // });

    // var i = 180;
    // // while(i<=180){
    // // }
    // var P = new Player('Vasia');
    // var x = Math.cos(deg*i)*n+450;
    // var y = Math.sin(deg*i)*n+100;

    // // ctx.fillRect(x,y,10,10)
    // i+=30;
    // P.x = x;
    // P.y = y;
    // console.log('x, y',x,y);
    // var D = new Deck();
    