document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    var c = document.querySelector('#myCanvas');
    
    var self = this;
    if(!c){
        c = document.createElement('canvas');
        c.id = 'canvas';
        c.width = 900;
        c.height = 500;
        document.body.appendChild(c);
    }
    var ctx = c.getContext("2d");
    Canvas.init(c, ctx, 'classic-playing-cards.png');
    document.querySelector('form.player').addEventListener('submit', function (e) {
        e.preventDefault();
        // console.log('form' );
        document.querySelector('.start').style.display = 'none';
        document.querySelector('.game').classList.add('started');
        var player = new Player(this.querySelector('input').value);
        Canvas.drawTable();
        Game.start([player]);
    });

    
});