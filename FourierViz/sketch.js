let time = {t:[]};
let canvas2;
let wave = [];
let path = [];
let signal_x = [];
let signal_y = [];
let slider;
let fourierY = [];
let fourierX = [];
let angle = 0;
let font;
let words = ["*Happy*", "*B'Day*", "*Chunmun*"];
let points = [];
let done = 0;


function preload() {
  font = loadFont('glitter.ttf');
}

function setup() {
  createCanvas(1000, 800);
  canvas2 = createGraphics(1000,800);
  canvas2.clear();
  
  textFont(font);
  textSize(128);
  fill(255);
  noStroke();
  //text('train',100,200);
  for (let i = 0; i < words.length; i++) {
    points[i] = font.textToPoints(words[i], 100, 200, 200);
    time.t[i] = 0;
  }

  for (let i = 0; i < points.length; i++) {
    //angle = map(i,0,200,0,TWO_PI)
    signal_x[i] = [];
    signal_y[i] = [];
    for (let j = 0; j < points[i].length; j++) {
      signal_x[i][j] = points[i][j].x;
      signal_y[i][j] = points[i][j].y;
    }
  }
  
  for (let i = 0; i < signal_x.length; i++) {
    fourierX[i] = dft(signal_x[i]);
    fourierY[i] = dft(signal_y[i]);
    //console.log(fourierY);
    //slider = createSlider(1, 10, 1);
    fourierX[i].sort((a, b) => b.amp - a.amp);
    fourierY[i].sort((a, b) => b.amp - a.amp);
  }
  
}

function draw() {
  
  if(done<3)
  {
    background(0);
    image(canvas2,0,0);
    //translate(-100, 200);
    //text('*Happy*Birthday*',100,200);
    //translate(100, 200);
    //points = font.textToPoints('Trainx', 100, 200);


     let x0 = -100;
     let y0 = 200;
     let x1 = 600;
     let y1 = 20;

     Anim(x0,y0+180*done,x1,y1+180*done,done,time);  
  }
  else
  {
    background(0);
    image(canvas2,0,0);
  }
   
}

function Anim(x0,y0,x1,y1,idx,time) {
  
  vx = epicycle(x0, y0, 0, fourierX[idx],idx);
  vy = epicycle(x1, y1-50, HALF_PI, fourierY[idx],idx);
  v = createVector(vx.x, vy.y)
  path.unshift(v);
  //wave.unshift(y);
  //translate(200, 0);
  stroke(200);
  line(vx.x, vx.y, v.x, v.y);
  line(vy.x, vy.y, v.x, v.y);
  canvas2.beginShape();
  canvas2.noFill();
  
  let r =random(0, 255);
  
  for (let i = 0; i < path.length; i++) {
    canvas2.stroke(random(0, 255), random(0, 255), random(0, 255));
    canvas2.ellipse(path[i].x, path[i].y, 1);
  }
  canvas2.endShape();

  dt = TWO_PI / fourierY[idx].length;
  time.t[idx] += dt;
  if(time.t[idx] > TWO_PI)
  {
    done++;
  }

  beginShape();
  for (let i = 0; i < points[idx].length; i++) {
    let p = points[idx][i];
    stroke(200, 0, 0);
    //ellipse(p.x,p.y,2);
  }
  endShape(CLOSE);



}


function epicycle(x, y, rotation, fourier,idx) {
  for (let i = 0; i < fourier.length; i++) {


    let prevX = x;
    let prevY = y;

    let n = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase + rotation;

    stroke(random(0, 255), random(0, 255), random(0, 255), 40);
    noFill();
    ellipse(prevX, prevY, radius * 2);

    x += radius * cos(n * time.t[idx] + phase);
    y += radius * sin(n * time.t[idx] + phase);

    stroke(random(0, 255), random(0, 255), random(0, 255), 100);
    strokeWeight(3);
    fill(100);
    line(prevX, prevY, x, y);
    ellipse(x, y, 1);
  }
  return createVector(x, y);
}


function dft(x) {

  let X = [];
  const N = x.length;

  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * PI * n * k) / N;
      re += x[n] * cos(phi);
      im -= x[n] * sin(phi);
    }
    re = re / N;
    im = im / N;

    let freq = k;
    let amp = sqrt(re * re + im * im);
    let phase = atan2(im, re);
    //console.log(im,re,phase);

    X[k] = {
      re,
      im,
      freq,
      amp,
      phase
    };
  }

  return X;
}