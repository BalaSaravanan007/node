//simple WebServer

//importing modules
const http = require("http");
const fs = require("fs");
const url = require("url");

//replacing the placeholders in the templates using replaceTemplates function
const replaceTemplates = (temp, product) => {
  console.log(typeof temp);
  console.log(product);
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

//reading the data
const data = fs.readFileSync("./data.json", "utf-8");
//reading the templates
const Overview_temp = fs.readFileSync("./templates/overview.html", "utf-8");
const product_temp = fs.readFileSync("./templates/product.html", "utf-8");
const temp_cards = fs.readFileSync("./templates/cards.html", "utf-8");

//converting json string to java script
const dataObj = JSON.parse(data); // JSON.parse() method converts string to js

//Creating a Server

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj.map((obj) => replaceTemplates(temp_cards, obj));
    const output = Overview_temp.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //About Page
  } else if (pathname === "/about") {
    res.end("This is about creating a Server");

    //Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { Content: "text/html" });
    const output = replaceTemplates(product_temp, product);
    res.end(output);

    //API Page
  } else if (pathname === "/api") {
    res.setHeader("Content-Type", "application/json");
    res.end(data);

    //Error Page
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1 style='text-align:center;'>Page Not Found</h1>");
  }
});

server.listen(5500, () => {
  console.log("server running on local host: 127.0.0.1:5500");
}); // listen to the port 5500 and the hostname: 127.0.0.1
