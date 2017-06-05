if ( process.argv.length < 4 ) {
	
	console.log (
		"\n" +
		"Call me like this:\n" +
		"\n" +
		"node app.js <latitude> <longitude>\n" +
		"\n" +
		"\n" +
		"Coordinates are in WGS 1984 decimal degrees.\n" +
		"\n" +
		"For example, Washington D.C.:\n" +
		"\n" +
		"node app.js 38.8951100 -77.0363700\n" +
		"\n" +
		"\n" +
		"Thanks!\n"
	);
	
	return;
	
}

var http = require ( "http" );

var util = require ( "util" );

var location = {
	lat: process.argv [ 2 ],
	lon: process.argv [ 3 ]
};

console.log (
	"\n" +
	"Checking NOAA 7-day hourly forecast for %s, %s...",
	location.lat,
	location.lon
);


function getWeatherData ( location, then ) {
	
	var expectedContentTypes = [ "application/json", "text/plain" ];
	
	http.get ( {
		hostname: "forecast.weather.gov",
		port: 80,
		path: "/MapClick.php?lat=" + location.lat + "&lon=" + location.lon + "&FcstType=digitalJSON",
		headers: {
			"User-Agent": "Mozilla/5.0 HowsTheWeather/0.1"
		},
		agent: false
	}, response => {
		
		var statusCode = response.statusCode;
		
		var contentType = response.headers [ "content-type" ];
		
		if ( statusCode != 200 ) {
			
			console.error ( `Error: status code: ${statusCode}` );
			
			response.resume ();
			
			return;
			
		} else if ( expectedContentTypes.filter ( expectedType => expectedType.indexOf ( contentType ) == 0 ).length ) {
			
			console.error ( `Error: http.get: content-type: \"${contentType}\"; expected \"${expectedContentTypes.join ( "\" or \"" )}\"` );
			
			response.resume ();
			
			return;
			
		}
		
		
		response.setEncoding ( "utf8" );
		
		var responseText = "";
		
		response.on ( "data", ( chunk ) => {
			
			responseText += chunk;
			
			console.log ( "Downloading (%d bytes)", responseText.length.toFixed ( 2 ) );
			
		} );
		
		response.on ( "end", () => {
			
			console.log ( "Downloaded (%d bytes)", responseText.length.toFixed ( 2 ) );
			
			try {
				
				var weatherData = JSON.parse ( responseText );
				
				//console.log ( "Weather data: %s", util.inspect ( weatherData ) );
				
				then ( weatherData );
				
			} catch ( e ) {
				
				console.error ( `Error: JSON: ${e.message}` );
				
			}
			
		} );
		
	} ).on ( "error", e => {
		
		console.error ( `Error: http.get: ${e.message}` );
		
	} );
	
}

function showWeather ( weatherData ) {
	
	//console.log ( "Weather data: %s", util.inspect ( weatherData ) );
	
	var periods = [];
	
	for ( var periodN in weatherData.PeriodNameList )
		
		periods [ periodN ] = weatherData.PeriodNameList [ periodN ];
	
	
	periods.forEach ( periodKey => {
		
		var period = weatherData [ periodKey ];
		
		if ( ! period ) return;
		
		console.log ( "\n" + period.periodName );
		
		period.time.forEach ( ( v,i,a ) => {
			
			console.log ( "%s, %s, %sF, %s% cloudy, %s% rain, %s% humid, wind %smph %s",
				period.time [ i ],
				period.weather [ i ],
				period.temperature [ i ],
				period.cloudAmount [ i ],
				period.pop [ i ],
				period.relativeHumidity [ i ],
				period.windSpeed [ i ],
				period.windDirectionCardinal [ i ],
				period.windGust [ i ] != "null" ? ", " + period.windGust [ i ] + " gusts" : ""
			);
			
		} );
		
	} );
	
}

function start ( location ) {
	
	getWeatherData ( location, showWeather );
	
}

start ( location );