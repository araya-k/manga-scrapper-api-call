// Imports needed modules
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const getAllMangaList = require('./utils/getAllMangaList')
const getMangaData = require('./utils/getMangaData')
const getAllChapterList = require('./utils/getAllChapterList')
const getAllContentImages = require('./utils/getAllContentImages')

// Loads env variables
require('dotenv').config()

// Creates app
const app = express()

// Adds json parsing middleware
app.use(express.json())

// Initializes application port
const port = process.env.PORT || 8080

// Define paths for Express config
const viewsPath = path.join(__dirname,'./templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')))

const allMangaData = []
const homeMangaList = []
const homeMangaData = []

async function getAllMangaData() {
    try {
        const allMangaRequest = await getAllMangaList.getAllManga()
        console.log(`Fetching all manga list`)
        const allMangaList = allMangaRequest.data
        allMangaData.push(allMangaList)
        return allMangaData
    }
    catch (err) {
        console.error(err)
    }
}

async function mangaListForHome() {
    const favoriteManga = [25, 26, 27, 28, 32, 33, 35, 39, 42, 43, 44, 51, 53, 57, 60, 64, 63, 74]
    try {
        const allMangaList = await getAllMangaData()
        const allMangaListObject = allMangaList[0]
        for (const manga of allMangaListObject) {
            if (favoriteManga.includes(manga.id)) {
                homeMangaList.push(manga)
            }
        }
        return homeMangaList
    }
    catch (err) {
        console.error(err)
    }
}

async function mangaDataForHome() {
    const mangaRequest = await mangaListForHome()
    for (const manga of mangaRequest) {
        const titleRequest = manga.attributes.title
        const urlRequest = manga.attributes.slug
        try {
            const mangaRequest = await getMangaData.getAllData(urlRequest)
            console.log(`Fetching manga data for ${titleRequest}`)
            const mangaData = mangaRequest.data
            homeMangaData.push(mangaData)
        }
        catch (err) {
            console.error(err)
        }
    }
}
mangaDataForHome()

// Creates base URL route "/" and renders index view
app.get('/', (req,res) => {
    res.render('manga', {
        title: 'Manga Reader',
    })
})

// Create all-manga list endpoint
app.get('/allmanga', async (req, res) => {
    console.log(`Handling request from /allmanga`)
    await res.json(homeMangaData)
})

app.get('/series/:mangaSlug', async (req, res) => {
    const mangaSlug = req.params.mangaSlug
    const allMangaDataObject = await allMangaData[0]
    const specificMangaRequest = allMangaDataObject.filter(manga => manga.attributes.slug == mangaSlug)
    if (specificMangaRequest.length === 0) {
        res.render('404', {
            title: 'Requested Manga Not Found'
        })
    }
    const foundManga = specificMangaRequest[0]
    const mangaTitle = foundManga.attributes.title
    res.render('chapter', {
        title: mangaTitle
    })
})

app.get('/allchapter/:mangaSlug', async (req, res) => {
    const mangaSlug = req.params.mangaSlug
    console.log(`Handling request from /allchapter/${mangaSlug}`)
    const allMangaDataObject = await allMangaData[0]
    const specificMangaRequest = allMangaDataObject.filter(manga => manga.attributes.slug == mangaSlug)
    if (specificMangaRequest.length === 0) {
        return res.status(404).json({error: "Requested Manga Not Found"})
    }
    try {
        const chapterDetails = await getAllChapterList.getAllChapter(mangaSlug)
        return res.json(chapterDetails.data)
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({error: "Something went wrong"})
    }
})

app.get('/series/:mangaSlug/chapter/:chapterID', async (req, res) => {
    const mangaSlug = req.params.mangaSlug
    const chapterID = req.params.chapterID
    const allMangaDataObject = await allMangaData[0]
    const specificMangaRequest = allMangaDataObject.filter(manga => manga.attributes.slug == mangaSlug)
    if (specificMangaRequest.length === 0) {
        res.render('404', {
            title: 'Requested Manga Not Found'
        })
    }
    const foundManga = specificMangaRequest[0]
    const mangaTitle = foundManga.attributes.title
    const chapterDetails = await getAllChapterList.getAllChapter(mangaSlug)
    const chaptersData = chapterDetails.data
    const specificChapterRequest = chaptersData.filter(chapter => chapter.id == chapterID)
    if (specificChapterRequest.length === 0) {
        res.render('404', {
            title: 'Requested Chapter Not Found'
        })
    }
    const chapterTitle = `Chapter ${chapterID}`

    res.render('content', {
        title: mangaTitle,
        link: `${req.protocol}://${req.get('host')}/series/${mangaSlug}`,
        chapter: chapterTitle
    })
})


app.get('/allcontent/:mangaSlug/:chapterID', async (req, res) => {
    const mangaSlug = req.params.mangaSlug
    const chapterID = req.params.chapterID
    console.log(`Handling request from /allcontent/${mangaSlug}/${chapterID}`)
    const allMangaDataObject = await allMangaData[0]
    const specificMangaRequest = allMangaDataObject.filter(manga => manga.attributes.slug == mangaSlug)
    if (specificMangaRequest.length === 0) {
        return res.status(404).json({error: "Requested Manga Not Found"})
    }
    const chapterDetails = await getAllChapterList.getAllChapter(mangaSlug)
    const chaptersData = chapterDetails.data
    const specificChapterRequest = chaptersData.filter(chapter => chapter.id == chapterID)
    if (specificChapterRequest.length === 0) {
        return res.status(404).json({error: "Requested Manga Not Found"})
    }
    try {
        const chapterContent = await getAllContentImages.getAllContent(mangaSlug, chapterID)
        return res.json(chapterContent.data)
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({error: "Something went wrong"})
    }
})


// Catch all route, renders 404 page
app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Not Found'
    })
})

// Directs app to listen on port specified previously
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
