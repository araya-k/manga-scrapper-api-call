const mangaName = document.URL.split('/').reverse()[2]
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
    const contentSourceData = await fetchContentSourceUrl()
    const contentSourceUrl = await contentSourceData[0].content
    await contentSourceUrl.reduce(async (prev, i) => {
        await prev
        const url = `https://cdn.filestackcontent.com/AcjcqxtYTCGdeWpNrgnpaz/pjpg=quality:80/store/${i}`
        try {
            const res = await fetch(url)
            const compressedContentUrl = await res.json()
            const template = `<img src="${compressedContentUrl.url}" alt="${mangaName}-chapter-${mangaChapter}-${compressedContentUrl.filename}">`
            document.getElementById('template-content').innerHTML += template
        } catch (error) {
            alert('Encountered issues during compression process')
            console.log(error);
        }
    }, undefined)
    const nextChapterNumber = parseInt(mangaChapter) + 1
    nextChapter.href = `/series/${mangaName}/chapter/${nextChapterNumber}`
}

displayContent()