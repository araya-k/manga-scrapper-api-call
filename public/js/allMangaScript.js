// Call the API to get manga list data
const fetchMangaList = (callback) => {
    fetch('/allmanga', {
        method: 'GET',
    })
        // Return the data from the server
        .then(response => {
            return response.json()
        })
        // Calling a callback function with data from the server
        .then(jsonData => callback(jsonData))
        // Show an alert if there is any error
        .catch(err => {
            alert('API Could not be reached at this time')
            console.error(err)
        })
}

// Make the fetched data displayed in front end
const displayMangaDetail = jsonData => {
    jsonData.forEach(item => {
        const template = `
        <div class="manga-card">
            <p class="manga-title">${item.attributes.title}</p>
            <a class="btn" href="/series/${item.attributes.slug}">All Chapter</a>
        </div>
        `
        document.getElementById('template').innerHTML += template
    })
}

fetchMangaList(displayMangaDetail)