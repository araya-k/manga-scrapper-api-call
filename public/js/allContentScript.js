const mangaName = document.URL.split('/').reverse()[2]
const mangaChapter = document.URL.split('/').pop()
const nextChapter = document.getElementById('next-chapter')
const loader = document.getElementById('loader')

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
    loader.style.display = 'block'
    const contentSourceData = await fetchContentSourceUrl()
    const contentSourceUrl = await contentSourceData[0].content
    try {
        await contentSourceUrl.reduce(async (prev, i) => {
            await prev
            const url = `https://cdn.filestackcontent.com/AcjcqxtYTCGdeWpNrgnpaz/pjpg=quality:80/store/${i}`
            const res = await fetch(url)
            if (res.status !== 200) {
                const urlBackup = `https://cdn.filestackcontent.com/ADQyp66f8SG6PlRWd2pIQz/pjpg=quality:80/store/${i}`
                const resBackup = await fetch(urlBackup)
                if  (resBackup.status !== 200) {
                    const template = `<img src="${i}" alt="${mangaName}-chapter-${mangaChapter}-${i.split('/').pop()}">`
                    loader.style.display = 'none'
                    document.getElementById('template-content').innerHTML += template
                } else {
                    const compressedContentUrl = await resBackup.json()
                    const template = `<img src="${compressedContentUrl.url}" alt="${mangaName}-chapter-${mangaChapter}-${compressedContentUrl.filename}">`
                    loader.style.display = 'none'
                    document.getElementById('template-content').innerHTML += template
                }
            } else {
                const compressedContentUrl = await res.json()
                const template = `<img src="${compressedContentUrl.url}" alt="${mangaName}-chapter-${mangaChapter}-${compressedContentUrl.filename}">`
                loader.style.display = 'none'
                document.getElementById('template-content').innerHTML += template
            }
        }, undefined)
    } catch (error) {
        alert('Encountered issues while trying to fetch images')
        console.log(error);
    }
    const nextChapterNumber = parseInt(mangaChapter) + 1
    nextChapter.href = `/series/${mangaName}/chapter/${nextChapterNumber}`
}

displayContent()