function maze(x,y) {
	var n=x*y-1;
	if (n<0) {alert("illegal maze dimensions");return;}
	var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
	    verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
	    here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
	    path = [here],
	    unvisited = [];
	for (var j = 0; j<x+2; j++) {
		unvisited[j] = [];
		for (var k= 0; k<y+1; k++)
			unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
	}
	while (0<n) {
		var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
		    [here[0]-1, here[1]], [here[0],here[1]-1]];
		var neighbors = [];
		for (var j = 0; j < 4; j++)
			if (unvisited[potential[j][0]+1][potential[j][1]+1])
				neighbors.push(potential[j]);
		if (neighbors.length) {
			n = n-1;
			next= neighbors[Math.floor(Math.random()*neighbors.length)];
			unvisited[next[0]+1][next[1]+1]= false;
			if (next[0] == here[0])
				horiz[next[0]][(next[1]+here[1]-1)/2]= true;
			else 
				verti[(next[0]+here[0]-1)/2][next[1]]= true;
			path.push(here = next);
		} else 
			here = path.pop();
	}
	return {x: x, y: y, horiz: horiz, verti: verti};
}
function display(m) {
	var text = [];
	for (var j= 0; j<m.x*2+1; j++) {
		var line= [];
		if (0 == j%2)
			for (var k=0; k<m.y*4+1; k++)
				if (0 == k%4) 
					line[k]= '+';
				else
					if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
						line[k]= ' ';
					else
						line[k]= '-';
		else
			for (var k=0; k<m.y*4+1; k++)
				if (0 == k%4)
					if (k>0 && m.horiz[(j-1)/2][k/4-1])
						line[k]= ' ';
					else
						line[k]= '|';
				else
					line[k]= ' ';
		if (0 == j) line[1]= line[2]= line[3]= ' ';
		if (m.x*2-1 == j) line[4*m.y]= ' ';
		text.push(line.join(''));
	}
	return text;
}

var Context = {
    canvas : null,
    context : null,
    create: function(canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = this.canvas.getContext('2d');
        return this.context;
    }
};

var Sprite = function(filename, is_pattern) {
  
    // Construct
    this.image = null;
    this.pattern = null;
    this.TO_RADIANS = Math.PI/180;
    
    if (filename != undefined && filename != "" && filename != null)
    {
        this.image = new Image();
        this.image.src = filename;
        this.image.onload = function(e) {
            console.log("img loaded"); 
        }
        
        if (is_pattern)
            this.pattern = Context.context.createPattern(this.image, 'repeat');
    }
    else
        console.log("Unable to load sprite.");
    
    this.draw = function(x, y, w, h)
    {
        
        
        
        // Pattern?
        if (this.pattern)
        {
            console.log("pattern!");
            Context.context.fillStyle = this.pattern;
            Context.context.fillRect(x, y, w, h);
        
        } else {
         
            // Image
            if (!w)
            {
               Context.context.drawImage(this.image, x, y,
                                         this.image.width,
                                         this.image.height);
            } else {
                
                // Stretched
                Context.context.drawImage(this.image, x, y, w, h);
  
            }            
        }
    };
    
    this.rotate = function(x, y, w, h, angle)
    {
        Context.context.save();
        
        Context.context.translate(x, y);
        Context.context.rotate(angle * this.TO_RADIANS);
        
        if(!w) {
			Context.context.drawImage(this.image,
                                -(this.image.width/2),
                                -(this.image.height/2));
        
        } else {
			Context.context.drawImage(this.image,
                                -(this.image.width/2),
                                -(this.image.height/2),
								w, h);
		}
		Context.context.restore();
    };
        
    
};

window.onload = function() {

    // Initialize Canvas
    Context.create("canvas");
	mazeOnCanvas(4, 4);
    
    
}
var PATH = "background.png";
    var WALL1 = "wall2.png";   
	var PATHIMG = new Image();
	PATHIMG.src=PATH;
	var WALL1IMG = new Image();
	WALL1IMG.src=WALL1;

function mazeOnCanvas(a, b) {
	var t = display(maze(a, b));
	var i, j;
	var	xCd = 150;
	var yCd = 150;
	var p = t;
	alert(p.join('\n'));
	var backImage = new Sprite(PATH, false);
	var normalWall = new Sprite(WALL1, false);
	for(i = 1; i<t.length; i+=2) {
		for(j = 0; j<t[i].length; j++) {
			if(t[i][j] == ' ') {
				backImage.draw(xCd, yCd, 0, 0);
				xCd+=PATHIMG.width;
				j+=2;
			}
			else if(t[i][j] == '|') {
				if(j!=t[i].length - 1) {
					normalWall.rotate(xCd, yCd, WALL1IMG.width, PATHIMG.height, 270.0);
					xCd+=WALL1IMG.width;
				}
				if(j != 0) {
					normalWall.rotate(xCd, yCd, WALL1IMG.width, PATHIMG.height, 90.0);
					xCd+=WALL1IMG.width;
				}
			}
		}
		yCd+=PATHIMG.height;
	}
}








