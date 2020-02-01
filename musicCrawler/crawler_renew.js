const cheerio = require('cheerio');

function extractMusics(html, genre) {
    const $ = cheerio.load(html);
    const musics = [];
    $('ol li').each(function () {  // Para todas as <ol>, execute:
        // Encontre a classe 'musicas' e coloque seu texto em 'title', a ser filtrado posteriormente.
        var title = $(this).find('.musicas').text().trim(); //Pega todo o título da música.
        var views = $(this).find('.views').text().trim(); //Pega todos os views da música.
        // Encontre a classe 'artista' e coloque seu texto em 'artist'.
        var artist = $(this).find('.artista').text().trim();
        musics.push({ title, artist, views, genre });
    });
    return musics;
}

module.exports = {
    extractMusics
};