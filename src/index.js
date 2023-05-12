const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');
const { data } = require('./data');

app.get('/totalRecovered', async function(req, res){
    let arr = [];
    data.forEach(data =>{
        arr.push(data.recovered)
    })
    recover = arr.reduce((a, b) => a + b, 0);
    await res.status(200).json({data:{'_id':"Total", recovered : recover}});
})

app.get('/totalActive', async function(req,res){
    let arr =[]; 
    for(let i=0;i<data.length;i++){
      active =(data[i]['infected']- data[i]['recovered']);
      arr.push(active);
    }
    active = arr.reduce((a, b) => a + b, 0);
    await res.status(200).json({data:{'_id':"Total", active : active}});
})


app.get('/totalDeath', async function(req,res){
    let arr = [];
    data.forEach(data =>{
        arr.push(data.death)
    })
    deathTotal = arr.reduce((a, b) => a + b, 0);
    await res.status(200).json({data:{'_id':"Total", death : deathTotal}});
})

app.get('/hotspotStates', async function(req,res){
    let arr = [];
    for(let i=0;i<data.length;i++){
       rate = (data[i]['infected']- data[i]['recovered'])/data[i]['infected'];
       arr.push(rate); 
    }
    let hot = []
    for(let i=0;i<arr.length;i++){
        if(arr[i]>0.1){
            hot.push({state : data[i].state, rate : arr[i]})
        }
    }

    await res.status(200).json({data : [hot]});
})

app.get('/healthyStates',async function(req,res){
    let arr=[];
    for(let i=0;i<data.length;i++){
        mortality = (data[i]['death']/data[i]['infected']);
        arr.push(mortality);
    }
    let mortal = [];
    for(let i=0;i<arr.length;i++){
        if(arr[i]<0.05){
            mortal.push({state : data[i].state, rate : arr[i]})
        }
    }
    await res.status(200).json({data : [mortal]});
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;