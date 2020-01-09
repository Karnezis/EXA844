var request = require('request');   // Requisita o pacote 'request' do servidor.
var cheerio = require('cheerio');   // Requisita o pacote 'cheerio' do servidor.
var fs = require('fs');             // Requisita o sistema de arquivos do servidor.
var AWS = require('aws-sdk');       // Requisita a biblioteca AWS SDK para Node.js.

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

function crawlingMusic(url, genre) {
    request(url, function (err, res, body) {
        if (err) console.log('Houve um erro. Este foi: ' + err); // Tratamento (bem básico) de erro;
        var $ = cheerio.load(body); // Usando o cheerio para pegar o corpo do site da web;
        var fileName = genre.concat('.txt'); // Atribuição de gênero (para função que escreve n arquivos);

        // Método de aquisição iterativo.
        $('.list li').each(function () {  // Para todas as <li> de classe "list", execute:
            // Encontre a classe 'marts' e coloque seu texto em 'title', a ser filtrado posteriormente.
            var title = $(this).find('.marts').text().trim(); //Pega todo o título da música e sua posição.
            var compos = title.split(".");//Separa a posição do título da música.
            var position = compos[0];//Pega a posição que aquela música ocupa.
            title = title.replace(position + '. ', "");//Remove a posição do título da música.
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
            //fs.appendFile('musicDatabase.txt', title + '*' + position + '*' + artist + '*' + genre + '\n', function erro(erro) {
            //    if (erro) console.log('Houve um erro ao escrever o arquivo.');
            //});

            //Função que escreve a entrada na tabela do DynamoDB.
            AWS.config.update({region:'us-east-1'});
            AWS.config.update({endpoint: "https://dynamodb.us-west-1.amazonaws.com"});
            var docClient = new AWS.DynamoDB.DocumentClient();
            var table = "MUSIC_POPULARITY";
            var ID = getRandomInt(0,999999999);
            var params = {
                TableName: table,
                Item: {
                    "MUSIC_ID": ID,
                    "title": title,
                    "position": position,
                    "artist": artist,
                    "gênero": genre
                }
            };

            console.log("Adding a new item...");
            docClient.put(params, function (err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });
        });
    });
}

// Chama o crawler para o gênero 'Geral'.
crawlingMusic('https://maistocadas.mus.br/musicas-mais-tocadas/', 'Geral');

// Chama o crawler para o gênero 'Sertanejo'.
//crawlingMusic('https://maistocadas.mus.br/musicas-sertanejas/', 'Sertanejo');

// Chama o crawler para o gênero 'Internacionais'.
//crawlingMusic('https://maistocadas.mus.br/musicas-internacionais/', 'Internacional');

// Chama o crawler para o gênero 'Gospel'.
//crawlingMusic('https://maistocadas.mus.br/musicas-gospel/', 'Gospel');

// Chama o crawler para o gênero 'Pagode'.
//crawlingMusic('https://maistocadas.mus.br/pagode-samba/', 'Pagode');

// Chama o crawler para o gênero 'Funk'.
//crawlingMusic('https://maistocadas.mus.br/musicas-funks/', 'Funk');

// Chama o crawler para o gênero 'Eletrônica'.
//crawlingMusic('https://maistocadas.mus.br/musicas-eletronicas/', 'Eletrônica');

// Chama o crawler para o gênero 'Pop Nacional'.
//crawlingMusic('https://maistocadas.mus.br/pop/', 'Pop Nacional');

// Chama o crawler para o gênero 'Rap/Hip Hop'.
//crawlingMusic('https://maistocadas.mus.br/rap-hip-hop/', 'Rap');

// Chama o crawler para o gênero 'Forró'.
//crawlingMusic('https://maistocadas.mus.br/forro/', 'Forró');