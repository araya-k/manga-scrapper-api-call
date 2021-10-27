const mangaName = document.URL.split('/').reverse()[1]
const mangaChapter = document.URL.split('/').pop()
const nextChapter = document.getElementById('next-chapter')

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
        const template = `<img src="${item}" alt="${mangaChapter} - ${itemName}">`
        document.getElementById('template-content').innerHTML += template
    })
    const chapterNumber = mangaChapter.split('-').pop()
    const nextChapterNumber = parseInt(chapterNumber) + 1
    const nextChapterSlug = mangaChapter.split('-').slice(0, -1).concat(nextChapterNumber).join('-')
    nextChapter.href = `/series/${mangaName}/${nextChapterSlug}`
}

fetchContentImages(displayContent)