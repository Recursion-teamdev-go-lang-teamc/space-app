const dateInput = document.getElementById("date");

// バリデーションエラー
function validateDate () {
    const date = document.getElementById("date").value;
    const errorMessage = document.getElementById('error-message');
    const [month, day, year] = date.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const minDate = new Date('1995-06-19');
    const today = new Date();
    const formatDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;

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

function deleteErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('invisible');
}

document.getElementById("list-view-button").addEventListener('click', deleteErrorMessage);
dateInput.addEventListener('blur', validateDate);
dateInput.addEventListener('input', validateDate);

const apodContainer = document.getElementById('apod-container')
const apodsContainer = document.getElementById('apods-container')

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

        // clear apods container
        apodsContainer.innerHTML = ``

        const json = await response.json();
        const apod = json.apod;
        apodContainer.innerHTML = createAPODHTML(apod)
    } catch (error) {
        displayErrorMessage("予期せぬエラーが発生しました。再度お試しください。");
        console.error(error.message);
    }
}

function displayErrorMessage(message) {
    apodContainer.innerHTML = `
        <p class="text-red-500 text-sm mt-2">${message}</p>
    `;
}

function createAPODHTML(apod) {

    let copyright = createCopyrightHTML(apod)
    // hdurl = ""の場合は画像以外がresponseで返却されている
    if (apod.hdurl === "") {
        return `
            <h2 class="text-sm md:text-2xl py-2">${apod.title}</h2>
            <iframe
                class="max-w-2xl w-full aspect-[16/9] mx-auto"
                src=${apod.url}
                alt=${apod.title}
                allowfullscreen>
            </iframe>
            ${copyright}
            <p class="text-left text-xs md:text-sm py-2 max-w-2xl">${apod.explanation}</p>
        `;
    }
    else {
        return `
            <h2 class="text-sm md:text-2xl py-2">${apod.title}</h2>
            <img class="py-2 max-w-2xl w-full aspect-[16/9] mx-auto" src="${apod.hdurl}" alt="${apod.title}">
            ${copyright}
            <p class="text-left text-xs md:text-sm py-2 max-w-2xl">${apod.explanation}</p>
        `;
    }
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

        // clear apod container
        apodContainer.innerHTML = ``

        const json = await response.json();
        const apods = json.apods;
        createAPODCardHTML(apods)
    } catch (error) {
        console.error(error.message);
    }
}

function createAPODCardHTML(apods) {
    // init apodsContainer.innerHTML
    apodsContainer.innerHTML = ``

    // create Apod card html
    apods.forEach((apod, index) => {
        
        cardMap.set(`card-${index}`, apod)  // set map {key, value} for modal panel
        const card = document.createElement("div")
        card.className = "relative mx-3 mt-6 h-84 flex flex-col self-start rounded-lg overflow-hidden "

        let copyright = createCopyrightHTML(apod)

        // hdurl = ""の場合は画像以外がresponseで返却されている
        if (apod.hdurl === "") {
            console.log("embed")
            // iframeで埋め込みを実装する
            card.innerHTML = `
                <a href="#!" class="hover:opacity-60" onclick="getApodValue('card-${index}')">
                    <iframe
                        class="pointer-events-none rounded-lg w-full aspect-[16/9] object-cover"
                        src=${apod.url}
                        alt=${apod.title}>
                    </iframe>
                    ${copyright}
                    <div class="p-2 md:p-4">
                        <h2 class="mb-2 text-sm md:text-xl font-medium min-h-[3rem] line-clamp-2 leading-tight">
                        ${apod.title}
                        </h2>
                    </div>
                </a>
            `
        } else {
            card.innerHTML = `
                <a href="#!" class="hover:opacity-60" onclick="getApodValue('card-${index}')">
                    <img
                        class="rounded-lg w-full aspect-[16/9] object-cover"
                        src=${apod.hdurl}
                        alt=${apod.title}/>
                    ${copyright}
                    <div class="p-2 md:p-4">
                        <h2 class="mb-2 text-sm md:text-xl font-medium min-h-[3rem] line-clamp-2 leading-tight">
                        ${apod.title}
                        </h2>
                    </div>
                </a>
            `
        }
        apodsContainer.appendChild(card)
    });
}

function createCopyrightHTML(apod) {
    if (apod.copyright === "")
        return ""
    else 
        return `<p class="text-gray-400 text-xs">Image Credit: ${apod.copyright}</p>  <!-- クレジット表記 -->`
}

// modal contents settings
let cardMap = new Map()

function getApodValue(key) {
    // update modal content
    let apod = cardMap.get(key)
    const slideContent = document.getElementById("slide-over-content")

    let copyright = createCopyrightHTML(apod)

    // 画像以外の場合
    if (apod.hdurl === "") {
        slideContent.innerHTML = `
            <iframe
                class="rounded-lg w-full aspect-[16/9] object-cover"
                src=${apod.url}
                alt=${apod.title}>
            </iframe>
            ${copyright}
            <h2 class="text-xl md:text-2xl font-semibold leading-6 text-gray-900 pt-2 md:pt-3" id="slide-over-title">${apod.title}</h2>
            <div class="text-black pt-6 text-sm md:text-xl">
                <p>${apod.explanation}</p>
            </div>
        `
    } else {
        // 画像の場合
        slideContent.innerHTML = `
            <img
                class="rounded-lg w-full aspect-[16/9] object-cover"
                src=${apod.hdurl}
                alt=${apod.title}/>
            ${copyright}
            <h2 class="text-xl md:text-2xl font-semibold leading-6 text-gray-900 pt-2 md:pt-3" id="slide-over-title">${apod.title}</h2>
            <div class="text-black pt-2 md:pt-6 text-sm md:text-xl">
                <p>${apod.explanation}</p>
            </div>
        `
    }


    // open modal
    openModal()
}


// modal settings
const modal = document.querySelector('[role="dialog"]');
const backdrop = document.getElementById("backdrop")
const slideOverPanel = document.getElementById("slide-over-panel")
const closeBtn = document.getElementById("close-modal-button")

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

// switch date view, list view
const dateViewBtn = document.getElementById("date-view-button")
const listViewBtn = document.getElementById("list-view-button")
const apodBtn = document.getElementById("apod-button")
const apodsListBtn = document.getElementById("apods-list-button")

function selectDateViewButton() {
    apodBtn.classList.remove("hidden")
    apodsListBtn.classList.add("hidden")

    dateViewBtn.classList.add("bg-sky-500")
    listViewBtn.classList.remove("bg-sky-500")
}

function selectListViewButton() {
    apodBtn.classList.add("hidden")
    apodsListBtn.classList.remove("hidden")

    dateViewBtn.classList.remove("bg-sky-500")
    listViewBtn.classList.add("bg-sky-500")
}

// 初期状態は date View Button
selectDateViewButton()
