const mangaName = document.URL.split('/').pop()

// Call the API to get manga list data
const fetchChapterList = (callback) => {
    fetch(`/allchapter/${mangaName}`, {
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
const displayChapterDetail = jsonData => {
    jsonData.forEach(item => {
        const template = `
        <a class="chapter-card" href="/series/${encodeURIComponent(mangaName)}/${encodeURIComponent(item.slug)}">Read ${item.title}</a>
        `
        document.getElementById('template').innerHTML += template
    })
}

fetchChapterList(displayChapterDetail)