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

function renderMessage(message) {
    const isMine=message.username===myUser;
    const row=document.createElement('div');
    row.className='msg-row';
    row.innerHTML=`
    <div class="msg-author">${escapeHtml(message.username)}${isMine?' (you)':''}</div>
    <div class="msg-text">${escapeHtml(message.text)}</div>`;
    contentArea.appendChild(row);
    contentArea.scrollTop=contentArea.scrollHeight;
}

function escapeHtml(str) {
    const div=document.createElement('div');
    div.textContent=str;
    return div.innerHTML;
}

async function loadHistory(channel) {
    contentArea.innerHTML='';
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