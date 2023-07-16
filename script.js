date = new Date();
var weekDay = "Monday";
function checkDay() {
    // console.log(date.getDay());
    switch (date.getDay()) {
        case 1:
            weekDay = "Monday";
            break;
        case 2:
            weekDay = "Tuesday";
            break;
        case 3:
            weekDay = "Wednesday";
            break;
        case 4:
            weekDay = "Thursday";
            break;
        case 5:
            weekDay = "Friday";
            break;
        case 6:
            weekDay = "Saturday";
            break;
        case 0:
            weekDay = "Sunday";
            break;
        default:
            break;
    }
}
checkDay();
document.getElementById("date").innerHTML = weekDay + ", " + date.getDate() + "/ " + (date.getMonth() + 1) + "/ " + date.getFullYear();
/**
 * angle = (remainingTime/setTime)*360deg
 * remainingTime = futureTime - currentTime
 */
const sessions = document.querySelector('#sessions');
const iconTemplate = document.querySelector('#icon-template');

function createDoneSessionIcon() {
    const DONE_SESSION_ICON = iconTemplate.content.cloneNode(true);
    sessions.prepend(DONE_SESSION_ICON);
}

const semicircles = document.querySelectorAll('.semicircle');
const timer = document.querySelector('.timer');
const resetBtn = document.querySelector('#reset');
const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
const timeupAudio = document.querySelector('#time-up-alarm');

var currentWorkingState = 'pomodoro';

var timerLoop = null;
var isRunning = false;

//input
var hr = 0;
var min = 20;
var sec = 20;

var setTime = 0;
var startTime = 0
var futureTime = 0;
var remainingTime = 0;

function setTimer(hrs, mins, secs) {
    hr = hrs;
    min = mins;
    sec = secs;

    timer.innerHTML = `
    <!--<div>${hrs.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div>
        <div class="colon">:</div>-->
        <div>${mins.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div>
        <div class="colon">:</div>
        <div>${secs.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</div>
    `;
}
function changeWorkingState(state) {
    switch (state) {
        case 'pomodoro':
            setTimer(0, 25, 0);
            break;
        case 'short-break':
            setTimer(0, 5, 0);
            break;
        case 'long-break':
            setTimer(0, 15, 0);
            break;
        default:
            setTimer(0, 25, 0);
    }
}
function calculateTime() {
    setTime = hr * 3600000 + min * 60000 + sec * 1000;
    remainingTime = setTime;
}
function initial() {
    changeWorkingState(currentWorkingState);

    isRunning = false;
    calculateTime();

    semicircles[0].style.display = 'block';
    semicircles[1].style.display = 'block';
    semicircles[2].style.display = 'none';
    semicircles[0].style.backgroundColor = "#5F8D4E";
    semicircles[1].style.backgroundColor = "#5F8D4E";
    semicircles[0].style.transform = 'rotate(180deg)';
    semicircles[1].style.transform = `rotate(0deg)`;
}

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        timerLoop = setInterval(counDownTimer, 20);
        playingAudio.play();
    };
    isRunning = true;

    console.log('setinterval', timerLoop);
})
function reset() {
    if (timerLoop) {
        clearInterval(timerLoop);
        timerLoop = null;
    }
    initial();
}
resetBtn.addEventListener('click', () => {
    reset();
})

initial();

function counDownTimer() {
    // console.log('setinterval', timerLoop);

    remainingTime -= 20;// minus time equal to the time in setInterval func

    // console.log(futureTime - Date.now());

    const angle = (remainingTime / setTime) * 360;

    // progress indicator
    if (angle > 180) {
        semicircles[2].style.display = 'none';
        semicircles[0].style.transform = 'rotate(180deg)';
        semicircles[1].style.transform = `rotate(${angle}deg)`;
    } else {
        semicircles[2].style.display = 'block';
        semicircles[0].style.transform = `rotate(${angle}deg)`;
        semicircles[1].style.transform = `rotate(${angle}deg)`;
    }
    // timer
    const hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((remainingTime / (1000 * 60)) % 60);
    const secs = Math.floor((remainingTime / (1000)) % 60);

    // console.log({ remainingTime });

    setTimer(hrs, mins, secs)


    // 5sec-condition
    if (remainingTime < 6000) {
        semicircles[0].style.backgroundColor = "red";
        semicircles[1].style.backgroundColor = 'red';

    }
    // end
    if (remainingTime < 1) {
        console.log("clear interval");
        if (timerLoop) {
            clearInterval(timerLoop);
            timerLoop = null;
        }

        timeupAudio.volume = 0.2;
        timeupAudio.play();
        if (currentWorkingState === 'pomodoro')
            createDoneSessionIcon();

        semicircles[0].style.display = 'none';
        semicircles[1].style.display = 'none';
        semicircles[2].style.display = 'none';
        setTimer(0, 0, 0)
    }
}

stopBtn.addEventListener('click', () => {
    if (timerLoop) {
        clearInterval(timerLoop);
        timerLoop = null;
    }
    isRunning = false;
})



/**
 * dateTime.toLocaleString(): to display date time to string (display 2 digit values)
 * css: transform-origin, transform 
 */



var ITEMS_CONTAINER = document.getElementById('items');
const ITEM_TEMPLATE = document.getElementById('itemTemplate');
const ADD_BUTTON = document.getElementById('add');

let items = getItem();

// fetch the existing items from local storage (stored on the client-side browser)
function getItem() {
    const values = localStorage.getItem('todo') || "[]";

    return JSON.parse(values);
}

// console.log(items);

// set items --> refresh what we just save
function setItems(items) {
    const itemsJson = JSON.stringify(items); // convert back to json so it can be saved in local storage

    localStorage.setItem("todo", itemsJson);
}


function addItem() {
    items.unshift({ // add new elements to the beginning of the array
        description: "",
        completed: false,
    });

    // save item and refresh list 
    setItems(items);
    // refresh the list once the item has been added
    refreshList();
}

function updateItem(item, key, value) {
    item[key] = value;

    setItems(items);
    refreshList();
}
function removeItem(item, index) {
    items.splice(index, 1);

    setItems(items);
    refreshList();
}
// rerender
function refreshList() {
    // sort items
    items.sort((a, b) => {
        if (a.completed) {
            return 1; // push it to the bottom of the list
        }
        if (b.completed) {
            return -1;
        }
        return a.description < b.description ? -1 : 1; // sort the list alphabetically
    })

    // clear the html and refresh it with new data
    ITEMS_CONTAINER.innerHTML = "";

    for (const item of items) {
        // taking the template element, then get the content from that template, then say it let's clone or make a copy of div
        const itemElement = ITEM_TEMPLATE.content.cloneNode(true);
        const descriptionInput = itemElement.querySelector(".item-description");
        const completedInput = itemElement.querySelector(".item-completed")
        const removeBtn = itemElement.querySelector(".x-icon");

        descriptionInput.value = item.description;
        completedInput.checked = item.completed;

        descriptionInput.addEventListener('change', () => {
            // console.log(descriptionInput.value);
            updateItem(item, "description", descriptionInput.value);
        });
        completedInput.addEventListener('change', () => {
            updateItem(item, "completed", completedInput.checked);
        });
        removeBtn.addEventListener('click', () => {
            const index = items.indexOf(item);
            if (index > -1) {
                removeItem(item, index);
            }
        })

        ITEMS_CONTAINER.append(itemElement);
    }
}

ADD_BUTTON.addEventListener('click', () => {
    addItem();
});

refreshList();

//////////////////////////AUDIO
const workingTypes = document.querySelector('.panel');
const audio = document.querySelector('#audio-selector');

const forestAudio = document.querySelector('#forest');
const oceanAudio = document.querySelector('#ocean');
const rainyAudio = document.querySelector('#rainy');
const peaceAudio = document.querySelector('#peace');
const cafeAudio = document.querySelector('#cafe');
const playingAudio = document.querySelector('#playingAudio');


const pomodoroState = document.querySelector('#pomodoro');
const breakState = document.querySelector('#break');


const typesArr = Array.from(workingTypes.querySelectorAll('div'))
const audioBtnsArr = Array.from(audio.querySelectorAll('div'))

const btns = [...typesArr, ...audioBtnsArr];
btns.forEach(btn => {
    btn.classList.add('btn')
})

function activeBtn(element, type) {
    type.forEach(btn => {
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
        }
    })
    element.classList.add('active');
}
function changeSound(theme, audioElement) {
    audioElement.muted = false;

    switch (theme) {
        case 'forest':
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/forest.mp3"
            break;
        case 'ocean':
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/ocean.mp3"
            break;
        case 'rainy':
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/rain.mp3"
            break;
        case 'peace':
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/peace.mp3"
            break;
        case 'cafe':
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/cafe.mp3"
            break;
        case 'mute':
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/cafe.mp3"
            audioElement.muted = true;
            break;
        default:
            audioElement.src = "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/rain.mp3"
            break;
    }
    audioElement.play();

}

audio.onclick = (e) => {
    if (e.target.classList.contains('theme')) {
        activeBtn(e.target, audioBtnsArr)
        changeSound(e.target.id, playingAudio);
    }
}
// console.log(workingTypes);
workingTypes.onclick = (e) => {
    // console.log(e.target);
    if (e.target.classList.contains('workingState')) {
        activeBtn(e.target, typesArr);
        currentWorkingState = e.target.id;
        reset();


    }
}
