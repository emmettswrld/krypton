//beautification
lucide.createIcons();

const refBtn=document.getElementById('refBtn');

document.getElementById('refBtn').addEventListener('click',()=>{
    const icon=refBtn.querySelector('svg');
    icon.classList.remove('spinning');
    void icon.offsetWidth;
    icon.classList.add('spinning');
    icon.addEventListener('animationend',()=>icon.classList.remove('spinning'),{once:true});
});

const tl='krypton';
const mText=document.getElementById('mainTl');
[...tl].forEach((char,i)=>{
    const span=document.createElement('span');
    span.className='main-char';
    span.textContent=char;
    span.style.animationDelay=`${i*0.06}s`;
    mText.appendChild(span);
});

const taglines=[
    'skdingindinfpodinfoingv',
    'wow.',
    'bradar what is this?',
    'you got games on yo phone'
];

const tagEl=document.getElementById('tagline');
let tagIdx=0;

function showTag() {
    const inner=document.createElement('span');
    inner.className='tagline-inner';
    inner.textContent=taglines[tagIdx];
    tagEl.innerHTML='';
    tagEl.appendChild(inner);
    requestAnimationFrame(()=>{
        requestAnimationFrame(()=>inner.classList.add('visible'));
    });
    tagIdx=(tagIdx+1)%taglines.length;
}

showTag();
setInterval(()=>{
    const inner=tagEl.querySelector('.tagline-inner');
    inner.classList.add('exit');
    inner.addEventListener('transitionend',showTag,{once:true});
},3000);

//scram
const connection = new BareMux.BareMuxConnection("/browse/baremux/worker.js");
connection.setTransport("/browse/libcurl/index.mjs",[{websocket:"wss://wisp.classroom.lat/"}]);

const {ScramjetController} = $scramjetLoadController();
const scramjet=new ScramjetController({
    files:{
        all:"/browse/scram/scramjet.all.js",
        wasm:"/browse/scram/scramjet.wasm.wasm",
        sync:"/browse/scram/scramjet.sync.js"
    },
    prefix:"/browse/go/"
});
scramjet.init();

function nav(input) {
    let url=input.trim();
    if (!url) return;
    const frame=document.getElementById('browserFrame');
    const home=document.querySelector('.main');
    if (!url.includes(" ")||url.includes(" ")) {
        url="https://duckduckgo.com/?q="+encodeURIComponent(url);
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url="https://"+url;
    }
    frame.style.display='block';
    home.style.display='none';
    frame.src=scramjet.encodeUrl(url);
    document.querySelector('.url-input').value=url;
    document.getElementById("browserFrame").src=scramjet.encodeUrl(url);
}

document.querySelector(".url-input").addEventListener("keydown",e=>{
    if (e.key==='Enter') nav(e.target.value);
});

document.querySelector(".main-search-input").addEventListener("keydown",e=>{
    if (e.key==='Enter') nav(e.target.value);
});