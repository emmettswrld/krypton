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
        <img src="${track.thumb}" alt="${escapeHtml(track.title)}" loading="lazy">
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
    if (!query.trim()) {
        fetchHome();
        return;
    }
    cardGrid.className='card-grid';
    cardGrid.innerHTML='';
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
    npTitle.textContent=track.title;
    npThumb.src=track.thumb;
    npThumb.style.display='block';
    npDefaultIcon.style.display='none';
    npProgressFill.style.width='0%';
    npBar.classList.add('visible');
    npmCover.src=track.thumb;
    npmTrackTitle.textContent=track.title;
    npmTrackArtist.textContent=track.artist;
    npmProgressFill.style.width='0%';
    showNPView();
    loadLyrics(track);
    document.querySelectorAll('.music-card.playing').forEach((el)=>el.classList.remove('playing'));
    const el=document.querySelector(`.music-card[data-id="${track.id}"]`);
    if (el) el.classList.add('playing');
}

function updProgress() {
    if (!currentTrack||!currentTrack.duration) return;
    const pct=Math.min(100,(audioEl.currentTime/currentTrack.duration)*100);
    npmProgressFill.style.width=`${pct}%`;
    npProgressFill.style.width=`${pct}%`;
    updSyncedLyricsHighlight();
}

function setPlayButtonState(isPlaying) {
    const iconName=isPlaying?'pause':'play';
    npPlayBtn.innerHTML=`<i data-lucide="${iconName}"></i>`;
    npmPlayBtn.innerHTML=`<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();
}

const npBar=document.getElementById('npBar');
const npTitle=document.getElementById('npTitle');
const npPlayBtn=document.getElementById('npPlayBtn');
const npProgressFill=document.getElementById('npProgressFill');
const npThumb=document.getElementById('npThumb');
const npDefaultIcon=document.getElementById('npDefaultIcon');
const npmView=document.getElementById('npmView');
const npmCover=document.getElementById('npmCover');
const npmTrackTitle=document.getElementById('npmTrackTitle');
const npmTrackArtist=document.getElementById('npmTrackArtist');
const npmProgressFill=document.getElementById('npmProgressFill');
const npmPlayBtn=document.getElementById('npmPlayBtn');
const npmBackBtn=document.getElementById('npmBackBtn');
const lyricsBody=document.getElementById('lyricsBody');
const contentArea=document.getElementById('contentArea');
let syncedLyricsLines=null;

npPlayBtn.addEventListener('click',()=>{
    if (!audioEl||!currentTrack) return;
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
});

function renderSection(title,tracks) {
    const section=document.createElement('div');
    section.className='home-section';
    section.innerHTML=`<h2 class="section-title">${escapeHtml(title)}</h2>`;
    const grid=document.createElement('div');
    grid.className='card-grid';
    tracks.forEach(track=>grid.appendChild(renderCard(track)));
    section.appendChild(grid);
    return section;
}

function fetchHome() {
    if (currentEventSource) {
        currentEventSource.close();
        currentEventSource=null;
    }
    cardGrid.innerHTML='';
    cardGrid.className='home-sections';
    const url=`${API_BASE}/api/music/ytm/home?limit=10`;
    const es=new EventSource(url);
    currentEventSource=es;
    es.onmessage=(event)=>{
        if (event.data==='[DONE]') {
            es.close();
            currentEventSource=null;
            return;
        }
        try {
            const {section,tracks}=JSON.parse(event.data);
            cardGrid.appendChild(renderSection(section,tracks));
            lucide.createIcons();
        } catch (err) {
            console.error('failed to parse home section',err,event.data);
        }
    };
    es.onerror=()=>{
        es.close();
        currentEventSource=null;
    };
}

function showNPView() {
    contentArea.style.display='none';
    npmView.classList.add('visible');
}

function hideNPView() {
    npmView.classList.remove('visible');
    contentArea.style.display='';
}

npmBackBtn.addEventListener('click',hideNPView);

function parseLRC(lrcText) {
    const lines=lrcText.split('\n');
    const parsed=[];
    const timeTag=/\[(\d{2}):(\d{2}\.\d{2,3})\]/;
    for (const line of lines) {
        const match=line.match(timeTag);
        if (!match) continue;
        const minutes=parseInt(match[1],10);
        const seconds=parseFloat(match[2]);
        const time=minutes*60+seconds;
        const text=line.replace(timeTag,'').trim();
        if (text) parsed.push({time,text});
    }
    return parsed;
}

async function loadLyrics(track) {
    syncedLyricsLines=null;
    lyricsBody.innerHTML='<p class="lyrics-empty">Loading lyrics...</p>';
    try {
        const params=new URLSearchParams({
            track:track.title,
            artist:track.artist,
        });
        if (track.duration) params.set('duration',track.duration);
        const res=await fetch(`${API_BASE}/api/music/lyrics?${params.toString()}`);
        const data=await res.json();
        if (!data.found||(!data.plainLyrics&&!data.syncedLyrics)) {
            lyricsBody.innerHTML='<p class="lyrics-empty">No lyrics found for this song</p>';
            return;
        }
        if (data.syncedLyrics) {
            syncedLyricsLines=parseLRC(data.syncedLyrics);
            lyricsBody.innerHTML=syncedLyricsLines.map((line,i)=>`<div class="lyrics-line" data-index="${i}">${escapeHtml(line.text)}</div>`).join('');
        } else {
            lyricsBody.textContent=data.plainLyrics;
        }
    } catch (err) {
        console.error('failed to load lyrics ',err);
        lyricsBody.innerHTML='<p class="lyrics-empty">Couldn\'t load lyrics.</p>';
    }
}

function updSyncedLyricsHighlight() {
    if (!syncedLyricsLines||!audioEl) return;
    const t=audioEl.currentTime;
    let activeIndex=-1;
    for (let i=0;i<syncedLyricsLines.length;i++) {
        if (syncedLyricsLines[i].time<=t) activeIndex=i;
        else break;
    }
    document.querySelectorAll('.lyrics-line').forEach((el,i)=>{
        el.classList.toggle('active',i===activeIndex);
    });
    if (activeIndex>=0) {
        const activeEl=document.querySelector(`.lyrics-line[data-index="${activeIndex}"]`);
        activeEl?.scrollIntoView({behavior:'smooth',block:'center'});
    }
}

npmPlayBtn.addEventListener('click',()=>{
    if (!audioEl||!currentTrack) return;
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
});

fetchHome();