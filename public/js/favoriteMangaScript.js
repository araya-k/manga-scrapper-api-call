// Call the API to get manga list data
const fetchFavoriteMangaList = (callback) => {
    fetch('/favorite', {
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
const displayFavoriteMangaDetail = jsonData => {
    jsonData.forEach(item => {
        const favorite = `
        <div class="manga-card">
            <p class="manga-title">${item.attributes.title}</p>
            <a class="btn" href="/series/${item.attributes.slug}">All Chapter</a>
        </div>
        `
        document.getElementById('favorite').innerHTML += favorite
    })
}

fetchFavoriteMangaList(displayFavoriteMangaDetail)