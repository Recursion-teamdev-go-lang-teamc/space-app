// カレンダーの最大日付
const dateInput = document.getElementById("date");
const today = new Date();
const formatDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
dateInput.setAttribute("datepicker-max-date", formatDate);

// バリデーションエラー
function validateDate () {
    const date = document.getElementById("date").value;
    const errorMessage = document.getElementById('error-message');
    const [month, day, year] = date.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    const minDate = new Date('1995-06-19')

    if (!isNaN(inputDate) && minDate <= inputDate && inputDate <= today) {
        errorMessage.classList.add('invisible'); // エラーメッセージを非表示
    } else if (date === '') {
        errorMessage.classList.add('invisible');
    } else {
        errorMessage.innerHTML = `
            06/20/1995 ~ ${formatDate}の範囲内の日付を入力してください
        `;
        errorMessage.classList.remove('invisible'); // エラーメッセージを表示
    }
}
dateInput.addEventListener('blur', validateDate);
dateInput.addEventListener('input', validateDate);

async function fetchAPOD() {
    let url = new URL("http://localhost:8000/api/apod");
    const date = document.getElementById("date").value
    const params = new URLSearchParams({
        date: date
    })
    if (date != "") {
        url.search = params.toString();
    }
    console.log(url)

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json)
        const apod = json.apod;
        const apodContainer = document.getElementById('apod-container');
        if (apod.title === '') {
            displayErrorMessage('指定した日付にデータが見つかりませんでした。別の日付をお試しください。');
        }
        apodContainer.innerHTML = `
            <h2 class="text-white text-center text-2xl py-2">${apod.title}</h2>
            <img class="py-2" src="${apod.hdurl}" alt="${apod.title}">
            <p class="text-white py-2">${apod.explanation}</p>
        `;
    } catch (error) {
        if (error.message === "Failed to fetch") {
            displayErrorMessage("ネットワークエラーが発生しました。接続を確認してください。");
        } else {
            displayErrorMessage("不明なエラーが発生しました。");
        }
        console.error(error.message);
    }
}
function displayErrorMessage(message) {
    const apodContainer = document.getElementById('apod-container');
    apodContainer.innerHTML = `
        <p class="text-red-500 text-sm mt-2">${message}</p>
    `;
}

async function fetchAPODs() {
    let url = new URL("http://localhost:8000/api/apods/random");
    const date = ""
    const params = new URLSearchParams({
        date: date
    })
    if (date != "") {
        url.search = params.toString();
    }
    console.log(url)

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }

        const json = await response.json();
        const apods = json.apods;
        const apodsContainer = document.getElementById('apods-container');
        createAPODCardHTML(apodsContainer, apods)
    } catch (error) {
        console.error(error.message);
    }
}
// APODSのカード形式テスト用関数
async function createAPODS() {
    const apodsContainer = document.getElementById('apods-container');
    createAPODCardHTML(apodsContainer)
}

function createAPODCardHTML(apodsContainer, apods) {
    // init apodsContainer.innerHTML
    apodsContainer.innerHTML = ``
    // create Apod card html
    apods.forEach((apod, index) => {
        cardMap.set(`card-${index}`, apod)  // set map {key, value} for modal panel
        const card = document.createElement("div")
        card.className = "relative mx-3 mt-6 h-84 flex flex-col self-start rounded-lg overflow-hidden hover:opacity-60"
        /*
        card.innerHTML = `
            <a href="#!" onclick="getApodValue('card-${index}')">
                <img
                    class="rounded-lg border-2 border-white w-full aspect-[16/9] object-cover"
                    src=${apod.hdurl}
                    alt=${apod.title}/>
                <p class="absolute top-0 left-0 text-white text-2xl p-2 font-medium min-h-[3rem] line-clamp-2 leading-tight"
                    style="-webkit-text-stroke: 1px black;">
                ${apod.title}
                </p>
            </a>
        `
        */
        card.innerHTML = `
            <a href="#!" onclick="getApodValue('card-${index}')">
                <img
                    class="rounded-lg w-full aspect-[16/9] object-cover"
                    src=${apod.hdurl}
                    alt=${apod.title}/>
                <div class="text-white p-6">
                    <h2 class="mb-2 text-xl font-medium min-h-[3rem] line-clamp-2 leading-tight">
                    ${apod.title}
                    </h2>
                    <!--
                    <p class="mb-4 text-sm">
                    ${apod.explanation}
                    </p>
                    -->
                </div>
            </a>
        `
        apodsContainer.appendChild(card)
    });
}

// modal contents settings
let cardMap = new Map()

function getApodValue(key) {
    // update modal content
    let apod = cardMap.get(key)
    // const slideTitle = document.getElementById("slide-over-title")
    const slideContent = document.getElementById("slide-over-content")

    // slideTitle.innerHTML = apod.title
    slideContent.innerHTML = `
        <img
            class="rounded-lg w-full aspect-[16/9] object-cover"
            src=${apod.hdurl}
            alt=${apod.title}/>
        <div class="px-4 sm:px-6">
            <h2 class="text-2xl font-semibold leading-6 text-gray-900 pt-4" id="slide-over-title">${apod.title}</h2>
        </div>
        <div class="text-black pt-6 text-xl">
            <p>${apod.explanation}</p>
        </div>
    `

    // open modal
    openModal()
}



// modal settings
const modal = document.querySelector('[role="dialog"]');
var backdrop = document.getElementById("backdrop")
var slideOverPanel = document.getElementById("slide-over-panel")
var closeBtn = document.getElementById("close-modal-button")

closeBtn.onclick = function() {
    hideModal()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == backdrop) {
    hideModal()
  }
}

function openModal() {
    modal.classList.remove("hidden")
    backdrop.classList.add("opacity-100")
    slideOverPanel.classList.remove("translate-x-full")
    closeBtn.classList.add("opacity-100")
}

function hideModal() {
    modal.classList.add("hidden")
    backdrop.classList.remove("opacity-100")
    slideOverPanel.classList.add("translate-x-full")
    closeBtn.classList.remove("opacity-100")
}