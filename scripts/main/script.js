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
        index=(index+1)%strings.length;
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

//text caret
const searchEl=document.getElementById('search');
const oCaret=document.getElementById('ocaret');

let realX=0;
let currentX=0;
let animating=false;

function getCaretX() {
    const sel=window.getSelection();
    if (!sel||sel.rangeCount===0) return null;
    const range=sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect= range.getClientRects()[0];
    if (!rect) {
        const wrap=searchEl.getBoundingClientRect();
        return wrap.left+38;
    }
    return rect.left;
}

function updateCaret() {
    const x=getCaretX();
    if (x!==null) realX=x;
}

function lerp(a,b,t) { //lol larp rofl rofl
    return a + (b-a)*t;
}

function animateCaret() {
    if (!animating) return;
    currentX=lerp(currentX,realX,0.18);
    const wrapRect=searchEl.getBoundingClientRect();
    oCaret.style.left=(currentX-wrapRect.left)+'px';
    if (Math.abs(currentX-realX)>0.5) {
        requestAnimationFrame(animateCaret);
    }
}

searchEl.addEventListener('focus',()=>{
    oCaret.style.opacity='1';
    animating=true;
    updateCaret();
    currentX=realX;
    oCaret.style.left=(currentX-searchEl.getBoundingClientRect().left)+'px';
    animateCaret();
});

searchEl.addEventListener('blur',()=>{
    oCaret.style.opacity='0';
    animating=false;
});

searchEl.addEventListener('mouseup',()=>{
    updateCaret();
    currentX=realX;
});

searchEl.addEventListener('input',()=>{
    updateCaret();
    requestAnimationFrame(animateCaret);
});