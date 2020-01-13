const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const {extractMusicsFromHTML} = require('./crawler');

module.exports.searchmusicpopularity = (event, context, callback) => {
  let allMusics;
  request('https://maistocadas.mus.br/musicas-mais-tocadas/')
    .then(({data}) => {
      allMusics = extractMusicsFromHTML(data, 'Geral');
    })
    .then(() => {
      //Salvar a lista de músicas mais populares hoje.
      return dynamo.put({
        TableName: 'musicpopularity',
        Item: {
          listingId: new Date().toString(),
          musics: allMusics
        }
      }).promise();
    })
    .then(() => {
      callback(null, { musics: allMusics });
    })
    .catch(callback);
};
