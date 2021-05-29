const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
// express library exposes a single function 
// express is a function oppose to an object and we call it to create a new express app

// both of these values are provided by the node wrapper function (remember from debugging)
// console.log(__dirname) // path directory name that the current script in
// console.log(__filename) // full path of current script 

console.log(path.join(__dirname, '../public')) //returns a file path, pass indivual peices of the path and it does the job of minipulating the string for us

//handle bars allows you to create dynamic web pages vs static ones and helps to create reusable templates (for ie header and footer)
// npm handlebars (handlebars module) doesn't work with express app
// npm hbs is like a plugin for express - uses handlebars and makes it easy to integrate w/ express

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
// /public is the only DIR set up to be exposed by the webb server so things like HTML, CS, and client side JS go ijn there
const publicDirPath = path.join(__dirname, '../public')
// the default dir for templates is views but you can customize it by telling express where it should look instead
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
// when using the view engine express expects all of the templates in a speciic folder in root of dir called veiws
// its fine to render plain static html if you don't need dynamic document
app.set('view engine', 'hbs')
app.set('views', viewsPath) //only need this if you don't use views for templates
hbs.registerPartials(partialPath)

// setup static dir to serve
app.use(express.static(publicDirPath)) //app.use() a way to customize your server

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
    }) // render allows to render on of the views- converts it to HTML to render to user
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        msg: 'You need it'
    })
})

//lets us configure what the server should do when someone tries to get the resource at a specific URL
// app.get('', (req, res) => {
    // res.send('<h1>Weather</h1>') // send something back to requester
// }) // once app.use is serving the index.html from public dir - this doesn't render anymore because express works through your app and once it finds a matching path it stops, meaning it doesn't get to this line for this path

// app.get('/help', (req, res) => {
//     res.send([
//         {name: 'Brittany'},
//         {name: 'Nick'}
//     ])
// })

// app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>')
// })

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Must provide address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forcast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

//Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
// get this error when trying to respond to the request twice
// can't have two res.send that run
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
        title: 'Help',
        msg: 'Help article not found'
    })
})

// match anything that hasn't been matched so far - must come last before listen
// when express gets an incoming request, it starts to look for a match in order in the file
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Not found',
        msg: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
})