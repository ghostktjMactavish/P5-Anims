const flocks=[];

let w = 800;
let h = 600;
let slidex = 160;
let alignSlider, cohesionSlider, separationSlider, perceptionSlider, maxSpeedSlider, maxForceSlider;
let perception = 50;
let maxForce = 0.2 ;
let maxSpeed = 1;
class Boid
  {
    constructor()
    {
      this.position = createVector(random(width),random(height));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(random(1.5,2.5));
      this.accl = createVector();
      //this.maxForce = 0.2;
      //this.maxSpeed = 1;
      this.color = [random(0,255),random(0,255),random(0,255)];
    }
    
    align(boids)
    {
      //let perception = 50;
      let steering = createVector();
      let cohesion = createVector();
      let separation = createVector();
      let avr = 0;
      let avg = 0;
      let avb = 0;
      let total = 0;
      for (let other of boids)
        {
          let d = dist(this.position.x,this.position.y,other.position.x,other.position.y);
          if(d < perception && other !=this )
          {
            let diff = p5.Vector.sub(this.position,other.position);
            diff.div(d);
            steering.add(other.velocity);
            cohesion.add(other.position);
            separation.add(diff);
            avr+= other.color[0];
            avg+= other.color[1];
            avb+= other.color[2];
            total++;
          }
        }
      if(total > 0)
        {
          separation.div(total);
       separation.setMag(maxSpeed);
          separation.sub(this.velocity);
          separation.limit(maxForce);
          
          cohesion.div(total);
          cohesion.sub(this.position);
          cohesion.setMag(maxSpeed);
          cohesion.sub(this.velocity);
          cohesion.limit(maxForce);
          
          steering.div(total);
          steering.setMag(maxSpeed);
          steering.sub(this.velocity);
          steering.limit(maxForce);
          
          avr = avr/total;
          avg = avg/total;
          avb = avb/total;
        }
        let vals = [steering,cohesion,separation,avr,avg,avb];
        return vals;
    }
    
    flock(boids)
    {
      let vals = this.align(boids);
      
      let steering = vals[0];
      let cohesion = vals[1];
      let separation = vals[2];
      
      separation.mult(separationSlider.value());
      steering.mult(alignSlider.value());
      cohesion.mult(cohesionSlider.value());
      this.accl.add(steering);
     this.accl.add(cohesion);
      this.accl.add(separation);
      this.color[0] = vals[3] > 140 ? vals[3] : random(255);
      this.color[1] = vals[4] > 100 ? vals[4] : random(255);
      this.color[2] = vals[5] > 100 ? vals[5] : random(255);
    }
    
    edges()
    {
      if (this.position.x > width)
        this.position.x = 0;
      else if (this.position.x < 0)
        this.position.x = width;
      
      if (this.position.y > height)
        this.position.y = 0;
      else if (this.position.y < 0)
        this.position.y = height;
    }
    
    show()
    {
      stroke(this.color[0],this.color[1],this.color[2]);
      strokeWeight(8);
      //stroke(255);
      ellipse(this.position.x,this.position.y,8);
    }
    
    update()
    {
       this.position.add(this.velocity);
       this.velocity.add(this.accl);
       this.velocity.limit(this.maxSpeed);
      this.accl.mult(0);
    }

  }


function setup() {
  
  createCanvas(w, h);
  buttonA = createButton("Align");
  buttonA.position(slidex-140,h+20)
  buttonC = createButton("Cohesion");
  buttonC.position(slidex-140,h+40)
  buttonS = createButton("Separation");
  buttonS.position(slidex-140,h+60)
  buttonP = createButton("Perception Radius");
  buttonP.position(slidex-140,h+80)
  buttonSpeed = createButton("MaxSpeed");
  buttonSpeed.position(slidex-140,h+100)
  buttonForce = createButton("MaxForce");
  buttonForce.position(slidex-140,h+120)
  alignSlider = createSlider(0,5,1,0.1);
  alignSlider.position(slidex,h+20);
  cohesionSlider = createSlider(0,5,1,0.1);
  cohesionSlider.position(slidex,h+40);
  separationSlider = createSlider(0,5,1,0.1);
  separationSlider.position(slidex,h+60);
  perceptionSlider = createSlider(10,100,60);
  perceptionSlider.position(slidex,h+80);
  maxSpeedSlider = createSlider(0.1,5,1,0.1);
  maxSpeedSlider.position(slidex,h+100);
  maxForceSlider = createSlider(0.1,1,0.2,0.1);
  maxForceSlider.position(slidex,h+120);
  for(i=0;i<100;i++)
  {
    flocks.push(new Boid());
  }
}

function draw() {
  background(0);
  perception = perceptionSlider.value();
  maxSpeed = maxSpeedSlider.value();
  maxForce = maxForceSlider.value();
  //stroke(random(0,255),random(0,255),random(0,255));
  for(let boid of flocks)
    {
      boid.edges();
      boid.flock(flocks);
      boid.update();
      boid.show();
      //print(boid.color);
    }
  
}