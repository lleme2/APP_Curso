
const { MongoClient } = require("mongodb");
const uri = "mongodb://mongo:kLE9591apUXPdGLyayMu@containers-us-west-44.railway.app:7658"
//const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri);
require("dotenv").config();
const database = client.db('test');
const user = database.collection('users');

const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt");
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const mysql_pool = require('mysql2')
const pool = mysql_pool.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Acdcacdc16@',
    database: "xastreprojeto"
});

app.post('/signin', async (req, res) => {
    console.log(req.body);
    const dados = req.body;
    try {
        await client.connect();
        const query = {
          email: dados.email,
          senha: dados.password,
          cargo: dados.cargo,
          nome:  dados.nome
        }; 
        await user.insertOne(query);
        //console.log(user);
      } catch(e){
        console.log(e);
      }
      res.send('Sucessfull sign in!');
});

app.post('/login', async (req, res) => {

    const dados = req.body;
    console.log(dados);
    const ver_email = await user.findOne({email: dados.email});
      if(!ver_email){
        console.log("\nUsuario nao encontrado!")
      }
      else{
        console.log("\nEMAIL CORRETO")
        const ver_pass = await bcrypt.compare(dados.password, ver_email.senha);

        if(!ver_pass){
        console.log("\nSenha invalida!");
        }
        else{
        console.log("\nSENHA CORRETA, USUARIO LOGADO");
        }
       const token = jwt.sign({email: dados.email},process.env.SECRET);
       res.json({accessToken: token});
    }
});

// axios.post("localhdasda/auth/aluno")

app.post('/auth/aluno', async (req,res) => {

})

// banco de dados guitos

app.post('/newjob', async (req, res) => {
    const job = req.body;
    try {
        pool.connect(function(err) {
            if (err) throw err;
            //console.log("conectou");
        });
      
        //console.log(job);
      
        pool.query(`INSERT into job (JobTitle, Company, Activities, Requiriments, Salary, MaxNumber) values ('${job.JobTitle}','${job.JobCompany}','${job.JobActivities}','${job.JobRequiriments}','${job.JobSalary}','${job.JobMaxNumber}');`);
        /*pool.query(`SELECT * FROM xastreprojeto.job`, (err, result) => {
            return console.log(result);
        });*/
      
        /*pool.end(() => {
            console.log("Connection succesfully closed");
        });*/
      } catch(e){
        console.log(e);
      }
});

app.post('/editjob', async (req, res) => {
    const newjob = req.body;
    try {
        pool.connect(function(err) {
            if (err) throw err;
            //console.log("conectou");
        });
      
        var query = `UPDATE xastreprojeto.job SET JobTitle = ?, Company = ?, Activities = ?, Requiriments = ?, Salary = ?, MaxNumber = ? where JobTitle = ? and Company = ?`;
        pool.query(query, [newjob.newJobTitle, newjob.newJobCompany, newjob.newJobActivities, newjob.newJobRequiriments, newjob.newJobSalary, newjob.newJobMaxNumber, newjob.oldJobTitle, newjob.oldJobCompany]);
        
        console.log("Vaga alterada com sucesso");
        /*pool.end(() => {
            console.log("Connection succesfully closed");
        });*/ 
      } catch(e){
        console.log(e);
      }
});

app.post('/readjob', async (req, res) => {
  const readjob = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`SELECT * FROM xastreprojeto.job WHERE Company = '${readjob.Name}'`, (err, result) => {
          return console.log(result);
      });
      
    } catch(e){
      console.log(e);
    }
});

app.post('/deletejob', async (req, res) => {
  const DeleteJob = req.body;
  try {
      pool.connect(function(err) {
          if (err) throw err;
          //console.log("conectou");
      });

      pool.query(`Delete FROM xastreprojeto.job WHERE JobTitle = '${DeleteJob.JobName}' and Company = '${DeleteJob.JobCompany}'`, (err, result) => {
          return console.log(result);
      });

      console.log("Job succesfully deleted");
    } catch(e){
      console.log(e);
    }
});

app.post('/auth', (req,res) => {
    //console.log(req.headers)
    const token  = req.headers['authorization'];
    const accessToken = token.split(' ')[1]
    //console.log(process.env.SECRET)
    //console.log(accessToken);
    const verify = jwt.verify(accessToken, '12345');

    if(verify === null) res.status(401)

    res.json({status: 'Authorized!'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});