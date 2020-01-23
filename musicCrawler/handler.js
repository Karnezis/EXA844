const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const {extractMusicsFromHTML} = require('./crawler');

module.exports.searchmusicpopularity = (event, context, callback) => {
  let allMusics, sertMusics, intMusics, sambaMusics, funkMusics, eletMusics, popMusics, rapMusics, forroMusics;
  let genMusics = [];
  request('https://maistocadas.mus.br/musicas-mais-tocadas/')
    .then(({data}) => {
      genMusics = extractMusicsFromHTML(data, 'Geral');
    })
  request('https://maistocadas.mus.br/musicas-sertanejas/')
    .then(({data}) => {
      sertMusics = extractMusicsFromHTML(data, 'Sertanejo');
    })
  request('https://maistocadas.mus.br/musicas-internacionais/')
    .then(({data}) => {
      intMusics = extractMusicsFromHTML(data, 'Internacional');
    })
  request('https://maistocadas.mus.br/pagode-samba/')
    .then(({data}) => {
      sambaMusics = extractMusicsFromHTML(data, 'Pagode');
    })
  request('https://maistocadas.mus.br/musicas-funks/')
    .then(({data}) => {
      funkMusics = extractMusicsFromHTML(data, 'Funk');
    })
  request('https://maistocadas.mus.br/musicas-eletronicas/')
    .then(({data}) => {
      eletMusics = extractMusicsFromHTML(data, 'Eletrônica');
    })
  request('https://maistocadas.mus.br/pop/')
    .then(({data}) => {
      popMusics = extractMusicsFromHTML(data, 'Pop Nacional');
    })
  request('https://maistocadas.mus.br/rap-hip-hop/')
    .then(({data}) => {
      rapMusics = extractMusicsFromHTML(data, 'Rap');
    })
  request('https://maistocadas.mus.br/forro/')
    .then(({data}) => {
      forroMusics = extractMusicsFromHTML(data, 'Forró');
    })
    .then(() => {
      allMusics = genMusics.concat(sertMusics,intMusics,sambaMusics,funkMusics,eletMusics,popMusics,rapMusics,forroMusics);
      //Salvar a lista de músicas mais populares hoje.
      setTimeout(() => {
        return dynamo.put({
          TableName: 'musicpopularity',
          Item: {
            listingId: new Date().toString(),
            musics: allMusics
          }
        }).promise();
      }, 3000);
    })
    .then(() => {
      callback(null, {musics: allMusics});
    })
    .catch(callback);
};
