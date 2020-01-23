const cheerio = require('cheerio');

function extractMusicsFromHTML(html, genre) {
    const $ = cheerio.load(html);
    const musics = [];
    $('.list li').each(function () {  // Para todas as <li> de classe "list", execute:
        // Encontre a classe 'marts' e coloque seu texto em 'title', a ser filtrado posteriormente.
        var title = $(this).find('.marts').text().trim(); //Pega todo o título da música e sua posição.
        var compos = title.split(".");//Separa a posição do título da música.
        var position = compos[0];//Pega a posição que aquela música ocupa.
        title = title.replace(position + '. ', "");//Remove a posição do título da música.
        // Encontre a classe 'tits' e coloque seu texto em 'artist'.
        var artist = $(this).find('.mtits').text().trim();
        musics.push({ title, artist, position, genre });
    });
    return musics;
}

module.exports = {
    extractMusicsFromHTML
};