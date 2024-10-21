const apodList = [
    {hdurl:"https://apod.nasa.gov/apod/image/2410/SohoKy3.jpg", title:"Five Bright Comets from SOHO", explanation:"Five bright comets are compared in these panels, recorded by a coronograph on board the long-lived, sun-staring SOHO spacecraft. Arranged chronologically all are recognizable by their tails streaming away from the Sun at the center of each field of view, where a direct view of the overwhelmingly bright Sun is blocked by the coronagraph's occulting disk. Each comet was memorable for earthbound skygazers, starting at top left with Comet McNaught, the 21st century's brightest comet (so far). C/2023 A3 Tsuchinshan-ATLAS, following its perihelion with the active Sun at bottom center, has most recently grabbed the attention of comet watchers around the globe. By the end of October 2024, the blank 6th panel may be filled with bright sungrazer comet C/2024 S1 (ATLAS). ... or not."},
    {hdurl:"https://apod.nasa.gov/apod/image/2410/AuroraNz_McDonald_2048.jpg", title:"Colorful Aurora over New Zealand", explanation:"Sometimes the night sky is full of surprises. Take the sky over Lindis Pass, South Island, New Zealand one-night last week.  Instead of a typically calm night sky filled with constant stars, a busy and dynamic night sky appeared. Suddenly visible were pervasive red aurora, green picket-fence aurora, a red SAR arc, a STEVE, a meteor, and the Moon. These outshone the center of our Milky Way Galaxy and both of its two satellite galaxies: the LMC and SMC. All of these were captured together on 28 exposures in five minutes, from which this panorama was composed.  Auroras lit up many skies last week, as a Coronal Mass Ejection from the Sun unleashed a burst of particles toward our Earth that created colorful skies over latitudes usually too far from the Earth's poles to see them.  More generally, night skies this month have other surprises, showing not only auroras -- but comets.   Jigsaw Challenge: Astronomy Puzzle of the Day"},
    {hdurl:"https://apod.nasa.gov/apod/image/2410/earliestsolareclipse.jpg", title:"Eclipse at Sunrise", explanation:"The second solar eclipse of 2024 began in the Pacific. On October 2nd the Moon's shadow swept from west to east, with an annular eclipse visible along a narrow antumbral shadow path tracking mostly over ocean, crossing land near the southern tip of South America, and ending in the southern Atlantic. The dramatic total annular eclipse phase is known to some as a ring of fire. Still, a partial eclipse of the Sun was experienced over a wide region. Captured at one of its earliest moments, October's eclipsed Sun is seen just above the clouds near sunrise in this snapshot. The partially eclipsed solar disk is close to the maximum eclipse as seen from Mauna Kea Observatory Visitor Center, Island of Hawaii, planet Earth.   Growing Gallery: Annular Solar Eclipse 2024 October",},
    {hdurl:"https://apod.nasa.gov/apod/image/2410/zaparolliA3.png", title:"Comet at Moonrise", explanation:"Comet C/2023 A3 (Tsuchinshan–ATLAS) is growing brighter in planet Earth's sky. Fondly known as comet A3, this new visitor to the inner Solar System is traveling from the distant Oort cloud. The comet reached perihelion, its closest approach to the Sun, on September 27 and will reach perigee, its closest to our fair planet, on October 12, by then becoming an evening sky apparition. But comet A3 was an early morning riser on September 30 when this image was made. Its bright coma and already long tail share a pre-dawn skyscape from Praia Grande, Santa Catarina in southern Brazil with the waning crescent Moon just peeking above the eastern horizon. While the behaviour of comets is notoriously unpredictable, Tsuchinshan–ATLAS could become a comet visually rivaling C/2020 F3 (NEOWISE). Comet NEOWISE wowed skygazers in the summer of 2020.   Growing Gallery: Comet Tsuchinsan-ATLAS in 2024"},
]

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

        console.log(url.toString())
        const json = await response.json();
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

// APODSのカード形式テスト用関数
async function createAPODS() {
    const apodsContainer = document.getElementById('apods-container');
    createAPODCardHTML(apodsContainer)
}

function createAPODCardHTML(apodContainer) {
    apodList.forEach(apod => {
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
                    <p class="mb-4 text-sm">
                    ${apod.explanation}
                    </p>
                </div>
            </a>
        `
        apodContainer.appendChild(card)
    });
}