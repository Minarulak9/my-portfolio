function intro() {
const root = document.documentElement;
let page1 = document.querySelector('#page1');
let app = document.querySelector('#app');
page1.classList.remove('hide')
let settingLight = document.querySelector('.setting_light');
let settingDark = document.querySelector('.setting_dark');
let helpBtn = document.querySelector('.help_btn');
let skipBtn = document.querySelector('.skip_into_btn');
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
const problems = [
    {
        question: "5 + 5 * ( 10 / 5 )",
        answer:15
    },
    {
        question: "5 + 15 / 3 - 5 ",
        answer:5
    },
    {
        question: "8 + 60 / 5 - 5 ",
        answer:15
    },
]
let q = Math.floor(Math.random()*problems.length)

const lightMode = ()=>{
    page1.classList.add("light")
    page1.classList.remove("night")
    app.classList.add('light')
    app.classList.remove('night')
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
    app.classList.remove('light')
    app.classList.add('night')
    settingDark.classList.add('active')
    settingLight.classList.contains('active') && settingLight.classList.remove('active')
    root.style.setProperty('--white', 'rgb(255, 255, 255)');
    root.style.setProperty('--black', 'rgb(17, 17, 17)');
    root.style.setProperty('--black_t', 'rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--white_t', 'rgba(255, 255, 255, 0.2)');
    root.style.setProperty('--gray', '#98a8c2');
    root.style.setProperty('--dark', '#1a1818');
    root.style.setProperty('--light', '#ddf3ff');
    root.style.setProperty('--primary_dark', '#2ecc71');
    root.style.setProperty('--primary_light', 'rgb(206, 75, 0)');
    localStorage.setItem('theme', 'dark'); 
}

const skip = ()=>{
    lightMode();
    let box = document.querySelector('.page1_box');
    let app = document.querySelector('#app');
    window.localStorage.setItem('page1',true);
    box.classList.add('smoothHide');
    helpBtn.classList.add('visible')
    setTimeout(() => {
        setTimeout(() => {
            let page1 = document.querySelector('#page1');
            page1.classList.add('remove');
            app.classList.add('active');
            setTimeout(() => {
                page1.remove();
            }, 2000);
        }, 800);
    }, 700);
}
skipBtn.addEventListener('click',skip);

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

new TypeIt(".texts", {
    startDelay:900,
    speed: 10,
    loop: false,
})
.type('<span class="para_text c_sec">Welcome to Minarul\'s Portfolio¬‣</span>', { delay: 300 })
.type('<br> <br><span class="text1 sub_heading font_2 c_primary">Now Help me to choose what theme do you like ¬‣</span>')
.type('<div class="theme_btns"><button class="dark_btn active">Dark</button><button class="light_btn">light</button></div>')
.exec(async () => {
    await new Promise((resolve, reject) => {
        let darkBtn = document.querySelector('.dark_btn');
        let lightBtn = document.querySelector('.light_btn');
        darkBtn.addEventListener('click', () => {
            darkBtn.classList.add('active')
            lightBtn.classList.remove('active')
            darkMode();
            return resolve(); 
        })
        lightBtn.addEventListener('click', () => {
            lightBtn.classList.add('active')
            darkBtn.classList.remove('active')
            lightMode();
            return resolve(); 
        })
    });
})
.pause(700)
.type('<br><span class="text1 sub_heading font_2 c_primary">do you want sound effects ¬‣</span>')
.type('<div class="sound_btns"><button class="unmute_btn"><img src="./img/sound.svg"></button><button class="mute_btn"><img src="./img/mute.svg"></button></div>')
.exec(async () => {
    await new Promise((resolve, reject) => {
        let unmuteBtn = document.querySelector('.unmute_btn');
        let muteBtn = document.querySelector('.mute_btn');
        unmuteBtn.addEventListener('click', () => {
            unmute()    
            return resolve(); 
        })
        muteBtn.addEventListener('click', () => {
            mute()    
            return resolve(); 
        })
    });
})
.pause(400)
.type('<span class="sub_heading c_primary mt-s">Now Solve This 😎¬‣</span>')  
.type(`<span class="sub_heading c_primary ">${problems[q].question} = </span>`)  
.type(`<span class="para_text c_sec"><input class="solution_in" type="text" placeholder="type solution"></span> <button class="check_btn">Check</button>`)  
.exec(async () => {
    await new Promise((resolve, reject) => {
        let msg = [
            "Attempt once more",
            "Give it another shot",
            "Have another go",
            "Retry",
            "Make a second attempt",
            "Take another stab at it",
            "Give it another try",
            "Have another crack at it",
            "Take a second chance",
            "Give it a second whirl"
        ];
        let checkBtn = document.querySelector('.check_btn');
        let sol = document.querySelector('.solution_in');
        checkBtn.addEventListener('click', () => {
            if (sol.value == problems[q].answer) {
                sol.classList.add('right');
                if (sound=='unmute') {   
                    new Sound('./../sounds/right.mp3').play();
                }
                return resolve();
            }else{
                sol.classList.add('wrong');
                sol.value=msg[Math.floor(Math.random()*msg.length)];
                setTimeout(()=>{
                    sol.classList.remove('wrong');
                    sol.value='';
                    sol.focus();
                    if (sound=='unmute') {   
                        new Sound('./../sounds/wrong.mp3').play();
                    }
                },600)
            }
        })
    });
})
.type('<button class="start_btn"> Let\'s Begin </button>')
.exec(async () => {
    await new Promise((resolve, reject) => {
        let start = document.querySelector('.start_btn');
        let box = document.querySelector('.page1_box');
        start.addEventListener('click', () => {
            window.localStorage.setItem('page1',true);
            box.classList.add('smoothHide');
            helpBtn.classList.add('visible')
            setTimeout(() => {
                setTimeout(() => {
                    let page1 = document.querySelector('#page1');
                    page1.classList.add('remove');
                    app.classList.add('active');
                    setTimeout(() => {
                        page1.remove();
                    }, 2000);
                }, 800);
            }, 700);
        })
     
    });
})
.go();

}
export default intro;