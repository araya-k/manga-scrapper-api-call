const mangaName = document.getElementById('title').textContent
const mangaChapter = document.getElementById('chapter').textContent

// Call the API to get manga list data
const fetchContentImages = (callback) => {
    fetch(`/allcontent/${mangaName}/${mangaChapter}`, {
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
const displayContent = jsonData => {
    jsonData.forEach(item => {
        const itemName = item.split('/').pop()
        const template = `<img src="${item}" alt="${mangaName} - ${mangaChapter} - ${itemName}">`
        document.getElementById('template-content').innerHTML += template
    })
}

fetchContentImages(displayContent)