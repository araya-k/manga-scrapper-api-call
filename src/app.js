// Imports needed modules
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const getAllMangaList = require('./utils/getAllMangaList')
const getAllChapterList = require('./utils/getAllChapterList')
const getAllContentImages = require('./utils/getAllContentImages')
// const getAllFavoriteList = require('./utils/getAllFavoriteList')

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

// Creates base URL route "/" and renders index view
app.get('/', (req,res) => {
    res.render('manga', {
        title: 'Manga Reader',
    })
})

// Create all-manga list endpoint
app.get('/allmanga', async (req, res) => {
    try {
        const mangaDetails = await getAllMangaList.getAllManga()

        return res.json(mangaDetails.data)
    } catch(e) {
        console.log(e)

        return res.status(500).json({
            error: "Something went wrong"
        })
    }
})

/*app.get('/favorite', async (req, res) => {
    try {
        const favoriteDetails = await getAllFavoriteList.getAllFavorites()

        return res.json(favoriteDetails.data)
    } catch(e) {
        console.log(e)

        return res.status(500).json({
            error: "Something went wrong"
        })
    }
})*/

app.get('/series/:mangaID', async (req, res) => {
    const mangaID = req.params.mangaID
    const mangaTitleArray = mangaID.split('-')
    for (let i = 0; i < mangaTitleArray.length; i++) {
        mangaTitleArray[i] = mangaTitleArray[i].charAt(0).toUpperCase() + mangaTitleArray[i].slice(1).toLowerCase()
    }
    const mangaTitle = mangaTitleArray.join(' ')
    res.render('chapter', {
        title: mangaTitle
    })
})

app.get('/allchapter/:mangaID', async (req, res) => {
    const mangaID = req.params.mangaID
    try {
        const chapterDetails = await getAllChapterList.getAllChapter(mangaID)

        return res.json(chapterDetails.data)
    } catch(e) {
        console.log(e)

        return res.status(500).json({
            error: "Something went wrong"
        })
    }
})

app.get('/series/:mangaID/chapter/:chapterID', async (req, res) => {
    const mangaID = req.params.mangaID
    const chapterID = req.params.chapterID

    const mangaTitleArray = mangaID.split('-')
    for (let i = 0; i < mangaTitleArray.length; i++) {
        mangaTitleArray[i] = mangaTitleArray[i].charAt(0).toUpperCase() + mangaTitleArray[i].slice(1).toLowerCase()
    }
    const mangaTitle = mangaTitleArray.join(' ')
    const chapterTitle = `Chapter ${chapterID}`

    res.render('content', {
        title: mangaTitle,
        link: `${req.protocol}://${req.get('host')}/series/${mangaID}`,
        chapter: chapterTitle
    })
})

app.get('/allcontent/:mangaID/:chapterID', async (req, res) => {
    const mangaID = req.params.mangaID
    const chapterID = req.params.chapterID
    try {
        const chapterDetails = await getAllContentImages.getAllContent(mangaID, chapterID)

        return res.json(chapterDetails.data)
    } catch(e) {
        console.log(e)

        return res.status(500).json({
            error: "Something went wrong"
        })
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
