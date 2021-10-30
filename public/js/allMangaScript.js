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
        const theTitle = item.attributes.title
        const theSlug = item.attributes.slug
        const theThumbnail = item.links.thumbnailUrl
        if (theTitle !== "") {
            const template = `
            <a href="/series/${theSlug}">
                <div class="manga-card">
                    <div class="manga-thumbnail" style="background: url(${theThumbnail}); background-repeat: no-repeat;
                    background-size: cover; background-position: center;">
                    </div>
                </div>
                <div class="manga-title">
                    <p>${theTitle}</p>
                </div>
            </a>
            `
            document.getElementById('template').innerHTML += template
        }
    })
}

fetchMangaList(displayMangaDetail)