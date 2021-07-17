let particles = [];
class Particle{
  
  constructor()
  {
    this.x = 300;
    this.y = 300;
    this.vx = random(-1,1);
    this.vy = random(-5,-1);
    this.alpha = 255;
  }
  
  show()
  {
    noStroke();
    //stroke(255);
    fill(255,this.alpha);
    ellipse(this.x,this.y,16);
  }
  
  update()
  {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 3;
  }
  finished()
  {
      return this.alpha < 0;
  }
  
}

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);
  for (let i = 0; i<5; i++)
    {
      let p = new Particle();
      particles.push(p);
    }
  for (let i=particles.length -1;i >= 0; i--)
    {
      particles[i].update();
      particles[i].show();
      if (particles[i].finished())
        {
           particles.splice(i,1); 
        }
    }
}