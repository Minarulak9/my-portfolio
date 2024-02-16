import intro from './intro.js'
let introPage = window.localStorage.getItem('page1');
const root = document.documentElement;
let page1 = document.querySelector('#page1');
let app = document.querySelector('#app');
let settingLight = document.querySelector('.setting_light');
let settingDark = document.querySelector('.setting_dark');
let settingMute = document.querySelector('.setting_mute');
let settingUnmute = document.querySelector('.setting_unmute');
let settingClear = document.querySelector('.setting_clear');
const helpBtn = document.querySelector('.help_btn');
const helpBox = document.querySelector('.help_box');
let sound='mute';


class Sound {
    constructor(src) {
        this.audio = new Audio(src);
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}


const lightMode = ()=>{
    page1.classList.add("light")
    page1.classList.remove("night")
    app.classList.add("light")
    app.classList.remove("night")
    settingLight.classList.add('active')
    settingDark.classList.contains('active') && settingDark.classList.remove('active')
    root.style.setProperty('--primary_dark','rgb(206, 75, 0)');
    root.style.setProperty('--gray','#2e3238');
    root.style.setProperty('--black_t','rgba(255, 255, 255, 0.2)');
    root.style.setProperty('--white_t','rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--dark','#ddf3ff');
    root.style.setProperty('--light','#2e3238');
    root.style.setProperty('--white','rgb(17, 17, 17)');
    root.style.setProperty('--black','rgb(255, 255, 255)');
    root.style.setProperty('--primary_light', '#00cfc8');
    localStorage.setItem('theme', 'light'); 
}
const darkMode = ()=>{
    page1.classList.add("night")
    page1.classList.remove("light")
    app.classList.add("night")
    app.classList.remove("light")
    settingDark.classList.add('active')
    settingLight.classList.contains('active') && settingLight.classList.remove('active')
    root.style.setProperty('--white', 'rgb(255, 255, 255)');
    root.style.setProperty('--black', 'rgb(17, 17, 17)');
    root.style.setProperty('--black_t', 'rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--white_t', 'rgba(255, 255, 255, 0.2)');
    root.style.setProperty('--gray', '#98a8c2');
    root.style.setProperty('--dark', '#1a1818 ');
    root.style.setProperty('--light', '#ddf3ff');
    root.style.setProperty('--primary_dark', '#2ecc71');
    root.style.setProperty('--primary_light', 'rgb(206, 75, 0)');
    localStorage.setItem('theme', 'dark'); 
}

const mute = ()=>{
    localStorage.setItem('sound', 'mute'); 
    sound='mute'
}
const unmute = ()=>{
    localStorage.setItem('sound', 'unmute');
    sound='unmute';
}


window.addEventListener('load',()=>{
    let theme = localStorage.getItem('theme');
    theme == 'dark' ? darkMode():lightMode();
    sound = localStorage.getItem('sound');
    sound == 'mute' ? settingMute.classList.add('active') && settingUnmute.classList.remove('active'):settingUnmute.classList.add('active')&& settingMute.classList.remove('active');
})

document.addEventListener("click", function(event) {
    const cursor = document.querySelector("#cursor");
    cursor.classList.add('click')
    if (sound=='unmute') {
        new Sound('./../sounds/click.mp3').play();
    }
    setTimeout(()=>{
        cursor.classList.remove('click')
    },200)
});


document.addEventListener("mousemove", function(event) {
    const x = event.pageX - 10;
    const y = event.pageY - 10;
    const cursor = document.querySelector("#cursor");
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
});

if (!introPage) {
    intro();
}else{
    page1.remove();
    app.classList.add('activeInstant','night')
    helpBtn.classList.add('visible');
}

// app
const email = document.querySelector('.email')
email.addEventListener('click',()=>{
    let icon = email.querySelector('.icon i')
    let value = email.querySelector('.value')
    window.navigator.clipboard.writeText(value.textContent)
    icon.className='fa-solid fa-circle-check'
    value.textContent='Copied'
    setTimeout(() => {
        icon.className='fa-regular fa-copy fa-fade'
        value.textContent='minarulh34@gmail.com'
    }, 2000);
})
// help btn

// projects

const projectData = [
    {
        title:"EvPoint",
        logo:'evpoint_logo.webp',
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        projectStartDate:'13 Aug 2022',
        projectEndDate:'13 Aug 2022',
        images:['evpoint1.webp','evpoint2.webp','evpoint3.webp'],
        liveLink:"https://minarulak9.github.io/evPoint_frontend/",
        technologies:['HTML','CSS','Javascript','Leaflet Js Lib','Node Js','MongoDB','Express Js','Postman','Git & Github',]
    },
    {
        title:"Indomitech Group",
        logo:'indomitech_logo.webp',
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        projectStartDate:'22 Dec 2022',
        projectEndDate:'22 Dec 2022',
        images:['indo1.webp','indo2.webp','indo3.webp'],
        liveLink:"https://indomitechgroup.com/",
        technologies:['HTML','CSS','Javascript','Leaflet Js Lib','Node Js','MongoDB','Express Js','Postman','Git & Github',]
    },
    {
        title:"Banking Application With JS",
        logo:'bank_logo.webp',
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        projectStartDate:'22 Jul 2022',
        projectEndDate:'22 Jul 2022',
        images:['bank1.webp','bank2.webp','bank3.webp'],
        liveLink:"https://minarulak9.github.io/banking-application-with-js/",
        technologies:['HTML','CSS','Javascript','Leaflet Js Lib','Node Js','MongoDB','Express Js','Postman','Git & Github',]
    },
    {
        title:"L-kaija",
        logo:'lkaija_logo.webp',
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        projectStartDate:'13 Aug 2023',
        projectEndDate:'13 Aug 2023',
        images:['lkaija1.webp','lkaija2.webp','lkaija3.webp'],
        liveLink:"https://lkaijatech.com/",
        technologies:['HTML','CSS','Javascript','Leaflet Js Lib','Node Js','MongoDB','Express Js','Postman','Git & Github',]
    },
    {
        title:"Explomart",
        logo:'explomart_logo.webp',
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        projectStartDate:'22 Dec 2022',
        projectEndDate:'22 Dec 2022',
        images:['explomart1.webp','jiomart2.webp','jiomart3.webp','jiomart4.webp'],
        liveLink:"https://dpbos.in/explomart/",
        technologies:['HTML','CSS','Javascript','Leaflet Js Lib','Node Js','MongoDB','Express Js','Postman','Git & Github',]
    },
    {
        title:"COLUMBUS TECHNOLOGY SOLUTIONS (CTS)",
        logo:'cts_logo.gif',
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        projectStartDate:'22 Sep 2023',
        projectEndDate:'22 Sep 2023',
        images:['cts1.webp','cts2.webp','cts3.webp','cts4.webp'],
        liveLink:"http://columbustechsolutions.com/",
        technologies:['HTML','CSS','Javascript','Leaflet Js Lib','Node Js','MongoDB','Express Js','Postman','Git & Github',]
    },
]
const achivements = [
    {
        title:"JISTech2k22",
        desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, nisi in eaque at quos excepturi ea repellendus repellat tempora est labore quasi nemo quo! Maiores natus perspiciatis ex illo dolores aliquid ducimus ratione ut quaerat inventore, corporis accusamus deserunt blanditiis.",
        achivementDate:'13 Aug 2022',
        images:['jistech1.webp','jistech2.webp','jistech3.webp'],
    },
]
const projectContainer = document.querySelector('.projects');
projectData.forEach((p,i)=>{
    let html = `<div class="project" data-id="project${i}" >
                    <img class="project_main_img" src="./img/projects/${p.images[0]}" alt="">
                    <div class="details">
                        <img class="project_logo" src="./img/projects/${p.logo}" alt="">
                        <div class="texts">
                            <h3 class="title">${p.title}</h3>
                            <p class="para">${p.desc}</p>
                            <a target="_blank" href=${p.liveLink} class="link">View Demo</a>
                        </div>
                    </div>
                </div>`
    projectContainer?.insertAdjacentHTML('beforeend',html)
})
const achivementContainer = document.querySelector('.achivements');
achivements.forEach((p,i)=>{
    let html = `<div class="achivement" data-id="achivement${i}" >
                    <div class="swiper mySwiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">Slide 1</div>
                            <div class="swiper-slide">Slide 2</div>
                            <div class="swiper-slide">Slide 3</div>
                            <div class="swiper-slide">Slide 4</div>
                        </div>
                    </div>
                </div>`
    achivementContainer?.insertAdjacentHTML('beforeend',html)
})



// setting 
const settings = document.getElementById('settings');
const settingBtn = document.querySelector('.setting_btn');
settingBtn.addEventListener('click',()=>{
    settings.classList.toggle('active');
})


// let timer;
helpBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    helpBox.classList.contains('active') && settings.classList.remove('active')
    helpBtn.classList.toggle('active')
    helpBox.classList.toggle('active')

})

settingLight.addEventListener('click',()=>{
    lightMode();
    settingLight.classList.add('active');
    settingDark.classList.remove('active');
})
settingDark.addEventListener('click',()=>{
    darkMode();
    settingDark.classList.add('active');
    settingLight.classList.remove('active');
})
settingMute.addEventListener('click',()=>{
    mute();
    settingMute.classList.add('active')
    settingUnmute.classList.remove('active')
})
settingUnmute.addEventListener('click',()=>{
    unmute();
    settingMute.classList.remove('active')
    settingUnmute.classList.add('active')
})
settingClear.addEventListener('click',()=>{
    window.localStorage.clear();
    window.location = './index.html'
})

// paralax effect
const hero = document.querySelector('.hero')
const heading = document.querySelector('.hero .heading')
document.addEventListener('scroll',()=>{
    if (window.screen.availHeight> window.scrollY) {
        // hero.style.backgroundSize=`${100 + (Math.floor(window.scrollY) / 2)}%`;
        heading.style.transform=`scale(${(1 * (Math.floor(window.scrollY) / 450)+1).toFixed(2)})`
        console.log(window.scrollY);
    }
},{ passive: true })

