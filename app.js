const fs= require('fs')
const http = require('http')
const url = require('url')
const superagent = require("superagent")

var data=fs.readFileSync(`${__dirname}/data.json`,'utf-8');
var jsondata=JSON.parse(data);
var card=fs.readFileSync(`${__dirname}/card.html`,'utf-8');
var oview=fs.readFileSync(`${__dirname}/overview.html`,'utf-8');
var product=fs.readFileSync(`${__dirname}/product.html`,'utf-8');

function replaceOver(card,element){
    let output=card.replace(/{%PRODUCTNAME%}/g,element.productName);
    output=output.replace(/{%IMAGE%}/g,element.image);
    output=output.replace(/{%QUANTITY%}/g,element.quantity);
    output=output.replace(/{%PRICE%}/g,element.price);
    output=output.replace(/{%NUTRIENTS%}/g,element.nutrients);
    output=output.replace(/{%DISC%}/g,element.description);
    output=output.replace(/{%ID%}/g,element.id);
    output=output.replace(/{%PLACE%}/g,element.from);
    
    if(!element.organic) output=output.replace(/{%NOTORGANIC%}/g,"not-organic");
    return output;
}
var server = http.createServer((req,res)=>{
    const { query, pathname } = url.parse(req.url, true);
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
          'Content-type': 'text/html'
        });

        const cardObj = jsondata.map(el=>replaceOver(card,el)); 
        //console.log(cardObj).join(" ");
        const final = oview.replace(/{%PRODUCT_CARDS%}/g,cardObj)
       res.end(final);
        
    
        // Product page
      } else if (pathname === '/product') {
        res.writeHead(200, {
          'Content-type': 'text/html'
        });
        const el = jsondata[query.id];
        const cardObj = replaceOver(product,el); 
       res.end(cardObj);
    
        // API
      } else if (pathname === '/api') {
        res.writeHead(200, {
          'Content-type': 'application/json'
        });
       // console.log(data);
        res.end(data);
    
        // Not found
      } else {
        res.writeHead(404, {
          'Content-type': 'text/html',
          'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
      }
});

server.listen(3000,()=>{
    console.log("listerning ......");
})