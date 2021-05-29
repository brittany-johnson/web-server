const request = require('postman-request')

// encodeURIComponent encodes special characters that may mean something in a URL so that the request doesn't fail 
// ie '?' becomes %3F
const geoCode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYnJpdHRhbnktam9obnNvbiIsImEiOiJja3AwaHJjb2gxMzgzMzJxcXlwOG9mMmFqIn0.XQbzXxv_U76H9Sd6SXJDeg&limit=1`

    request({ url, json: true}, (error, { body }) => {
        if (error) {
            // instead of logging it like above, we're passing the err msg back to the callback so that whereever geoCode is called, you can do different things with the error msg, like log to console, send to error reporting service, log, etc
            // for the second arg, you can either pass undefined Explicitly or put nothing, both are the same becuase if you put nothing JS will set to undefined automatically
            callback('Unable to connect to location services', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            const {center, place_name} = body.features[0]
            callback(undefined, {
                longitude: center[0],
                latitude: center[1],
                location: place_name
            })
        }
    })
}

module.exports =  geoCode