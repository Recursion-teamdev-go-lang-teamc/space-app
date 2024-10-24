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
        apodContainer.innerHTML = `
            <h2 class="text-white text-center text-2xl py-2">${apod.title}</h2>
            <img class="py-2" src="${apod.hdurl}" alt="${apod.title}">
            <p class="text-white py-2">${apod.explanation}</p>
        `;
    } catch (error) {
        console.error(error.message);
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

        const json = await response.json();
        console.log(json)
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
    apods.forEach(apod => {
        const card = document.createElement("div")
        card.className = "mx-3 mt-6 flex flex-col self-start rounded-lg shadow-xl"
        card.innerHTML = `
            <a href="#!">
                <img
                    class="rounded-t-lg"
                    src=${apod.hdurl}
                    alt=${apod.title}/>
                <div class="text-white p-6">
                    <h2 class="mb-2 text-xl font-medium leading-tight">
                    ${apod.title}
                    </h2>
                    /*
                    <p class="mb-4 text-sm">
                    ${apod.explanation}
                    </p>
                    */
                </div>
            </a>
        `
        apodsContainer.appendChild(card)
    });
}
