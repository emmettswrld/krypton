lucide.createIcons();

VANTA.FOG({
    el: "#bg",
    highlightColor: 0x1a2d4a,
    midtoneColor: 0x0f1a2e,
    lowlightColor: 0x080d18,
    baseColor: 0x050810,
    blurFactor: 0.9,
    zoom: 0.6,
    speed: 1.2
});

const taglines=[
    'you got games on yo phone',
    'pringprintpevirnptsoirupcnotupenorivt',
    'synthetically produced',
]

const tagline=document.getElementById('tagline');

taglines.forEach((text,i)=>{
    const span=document.createElement('span');
    span.textContent=text;
    if (i===0) span.classList.add('active');
    tagline.appendChild(span);
});

let current=0;
const spans=tagline.querySelectorAll('span');

setInterval(()=>{
    spans[current].classList.remove('active');
    spans[current].classList.add('exit');
    const prev=current;
    current=(current+1)%spans.length;
    spans[current].classList.add('active');
    setTimeout(()=>spans[prev].classList.remove('exit'),500);
},3000);