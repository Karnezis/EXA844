const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const {extractMusicsFromHTML} = require('./crawler');
const {extractMusics} = require('./crawler_renew');

module.exports.searchmusicpopularity = (event, context, callback) => {
  let sertMusics, intMusics, sambaMusics, funkMusics, eletMusics, popMusics, rapMusics, forroMusics;
  let genMusics = [];
  let allMusics = [];
  request('https://maistocadas.mus.br/musicas-mais-tocadas/')
    .then(({data}) => {
      genMusics = extractMusics(data, 'Geral');
    })
  request('https://maistocadas.mus.br/musicas-sertanejas/')
    .then(({data}) => {
      sertMusics = extractMusics(data, 'Sertanejo');
    })
  request('https://maistocadas.mus.br/musicas-internacionais/')
    .then(({data}) => {
      intMusics = extractMusics(data, 'Internacional');
    })
  request('https://maistocadas.mus.br/pagode-samba/')
    .then(({data}) => {
      sambaMusics = extractMusics(data, 'Pagode');
    })
  request('https://maistocadas.mus.br/musicas-funks/')
    .then(({data}) => {
      funkMusics = extractMusics(data, 'Funk');
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
      let num = allMusics.length;
      callback(null, {num});
    })
    .catch(callback);
};
