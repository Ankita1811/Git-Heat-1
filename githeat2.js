var axios = require('axios');
var cheerio = require('cheerio');
var express = require('express');
var path = require('path');
var bodyParser=require('body-parser');
var app=express();

app.use('/Git-Heat week 1',express.static(__dirname + '/Git-Heat week 1'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.sendFile('index.html', {root : path.join(__dirname,'./Git-Heat week 1/')} )
}).listen(3000);


app.post('/done',function(req,res){

var trainnumber=req.body.number;    
var base_url = "https://erail.in/train-enquiry/"+trainnumber;

// A failed attempt to print. Results in untidy representation    
/*function print(data)
{
    var answer="";
    for(var i=0;i< data.length; i++)
    {
        var route=data[i].number+"             "+data[i].station+"            "+data[i].arrival+"             "+data[i].distance+"                 "+ "\n\n";
        answer= answer+ route;
    }
    res.end(answer);
}*/

var answer = [];
axios.get(base_url).then( (response) => {
  var $ = cheerio.load(response.data);
  
  $('tr', '.DataTable').each( (i, elm) => {
    answer.push( {
      number : $(elm).children().first().text(),
      station : $(elm).children().eq(1).text(),
      arrival: $(elm).children().eq(2).first().text(),
      distance :$(elm).children().eq(3).first().text()
    });
  });
  return(answer);
})
.then ( (answer) => {
  console.log(answer);
  app.set('view engine','ejs');
  res.render('demo',{data : answer});
});

});
