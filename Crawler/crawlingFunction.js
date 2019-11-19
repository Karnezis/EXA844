var request = require('request');   // Requisita o pacote 'request' do servidor.
var cheerio = require('cheerio');   // Requisita o pacote 'cheerio' do servidor.
var fs = require('fs');             // Requisita o sistema de arquivos do servidor.

function crawlingMusic(url, genre) {
    request(url, function(err, res, body){
        if(err) console.log('Houve um erro. Este foi: ' + err); // Tratamento (bem básico) de erro;
        var $ = cheerio.load(body); // Usando o cheerio para pegar o corpo do site da web;
        var fileName = genre.concat('.txt'); // Atribuição de gênero (para função que escreve n arquivos);
    
        // Método de aquisição iterativo.
        $('.list li').each(function(){  // Para todas as <li> de classe "list", execute:
            // Encontre a classe 'marts' e coloque seu texto em 'title'.
            var title = $(this).find('.marts').text().trim();
            // Encontre a classe 'tits' e coloque seu texto em 'artist'.
            var artist = $(this).find('.mtits').text().trim();

            // Tira alguns caracteres a mais do Artista.
            //artist = artist.replace(/FEAT.|Ft.|Feat.|Part.|/gi, ',');

            // Debug.
            //console.log('Música ' + title + ' por ' + artist);
    
            //Função que escreve em cada arquivo separando os gêneros.
            /*fs.appendFile(fileName, title + '!' + artist + '\n', function erro(erro) {
                if(erro) console.log('Houve um erro ao escrever o arquivo.');
            });*/

            //Função que escreve o gênero juntamente com os atributos, todos num único arquivo.
            fs.appendFile('musicDatabase.txt', title + '!' + artist + '*' + genre + '\n', function erro(erro) {
                if(erro) console.log('Houve um erro ao escrever o arquivo.');
            });
        });
    });
}

// Chama o crawler para o gênero 'Geral'.
crawlingMusic('https://maistocadas.mus.br/musicas-mais-tocadas/', 'Geral');

// Chama o crawler para o gênero 'Sertanejo'.
crawlingMusic('https://maistocadas.mus.br/musicas-sertanejas/', 'Sertanejo');

// Chama o crawler para o gênero 'Internacionais'.
crawlingMusic('https://maistocadas.mus.br/musicas-internacionais/', 'Internacional');

// Chama o crawler para o gênero 'Gospel'.
crawlingMusic('https://maistocadas.mus.br/musicas-gospel/', 'Gospel');

// Chama o crawler para o gênero 'Pagode'.
crawlingMusic('https://maistocadas.mus.br/pagode-samba/', 'Pagode');

// Chama o crawler para o gênero 'Funk'.
crawlingMusic('https://maistocadas.mus.br/musicas-funks/', 'Funk');

// Chama o crawler para o gênero 'Eletrônica'.
crawlingMusic('https://maistocadas.mus.br/musicas-eletronicas/', 'Eletrônica');

// Chama o crawler para o gênero 'Pop Nacional'.
crawlingMusic('https://maistocadas.mus.br/pop/', 'Pop Nacional');

// Chama o crawler para o gênero 'Rap/Hip Hop'.
crawlingMusic('https://maistocadas.mus.br/rap-hip-hop/', 'Rap');

// Chama o crawler para o gênero 'Forró'.
crawlingMusic('https://maistocadas.mus.br/forro/', 'Forró');