const mangaName = document.URL.split('/').reverse()[1]
const mangaChapter = document.URL.split('/').pop()
const nextChapter = document.getElementById('next-chapter')

async function fetchContentSourceUrl() {
    const url = `/allcontent/${mangaName}/${mangaChapter}`
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        alert('API Could not be reached at this time')
        console.log(error);
    }
}

async function displayContent() {
    const contentSourceUrl = await fetchContentSourceUrl()
    await contentSourceUrl.reduce(async (prev, i) => {
        await prev
        const url = `https://cdn.filestackcontent.com/AcjcqxtYTCGdeWpNrgnpaz/pjpg=quality:80/store/${i}`
        try {
            const res = await fetch(url)
            const compressedContentUrl = await res.json()
            const template = `<img src="${compressedContentUrl.url}" alt="${mangaChapter} - ${compressedContentUrl.filename}">`
            document.getElementById('template-content').innerHTML += template
        } catch (error) {
            alert('Encountered issues during compression process')
            console.log(error);
        }
    }, undefined)
    const chapterNumber = mangaChapter.split('-').pop()
    const nextChapterNumber = parseInt(chapterNumber) + 1
    const nextChapterSlug = mangaChapter.split('-').slice(0, -1).concat(nextChapterNumber).join('-')
    nextChapter.href = `/series/${mangaName}/${nextChapterSlug}`
}

displayContent()