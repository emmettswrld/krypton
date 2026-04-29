//beautification
lucide.createIcons();

VANTA.FOG({
    el: '#home',
    baseColor: 0x111518,
    lowlightColor: 0x161c24,
    midtoneColor: 0x1e2d3d,
    highlightColor: 0x2e4a6a,
    speed: 0.8,
    zoom: 0.1,
});

//functionality
//event handling for navbar
document.getElementById('navbar').addEventListener('click',e=>{
    const btn=e.target.closest('.nb-btn');
    if (!btn) return;
    document.querySelectorAll('.nb-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
});

document.querySelectorAll('.nb-btn').forEach(btn=>{
    btn.addEventListener('mousedown',()=>btn.classList.add('pressing'));
    btn.addEventListener('mouseup',()=>btn.classList.remove('pressing'));
    btn.addEventListener('mouseleave',()=>btn.classList.remove('pressing'));
});

//tagline carousel thing
const strings=[
    'skidnginsng',
    'adoitnvportuinworeiutnpcoewiurvtnpwe',
    'idk'
];

let index=0;
const el=document.querySelector('.tagline');

function nextP(){
    el.classList.add('slide-out');
    setTimeout(()=>{
        index=(index+1)&strings.length;
        el.textContent=strings[index];
        el.classList.remove('slide-out');
        el.classList.add('slide-in');
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                el.classList.remove('slide-in');
            });
        });
    },400);
}

el.textContent=strings[0];
setInterval(nextP,3000);