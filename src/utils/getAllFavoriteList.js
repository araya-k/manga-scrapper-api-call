const axios = require('axios')

const BASE_URL = 'https://api.manga.suputranike.site/favorite'

module.exports = {
    getAllFavorites: () =>axios({
        method: 'GET',
        url: BASE_URL
    })
}