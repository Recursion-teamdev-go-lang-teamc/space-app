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
        console.error(error.message);
    }
}

function createAPODHTML(apod) {
        return `
            <h2 class="text-white text-center text-2xl py-2">${apod.title}</h2>
            <img class="py-2 max-w-2xl mx-auto" src="${apod.hdurl}" alt="${apod.title}">
            <p class="text-white text-sm py-2 max-w-2xl">${apod.explanation}</p>
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
                    <div class="text-white p-6">
                        <h2 class="mb-2 text-xl font-medium min-h-[3rem] line-clamp-2 leading-tight">
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
                    <div class="text-white p-6">
                        <h2 class="mb-2 text-xl font-medium min-h-[3rem] line-clamp-2 leading-tight">
                        ${apod.title}
                        </h2>
                    </div>
                </a>
            `
        }
        apodsContainer.appendChild(card)
    });
}

// modal contents settings
let cardMap = new Map()

function getApodValue(key) {
    // update modal content
    let apod = cardMap.get(key)
    const slideContent = document.getElementById("slide-over-content")

    // 画像以外の場合
    if (apod.hdurl === "") {
        slideContent.innerHTML = `
            <iframe
                class="rounded-lg w-full aspect-[16/9] object-cover"
                src=${apod.url}
                alt=${apod.title}>
            </iframe>
            <div class="px-4 sm:px-6">
                <h2 class="text-2xl font-semibold leading-6 text-gray-900 pt-4" id="slide-over-title">${apod.title}</h2>
            </div>
            <div class="text-black pt-6 text-xl">
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
            <div class="px-4 sm:px-6">
                <h2 class="text-2xl font-semibold leading-6 text-gray-900 pt-4" id="slide-over-title">${apod.title}</h2>
            </div>
            <div class="text-black pt-6 text-xl">
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