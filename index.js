const express = require('express');
const server = express();

server.use(express.json());

/******* Redis *******/

const redis = require('redis');
const dbClient = redis.createClient();

dbClient.on('connect', () => {
 console.log('Conexao com o REDIS OK!'); 
});
 
dbClient.on('error', (e) => {
 console.log('Erro na Conexao com o REDIS', e);
});

//Dados iniciais do banco de dados
const pessoas = ['José', 'João', 'Maria', 'Catarina'];
dbClient.rpush('pessoas', pessoas, function (err, reply) {
    console.log(reply); 
  });


/******* Rotas *******/

//Utilizando banco de dados em memoria
server.get('/pessoas', (req, res) => {
  dbClient.lrange('pessoas', 0, -1, function (err, reply) {
    return res.json(reply);
  });
})

//Utilizando banco de dados em memoria
server.get('/pessoas/:index', checkPessoaInArray, (req, res) => {
  dbClient.lrange('pessoas', req.params.index, req.params.index, function (err, reply) {
    return res.json(reply);
  });
})

server.post('/pessoas', (req, res) => {
  const { name } = req.body; 
  pessoas.push(name);
  return res.json([pessoas]);
})

server.put('/pessoas/:index', (req, res) => {
  const { index } = req.params;
  const { nome } = req.body;

  pessoas[index] = nome; // sobrepõe o index obtido na rota de acordo com o novo valor

  return res.json(pessoas);
}); 


server.delete('/pessoas/:index', (req, res) => {
  const { index } = req.params; // recupera o index com os dados
  pessoas.splice(index, 1); // percorre o vetor até o index selecionado e deleta uma posição no array
}); 


/******* Middlewares *******/

server.use((req, res, next) => { // server.use cria o middleware global
  console.time('Request'); // marca o início da requisição
  console.log(`Método: ${req.method}; URL: ${req.url}; `); // retorna qual o método e url foi chamada

  next(); // função que chama as próximas ações 

  console.log('Finalizou'); // será chamado após a requisição ser concluída

  console.timeEnd('Request'); // marca o fim da requisição
});

  
function checkPessoaInArray(req, res, next) {
  const pessoa = pessoas[req.params.index];
  if (!pessoa) {
    return res.status(400).json({ error: 'Pessoa nao localizada' });
  } 
  req.pessoa = pessoa;  
  return next();
}


server.listen(3000);