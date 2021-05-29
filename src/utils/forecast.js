const request = require('postman-request')

function forecast(lat, long, callback) {
    const url = `http://api.weatherstack.com/current?access_key=6a116f84d7019c60bebe0f6c16bad5b8&query=${lat},${long}&units=f`

    request( {url, json: true}, (error, { body }) => {
        if(error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            const {temperature, feelslike, weather_descriptions} = body.current
            const msg = `${weather_descriptions[0]}. It's currently ${temperature} degrees and feels like ${feelslike} degrees.`
            callback(undefined, msg)
        }
    })
}

module.exports = forecast