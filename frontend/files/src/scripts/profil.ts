import { constrainedMemory } from 'process';
import { loadnhistory } from './app.js';

let friendsBtn: NodeListOf<HTMLButtonElement> | null = null;
let historyBtn: NodeListOf<HTMLButtonElement> | null = null;
let friendsList: NodeListOf<HTMLElement> | null = null;
let historyList: NodeListOf<HTMLElement> | null = null;


// export async function setupProfilPage() {
//     try {
//         const playerName = await fetchPlayerName();
//         const iPlayerName = document.getElementById('iPlayerName') as HTMLSpanElement | null;

//         if (iPlayerName) {
//             iPlayerName.textContent = playerName;
//         }
//     } catch (error) {
//         console.error("Failed to fetch Player's name: ", error);
//     }
// };

// async function fetchPlayerName() {
//     try {
//         const response = await fetch('http://10.11.2.4:3000/profile', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include'
//         });

//         console.log("response:", response);
//         if (!response.ok) {
//             throw new Error("Failed to fetch the player's Data");
//         }
//         const data = await response.json();

//         return data.name || 'Player';
//     } catch (error) {
//         console.error("Failed to fetch the player's name: ", error);
//         return 'Player';
//     }
// };

export function setupProfilButtons() {
    try {
        const homeBtn = document.querySelector('.home-btn') as HTMLButtonElement | null;
        const notifsBtn = document.getElementById('notifsBtn') as HTMLButtonElement | null;
        const notifsPanel = document.getElementById('notifsPanel') as HTMLElement | null;
        const notifs = document.getElementById('notifs') as HTMLElement | null;
        const notifsAccRejBtn = document.getElementById('notifsAccRejBtn') as HTMLButtonElement | null;
        const settingsBtn = document.querySelector('.settings-btn') as HTMLButtonElement | null;
        const addNewFriendShowBtn = document.getElementById('addNewFriendShowBtn') as HTMLButtonElement | null;
        const addNewFriendCloseBtn = document.getElementById('addNewFriendCloseBtn') as HTMLButtonElement | null;
        const messagesBtn = document.getElementById('messagesBtn') as HTMLButtonElement | null;
        const sidePanel = document.getElementById('sidePanel') as HTMLElement | null;
        const openSidePanelBtn = document.getElementById('openSidePanelBtn') as HTMLButtonElement | null;
        const closeSidePanelBtn = document.getElementById('closeSidePanelBtn') as HTMLButtonElement | null;
        friendsBtn = document.querySelectorAll('.friends-btn') as NodeListOf<HTMLButtonElement> | null;
        historyBtn = document.querySelectorAll('.history-btn') as NodeListOf<HTMLButtonElement> | null;
        friendsList = document.querySelectorAll('.friends-list') as NodeListOf<HTMLElement> | null;
        historyList = document.querySelectorAll('.history-list') as NodeListOf<HTMLElement> | null;
        const localBtn = document.getElementById('local-btn') as HTMLButtonElement | null;
        const onlineBtn = document.getElementById('online-btn') as HTMLButtonElement | null;
        const playWFriendsBtn = document.getElementById('playWFriendsBtn') as HTMLButtonElement | null;
        const tournTitle = document.getElementById('tournTitle') as HTMLElement | null;
        const createTournPageBtn = document.getElementById('createTournPageBtn') as HTMLButtonElement | null;
        const hostTournPageBtn = document.getElementById('hostTournPageBtn') as HTMLButtonElement | null;
		
		
		const palySolo = document.getElementById('playSolo') as HTMLButtonElement;
		const play1 = document.getElementById('paly_1vs1') as HTMLButtonElement;
        const play2 = document.getElementById('paly_2vs2') as HTMLButtonElement;

		palySolo.addEventListener("click", () => {
			loadnhistory('game_ai');
		});
        play1.addEventListener("click", () => {
            loadnhistory('game_local');
        });
        play2.addEventListener("click", () => {
            loadnhistory('game_multi');
        });
		

        // Add event listeners only if elements exist
        homeBtn?.addEventListener('click', () => loadnhistory('home'));
        if (notifsBtn && notifsPanel) {
            notifsBtn.addEventListener('click', (event) => showNotifications(event, notifsPanel));
        }
        if (notifsAccRejBtn && notifs) {
            notifsAccRejBtn.addEventListener('click', (event) => showNotifsAccRej(event, notifs, notifsAccRejBtn));
        }
        settingsBtn?.addEventListener('click', () => loadnhistory('settings'));
        if (addNewFriendShowBtn && sidePanel) {
            addNewFriendShowBtn.addEventListener('click', () => showAddNewFriendPopup(sidePanel));
        }
        if (addNewFriendCloseBtn && sidePanel) {
            addNewFriendCloseBtn.addEventListener('click', () => closeAddNewFriendPopup(sidePanel));
        }
        messagesBtn?.addEventListener('click', () => loadnhistory('messages'));
        if (openSidePanelBtn && sidePanel) {
            openSidePanelBtn.addEventListener('click', (event) => openSidePanel(event, sidePanel));
        }
        if (closeSidePanelBtn && sidePanel) {
            closeSidePanelBtn.addEventListener('click', (event) => closeSidePanel(event, sidePanel));
        }
        if (sidePanel) {
            document.addEventListener('click', (event) => panelOutsideClick(event, sidePanel));
        }

        friendsBtn?.forEach((element) => {
            element.addEventListener('click', showFriendsList);
        });

        historyBtn?.forEach((element) => {
            element.addEventListener('click', showHistoryList);
        });

        if (localBtn && onlineBtn && tournTitle && createTournPageBtn && hostTournPageBtn) {
            localBtn.addEventListener('click', () => selectLocal(localBtn, onlineBtn, tournTitle, createTournPageBtn, hostTournPageBtn, palySolo, play1, play2));
            onlineBtn.addEventListener('click', () => selectOnline(localBtn, onlineBtn, tournTitle, createTournPageBtn, hostTournPageBtn, palySolo, play1, play2));
        }
        createTournPageBtn?.addEventListener('click', () => loadnhistory('createtourn'));
        hostTournPageBtn?.addEventListener('click', () => loadnhistory('hosttourn'));
        // playWFriendsBtn?.addEventListener('click', () => loadnhistory('localgame'));
    } catch (error) {
        console.error("Error setting up profile buttons:", error);
    }
};

function showNotifications(event: Event | null, notifsPanel: HTMLElement | null) {
    if (!event || !notifsPanel) return;
    
    event.stopPropagation();

    if (notifsPanel.classList.contains('hidden')) {
        notifsPanel.classList.remove('hidden');
        notifsPanel.classList.add('flex');
        document.addEventListener('click', (event) => notifsOutsideClick(event, notifsPanel));
        document.addEventListener('scroll', (event) => {
            if (!notifsPanel.contains(event.target as Node)) {
                notifsPanel.classList.remove('flex');
                notifsPanel.classList.add('hidden');
            }
        });
    } else {
        notifsPanel.classList.remove('flex');
        notifsPanel.classList.add('hidden');
    }
};

function notifsOutsideClick(event: Event | null, notifsPanel: HTMLElement | null) {
    if (!event || !notifsPanel) return;
    
    event.stopPropagation();
    if (!notifsPanel.contains(event.target as Node)) {
        notifsPanel.classList.remove('flex');
        notifsPanel.classList.add('hidden');
    }
};

function showNotifsAccRej(event: Event | null, notifs: HTMLElement | null, notifsAccRejBtn: HTMLButtonElement | null) {
    if (!event || !notifs || !notifsAccRejBtn) return;
    
    event.stopPropagation();
    const notifsaccRejBox = document.getElementById('notifsaccRejBox') as HTMLElement | null;
    const notifsText = document.getElementById('notifsText') as HTMLParagraphElement | null;

    if (!notifsaccRejBox || !notifsText) return;

    if (notifsaccRejBox.classList.contains('translate-x-full')) {
        notifsaccRejBox.classList.remove('translate-x-full', 'opacity-0');
        notifsText.classList.add('opacity-0');
        notifsAccRejBtn.classList.add('rotate-180');
        notifs.addEventListener('scroll', () => {
            notifsaccRejBox.classList.add('translate-x-full', 'opacity-0');
            notifsText.classList.remove('opacity-0');
            notifsAccRejBtn.classList.remove('rotate-180');
        });
    } else {
        notifsaccRejBox.classList.add('translate-x-full', 'opacity-0');
        notifsText.classList.remove('opacity-0');
        notifsAccRejBtn.classList.remove('rotate-180');
    }
};

function showAddNewFriendPopup(sidePanel: HTMLElement | null) {
    if (!sidePanel) return;
    
    const toBlur = document.getElementById('toBlur') as HTMLElement | null;
    const toPop = document.getElementById('toPop') as HTMLElement | null;

    if (!toBlur || !toPop) return;

    toBlur.inert = true;
    toBlur.classList.add('blur-sm');
    toPop.classList.remove('hidden');
    toPop.classList.add('flex');
    sidePanel.classList.remove('block');
    sidePanel.classList.add('hidden');
};

function closeAddNewFriendPopup(sidePanel: HTMLElement | null) {
    if (!sidePanel) return;
    
    const toBlur = document.getElementById('toBlur') as HTMLElement | null;
    const toPop = document.getElementById('toPop') as HTMLElement | null;

    if (!toBlur || !toPop) return;

    toBlur.inert = false;
    toBlur.classList.remove('blur-sm');
    toPop.classList.add('hidden');
    toPop.classList.remove('flex');
    sidePanel.classList.add('block');
    sidePanel.classList.remove('hidden');
}

function selectLocal(
    localBtn: HTMLButtonElement | null,
    onlineBtn: HTMLButtonElement | null,
    tournTitle: HTMLElement | null,
    createTournPageBtn: HTMLButtonElement | null,
    hostTournPageBtn: HTMLButtonElement | null,
    palySolo: HTMLButtonElement | null,
    play1: HTMLButtonElement | null,
    play2: HTMLButtonElement | null
) {
    localBtn?.classList.add('bg-gray-600');
    localBtn?.classList.remove('hover:bg-gray-500');
    onlineBtn?.classList.add('hover:bg-gray-500');
    onlineBtn?.classList.remove('bg-gray-600');
    tournTitle?.classList.add('opacity-30');
    if (createTournPageBtn) createTournPageBtn.inert = true;
    if (hostTournPageBtn) hostTournPageBtn.inert = true;
    if (palySolo) palySolo.inert = false;
    if (play1) play1.inert = false;
    if (play2) play2.inert = false;
    // createTournPageBtn?.classList.add('opacity-30');
    hostTournPageBtn?.classList.add('opacity-30');
    palySolo?.classList.remove('opacity-30');
    play1?.classList.remove('opacity-30');
    play2?.classList.remove('opacity-30');

};

function selectOnline(
    localBtn: HTMLButtonElement | null,
    onlineBtn: HTMLButtonElement | null,
    tournTitle: HTMLElement | null,
    createTournPageBtn: HTMLButtonElement | null,
    hostTournPageBtn: HTMLButtonElement | null,
    palySolo: HTMLButtonElement | null,
    play1: HTMLButtonElement | null,
    play2: HTMLButtonElement | null
) {
    onlineBtn?.classList.add('bg-gray-600');
    onlineBtn?.classList.remove('hover:bg-gray-500');
    localBtn?.classList.add('hover:bg-gray-500');
    localBtn?.classList.remove('bg-gray-600');
    tournTitle?.classList.remove('opacity-30');
    if (createTournPageBtn) createTournPageBtn.inert = false;
    if (hostTournPageBtn) hostTournPageBtn.inert = false;
    if (palySolo) palySolo.inert = true;
    if (play1) play1.inert = true;
    if (play2) play2.inert = true;
    createTournPageBtn?.classList.remove('opacity-30');
    hostTournPageBtn?.classList.remove('opacity-30');
    palySolo?.classList.add('opacity-30');
    palySolo?.classList.remove('hover:bg-gray-500');
    play1?.classList.add('opacity-30');
    play2?.classList.add('opacity-30');
};

function openSidePanel(event: Event | null, sidePanel: HTMLElement | null) {
    if (!event || !sidePanel) return;
    
    event.stopPropagation();
    sidePanel.classList.remove('translate-x-full');
    showFriendsList();
};

function closeSidePanel(event: Event | null, sidePanel: HTMLElement | null) {
    if (!event || !sidePanel) return;
    
    event.stopPropagation();
    sidePanel.classList.add('translate-x-full');
};

function panelOutsideClick(event: Event | null, sidePanel: HTMLElement | null) {
    if (!event || !sidePanel) return;
    
    if (!sidePanel.contains(event.target as Node)) {
        closeSidePanel(event, sidePanel);
    }
};

function showFriendsList() {
    try {
        friendsList?.forEach((element) => {
            element?.classList.remove('hidden');
        });
        friendsBtn?.forEach((element) => {
            element?.classList.remove('panel-btn');
            element?.classList.add('selected-panel-btn');
        });
        historyList?.forEach((element) => {
            element?.classList.add('hidden');
        });
        historyBtn?.forEach((element) => {
            element?.classList.add('panel-btn');
            element?.classList.remove('selected-panel-btn');
        });
    } catch (error) {
        console.error("Error showing friends list:", error);
    }
};

function showHistoryList() {
    try {
        historyList?.forEach((element) => {
            element?.classList.remove('hidden');
        });
        historyBtn?.forEach((element) => {
            element?.classList.remove('panel-btn');
            element?.classList.add('selected-panel-btn');
        });
        friendsList?.forEach((element) => {
            element?.classList.add('hidden');
        });
        friendsBtn?.forEach((element) => {
            element?.classList.add('panel-btn');
            element?.classList.remove('selected-panel-btn');
        });
    } catch (error) {
        console.error("Error showing history list:", error);
    }
};

export function handleScroll() {
    try {
        const scrollables = document.querySelectorAll('.scrollable') as NodeListOf<HTMLElement>;
        
        scrollables?.forEach((element) => {
            let timeout: NodeJS.Timeout = setTimeout(() => {}, 0);
            
            element.addEventListener('scroll', () => showScrollbar(element as HTMLElement, timeout));
            hideScrollbar(element as HTMLElement);
        });
    } catch (error) {
        console.error("Error handling scroll:", error);
    }
};

function showScrollbar(element: HTMLElement | null, timeout: NodeJS.Timeout) {
    if (!element) return;
    
    element.classList.remove('scrollbar-none');
    clearTimeout(timeout);
    timeout = setTimeout(() => hideScrollbar(element), 1500);
};

function hideScrollbar(element: HTMLElement | null) {
    element?.classList.add('scrollbar-none');
};