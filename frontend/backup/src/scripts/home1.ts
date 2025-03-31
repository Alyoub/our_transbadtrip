import { loadnhistory } from './app.js';

export const updateHomeHeadermain3 = () => {
    const tag = [{
        logo : '../public/logos/add_person_logo.svg',
        tagTitle : 'Open an Account',
        tagText : ' Join the community, track your progress, and compete with players worldwide. Signing up is quick, easy, and your first step to becoming a ping pong champion!'
    },
    {
        logo : '../public/logos/pingpong_racket.png',
        tagTitle : 'PingPong.io Online',
        tagText : 'Compete with players from around the world, showcase your skills in real-time matches. The ultimate Ping Pong challenge is just a click away!'
    },
    {
        logo : '../public/logos/chat_box_logo.svg',
        tagTitle : 'Chat',
        tagText : 'Talk strategy, challenge friends, and celebrate your victories. Our chat feature keeps you connected with the Ping Pong community in real-time!'
    },
    {
        logo : '../public/logos/calendar_logo.svg',
        tagTitle : 'Tournaments',
        tagText : 'Join tournaments, compete with top players, and prove your dominance. Climb the ranks and become a Ping Pong champion!'
    }
    ];

    let htmlGen = '';

    tag.forEach((tag) => {
        htmlGen += `
        <div class="tag1">
            <div class="pic-tag">
                <img class="add-acc" src="${tag.logo}">
                </div>
            <p class="tag-text">
                ${tag.tagTitle}
            </p>
            <p class="tag-text1">
            ${tag.tagText}
            </p>
            </div>
            `
    });

    const element = document.querySelector('.js-tag');
    if (element) {
        element.innerHTML = htmlGen;
    }
    // const loginPageBtn = document.getElementById('loginPageBtn') as HTMLButtonElement;

    // loginPageBtn?.addEventListener('click', () => loadnhistory('login'));
};

// module.exports = { updateHomeHeadermain3 };
