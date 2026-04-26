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

const engineBtn=document.getElementById('engine-btn');
const engineDropdown=document.getElementById('engine-dropdown');
const blurOverlay=document.getElementById('blur-overlay');
const engineOpts=document.querySelectorAll('.engine-opt');

const engineLabels={
    ddg:'DDG',
    google:'Google',
    bing:'Bing'
};

let selEngine='ddg';

blurOverlay.addEventListener('click',()=>{
    engineDropdown.classList.remove('open');
    blurOverlay.classList.remove('active');
});

engineOpts.forEach(opt=>{
    opt.addEventListener('click',()=>{
        engineOpts.forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
        selEngine=opt.dataset.engine;
        engineBtn.childNode[0].textContent=engineLabels[selEngine]+' ';
        engineDropdown.classList.remove('open');
        blurOverlay.classList.remove('active');
    });
});

engineBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    const open=engineDropdown.classList.toggle('open');
    blurOverlay.classList.toggle('active',open);
    const rect=engineBtn.getBoundingClientRect();
    engineDropdown.style.top=(rect.top-130)+'px';
    engineDropdown.style.left='auto';
    engineDropdown.style.right=(window.innerWidth-rect.right-15)+'px';
});

const searchBar=document.getElementById('search-bar');
const searchInput=searchBar.querySelector('input');

searchInput.addEventListener('focus',()=>{
    searchBar.classList.add('focused');
});

searchInput.addEventListener('blur',()=>{
    searchBar.classList.remove('focused');
});

function updateClock() {
    const now=new Date();
    const h=String(now.getHours()).padStart(2,'0');
    const m=String(now.getMinutes()).padStart(2,'0');
    const s=String(now.getSeconds()).padStart(2,'0');
    document.getElementById('clock-hrs').textContent=h;
    document.getElementById('clock-mins').textContent=m;
    document.getElementById('clock-secs').textContent=s;
}

updateClock();
setInterval(updateClock,1000);