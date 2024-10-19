async function fetchADOP() {
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
            <h2>${apod.title}</h2>
            <img src="${apod.hdurl}" alt="${apod.title}">
            <p>${apod.explanation}</p>
        `;
    } catch (error) {
        console.error(error.message);
    }
}
