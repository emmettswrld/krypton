import { requireAuth,getAuthToken,clearAuth,redirect } from "../auth/guard.js";
lucide.createIcons();

const contentArea=document.getElementById('contentArea');
const messageInput=document.getElementById('messageInput');
const sendBtn=document.getElementById('sendBtn');
const activeChannelName=document.getElementById('activeChannelName');
const sidebarScroll=document.getElementById('sidebarScroll');

let ws=null;
let currentChannel='general';
let myUser=null;
let lastMsgUsername=null;
let lastMsgTimestamp=null;

const AVATAR_COLOURS=['#ef4444','#3b82f6','#eab308','#22c55e','#a855f7','#f97316','#ec4899','#14b8a6','#6366f1','#f43f5e'];
const GROUP_WINDOW_MS=2*60*1000

function hashString(str) {
    let hash=0;
    for (let i=0;i<str.length;i++) {
        hash=(hash*31+str.charCodeAt(i))>>>0;
    }
    return hash;
}

function getAvatarColour(username) {
    return AVATAR_COLOURS[hashString(username)%AVATAR_COLOURS.length];
}

function getIconColour(hex) {
    const r=parseInt(hex.slice(1,3),16);
    const g=parseInt(hex.slice(3,5),16);
    const b=parseInt(hex.slice(5,7),16);
    const luminance=0.299*r+0.587*g+0.114*b;
    return luminance>150?'#000':'#fff';
}

function renderMessage(message) {
    const isMine=message.username===myUser;
    const now=new Date(message.createdAt).getTime();
    const withinWindow=lastMsgTimestamp!==null&&(now-lastMsgTimestamp)<GROUP_WINDOW_MS;
    const isGrouped=message.username===lastMsgUsername&&withinWindow;
    lastMsgUsername=message.username;
    lastMsgTimestamp=now;
    const row=document.createElement('div');
    row.className=isGrouped?'msg-row grouped':'msg-row';
    if (isGrouped) {
        row.innerHTML=`
        <div class="msg-avatar-spacer"></div>
        <div class="msg-body">
            <div class="msg-text">${escapeHtml(message.text)}</div>
        </div>`;
    } else {
        const colour=getAvatarColour(message.username);
        const iconColour=getIconColour(colour);
        row.innerHTML=`
        <div class="msg-avatar" style="background:${colour}">
            <i data-lucide="user" style="color:${iconColour}"></i>
        </div>
        <div class="msg-body">
            <div class="msg-author">${escapeHtml(message.username)}${isMine?' (you)':''}<span class="msg-time">${formatTime(message.createdAt)}</span></div>
            <div class="msg-text">${escapeHtml(message.text)}</div>
        </div>`;
    }
    contentArea.appendChild(row);
    contentArea.scrollTop=contentArea.scrollHeight;
    lucide.createIcons();
}

function escapeHtml(str) {
    const div=document.createElement('div');
    div.textContent=str;
    return div.innerHTML;
}

function formatTime(iso) {
    const d=new Date(iso);
    return d.toLocaleDateString([],{hour:'numeric',minute:'2-digit'});
}

async function loadHistory(channel) {
    contentArea.innerHTML='';
    lastMsgUsername=null;
    lastMsgTimestamp=null;
    const token=getAuthToken();
    const res=await fetch(`/api/chat/messages/${channel}`,{
        headers:{'Authorization':`Bearer ${token}`}
    });
    if (!res.ok) return;
    const data=await res.json();
    data.messages.forEach(renderMessage);
}

function connectWs() {
    const token=getAuthToken();
    const protocol=location.protocol==='https:'?'wss:':'ws:';
    ws=new WebSocket(`${protocol}//${location.host}/api/chat/ws?token=${encodeURIComponent(token)}`);
    ws.addEventListener('open',()=>{
        ws.send(JSON.stringify({type:'join',channel:currentChannel}));
    });
    ws.addEventListener('message',(event)=>{
        const data=JSON.parse(event.data);
        if (data.type==='message'&&data.channel===currentChannel) {
            renderMessage(data.message);
        } else if (data.type==='error') {
            console.error('chat error',data.error);
        }
    });
    ws.addEventListener('close',()=>{
        setTimeout(connectWs,2000);
    });
}

async function switchChannel(channel) {
    currentChannel=channel;
    activeChannelName.textContent=channel;
    messageInput.placeholder=`Message #${channel}`;
    document.querySelectorAll('.channel-item').forEach(i=>{{
        i.classList.toggle('active',i.dataset.channel===channel);
    }});
    await loadHistory(channel);
    if (ws&&ws.readyState===WebSocket.OPEN) {
        ws.send(JSON.stringify({type:'join',channel}));
    }
}

function sendMessage() {
    const text=messageInput.value.trim();
    if (!text||!ws||ws.readyState!==WebSocket.OPEN) return;
    ws.send(JSON.stringify({type:'message',text}));
    messageInput.value='';
}

async function loadChannels() {
    const token=getAuthToken();
    const res=await fetch('/api/chat/channels',{
        headers:{'Authorization':`Bearer ${token}`}
    });
    if (!res.ok) return [];
    const data=await res.json();
    return data.channels;
}

function buildSidebar(channels) {
    const categories=new Map();
    channels.forEach((ch)=>{
        if (!categories.has(ch.category)) categories.set(ch.category,[]);
        categories.get(ch.category).push(ch);
    });
    sidebarScroll.innerHTML='';
    let first=true;
    for (const [categoryName,items] of categories) {
        if (!first) {
            const divider=document.createElement('div');
            divider.className='divider';
            sidebarScroll.appendChild(divider);
        }
        first=false;
        const category=document.createElement('div');
        category.className='category';
        const catLabel=document.createElement('div');
        catLabel.className='cat-label';
        catLabel.dataset.category=categoryName;
        catLabel.innerHTML=`<i data-lucide="chevron-down"></i><span>${escapeHtml(categoryName)}</span>`;
        const channelList=document.createElement('div');
        channelList.className='channel-list';
        items.forEach((ch)=>{
            const item=document.createElement('div');
            item.className='channel-item';
            item.dataset.channel=ch.id;
            item.innerHTML=`<i data-lucide="hash"></i><span>${escapeHtml(ch.name)}</span>`;
            item.addEventListener('click',()=>switchChannel(ch.id));
            channelList.appendChild(item);
        });
        catLabel.addEventListener('click',()=>{
            catLabel.classList.toggle('collapsed');
            channelList.classList.toggle('collapsed');
        });
        category.appendChild(catLabel);
        category.appendChild(channelList);
        sidebarScroll.appendChild(category);
    }
    lucide.createIcons();
}

sendBtn.addEventListener('click',sendMessage);
messageInput.addEventListener('keydown',(e)=>{
    if (e.key==='Enter') sendMessage();
});

requireAuth().then(async(username)=>{
    if (!username) return;
    myUser=username;
    const channels=await loadChannels();
    buildSidebar(channels);
    const defaultChannel=channels[0]?.id||'general';
    connectWs();
    switchChannel(defaultChannel);
});