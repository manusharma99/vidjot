const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
 
// index route

app.get('/', (req,res) => {
    const title = 'WELCOME';
 res.render('index' , {title:title});
});

app.get('/about', (req,res) => {
    res.render('about');
   });

const port = 5000;
app.listen(port, () => {
    console.log('server started on port ' + port);
});