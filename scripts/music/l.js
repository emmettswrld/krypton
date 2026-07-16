lucide.createIcons();

const API_BASE='';
const cardGrid=document.getElementById('cardGrid');
const searchInput=document.getElementById('searchInput');

let currentEventSource=null;
let debounceTimer=null;
let audioEl=null;
let currentPlayingId=null;
let currentTrack=null;

function escapeHtml(str) {
    const div=document.createElement('div');
    div.textContent=str??'';
    return div.innerHTML;
}

function renderCard(track) {
    const card=document.createElement('div');
    card.className='music-card';
    card.dataset.id=track.id;
    card.innerHTML=`
    <div class="card-art">
        <img src=${track.thumb}" alt="${escapeHtml(track.title)}" loading="lazy">
        <div class="card-play">
            <i data-lucide="play"></i>
        </div>
    </div>
    <div class="card-title" title="${escapeHtml(track.title)} - ${escapeHtml(track.artist)}">
        ${escapeHtml(track.title)}
    </div>`;
    card.querySelector('.card-play').addEventListener('click',(e)=>{
        e.stopPropagation();
        playTrack(track);
    });
    card.addEventListener('click',()=>playTrack(track));
    return card;
}

function searchVinyl(query) {
    if (currentEventSource) {
        currentEventSource.close();
        currentEventSource=null;
    }
    cardGrid.innerHTML='';
    if (!query.trim()) return;
    const url=`${API_BASE}/api/music/ytm/search?q=${encodeURIComponent(query)}&limit=20`;
    const es=new EventSource(url);
    currentEventSource=es;
    es.onmessage=(event)=>{
        if (event.data==='[DONE]') {
            es.close();
            currentEventSource=null;
            return;
        }
        try {
            const track=JSON.parse(event.data);
            cardGrid.appendChild(renderCard(track));
            lucide.createIcons();
        } catch (err) {
            console.error('failed to parse track',err,event.data);
        }
    };
    es.onerror=()=>{
        es.close();
        currentEventSource=null;
    };
}

searchInput.addEventListener('input',(e)=>{
    clearTimeout(debounceTimer);
    const q=e.target.value;
    debounceTimer=setTimeout(()=>searchVinyl(q),350);
});

function playTrack(track) {
    const url=`${API_BASE}/api/sp/audio/${track.id}`;
    if (!audioEl) {
        audioEl=new Audio();
        document.body.appendChild(audioEl);
        audioEl.addEventListener('timeupdate',updProgress);
        audioEl.addEventListener('play',()=>setPlayButtonState(true));
        audioEl.addEventListener('pause',()=>setPlayButtonState(false));
        audioEl.addEventListener('ended',()=>setPlayButtonState(false));
    }
    audioEl.pause();
    audioEl.src=url;
    audioEl.play().catch((err)=>console.error('playback failed',err));
    currentTrack=track;
    currentPlayingId=track.id;
    npThumb.src=track.thumb;
    npTitle.textContent=track.title;
    npArtist.textContent=track.artist;
    npProgressFill.style.width='0%';
    npBar.classList.add('visible');
    document.querySelectorAll('.music-card.playing').forEach((el)=>el.classList.remove('playing'));
    const el=document.querySelector(`music-card[data-id="${track.id}"]`);
    if (el) el.classList.add('playing');
}

function updProgress() {
    if (!currentTrack||!currentTrack.duration) return;
    const pct=Math.min(100,(audioEl.currentTime/currentTrack.duration)*100);
    npProgressFill.style.width=`${pct}%`;
}

function setPlayButtonState(isPlaying) {
    npPlayBtn.innerHTML=isPlaying?'<i data-lucide="pause"></i>':'<i data-lucide="play"></i>';
    lucide.createIcons();
}

const npBar=document.getElementById('npBar');
const npThumb=document.getElementById('npThumb');
const npTitle=document.getElementById('npTitle');
const npArtist=document.getElementById('npArtist');
const npPlayBtn=document.getElementById('npPlayBtn');
const npProgressFill=document.getElementById('npProgressFill');

npPlayBtn.addEventListener('click',()=>{
    if (!audioEl||!currentTrack) return;
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
});

lucide.createIcons();