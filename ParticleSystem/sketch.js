particles = [];

function setup() {
  createCanvas(400, 400);
  for(let i = 0; i< 5;i++)
    {
      particles[i] = new Particle(10+100*i,200,i+1);  
    }
}

function draw() {
  background(0);
  
  g = createVector(0,0.3);
  wind = createVector(0*random(-0.5,0.5),0);
  for(let i=0;i<5;i++)
    {
     particles[i].applyForce(g.mult(particles[i].mass));
     particles[i].applyForce(wind);
     particles[i].update(); 
     particles[i].show(); 
    }
}

class Particle
  {
    
    constructor(x,y,m)
    {
      this.loc  = createVector(x,y);
      this.vel  = createVector(0,0);
      this.accl = createVector(0,0);
      this.alpha = 255;
      this.mass = m;
    }
    
    update()
    {
      this.loc.add(this.vel);
      this.vel.add(this.accl);
      this.accl.mult(0);
      
      if(this.loc.x>width || this.loc.x<0)
        {
          this.vel.x = -1*this.vel.x;
        }
      if(this.loc.y>height || this.loc.y<0)
        {
          this.vel.y = -1*this.vel.y;
        }
    }
    applyForce(f)
    {
      f = f.div(this.mass);
      this.accl.add(f);      
    }
    
    show()
    {
      stroke(255);
      fill(100,this.alpha);
      ellipse(this.loc.x,this.loc.y,this.mass);
      
    }
    
  }