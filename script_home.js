var cityData = {
    "tokyo": {
        coords: { latitude: 35.6895, longitude: 139.6917 },
        name: "Tokyo",
        location: "Tokyo is one of the world's largest metropolitan areas, famous for its efficient public transport system and the iconic Shibuya crossing, where tradition and modernity blend.",
        hardFact: "Tokyo Bay is an important fishing and shipping hub on the western Pacific coast. The city's electricity supply relies heavily on thermal power generation.",
    },
    "newyork": {
        coords: { latitude: 40.7128, longitude: -74.0060 },
        name: "New York",
        location: "Known as the 'Crossroads of the World,' New York features iconic landmarks like the Statue of Liberty and Central Park, serving as a global center for finance, culture, and media.",
        hardFact: "New York City faces risks of coastal flooding due to climate change and operates one of the world's busiest subway systems, carrying millions of passengers daily.",
    },
    "paris": {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        name: "Paris",
        location: "Paris, the famous 'City of Light' and fashion capital, attracts global tourists with the Eiffel Tower, the Louvre, and the romantic atmosphere along the Seine River.",
        hardFact: "Paris is actively promoting bicycle transit to reduce urban pollution. It also has a complex system of ancient catacombs beneath the city.",
    },
    "london": {
        coords: { latitude: 51.5074, longitude: 0.1278 },
        name: "London",
        location: "London boasts a long history, is the seat of the British monarchy, and features iconic sites like Big Ben and the Tower of London, running along the River Thames.",
        hardFact: "The Thames Estuary in London is constantly subject to tidal influences, requiring the use of the massive Thames Barrier to protect the city from flooding.",
    },
    "beijing": {
        coords: { latitude: 39.9042, longitude: 116.4074 },
        name: "Beijing",
        location: "Beijing, the capital of China, is home to World Heritage Sites like the Forbidden City and the Great Wall, representing a blend of historical culture and modern development.",
        hardFact: "Beijing faces tight water resources, with many reservoirs located in the suburbs. The city has recently focused on air pollution control to improve air quality.",
    },
    "sydney": {
        coords: { latitude: -33.8688, longitude: 151.2093 },
        name: "Sydney",
        location: "Sydney is Australia's largest city, famous for the Sydney Opera House and Harbour Bridge, and enjoys a unique beach lifestyle.",
        hardFact: "Sydney's natural environment is close to bushland, facing the threat of bushfires during the summer. Drinking water primarily relies on reservoirs.",
    }
};

var cities = document.querySelectorAll('.city');
var weatherBox = document.querySelector('.top-left');
var locationBox = document.querySelector('.top-right');
var hardFactBox = document.querySelector('.bottom-left');
var treeVisual = document.querySelector('.tree-visual img');
var weather = document.querySelector('.weather-visual');

function getWeatherConditionInfo(currentData) {
    var rain = currentData.rain;
    var snowfall = currentData.snowfall; 
    var windSpeed = currentData.wind_speed_10m; 
    var cloudCover = currentData.cloud_cover;

    if (snowfall > 0.1) {
        return 'Snowy'; 
    }

    if (rain > 0.5) {
        return 'Rainy'; 
    }
    
    if (windSpeed > 30) {
        return 'Windy'; 
    }

    if (cloudCover < 20) {
        return 'Clear Sky'; 
    } else if (cloudCover >= 80) {
        return 'Overcast'; 
    } 
}

function topLeftWeather(currentData, cityName) {
    var temperature = currentData.temperature_2m; //2米以上的温度
    var unit = '°C';
    var weatherCondition = getWeatherConditionInfo(currentData);
    var weatherContent = "";
    weatherContent += '<p><strong>' + cityName + '</strong></p>';
    weatherContent += '<p>Current Status: ' + weatherCondition + '</p>';
    weatherContent += '<p>Current Temp: ' + temperature + unit + '</p>';
    
    return weatherContent;
}

function getWeatherBackground(currentData) {
    var rain = currentData.rain; 
    var snowfall = currentData.snowfall; 
    var windSpeed = currentData.wind_speed_10m;
    var cloudCover = currentData.cloud_cover;

    if (snowfall > 0.1) {
        return 'snowy.png';
    }

    if (rain > 0.5) {
        return 'rainy.png';
    }
    
    if (windSpeed > 30) {
        return 'windy.png';
    }

    if (cloudCover < 20) {
        return 'sunny.png';
    } else if (cloudCover >= 80) {
        return 'cloudy.png';
    } 
}

function getTreeImage(temperature) {
    if (temperature >= 25) {
        return 'summertree.png'; 
    } else if (temperature >= 15) {
        return 'springtree.png'; 
    } else if (temperature >= 5) {
        return 'autumntree.png'; 
    } else {
        return 'wintertree.png';
    }
}


async function changeCity(cityKey) {
    var city = cityData[cityKey];

    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + city.coords.latitude + 
              '&longitude=' + city.coords.longitude + 
              '&current=temperature_2m,wind_speed_10m,cloud_cover,rain,snowfall&temperature_unit=celsius&timezone=auto';

    try {
        var response = await fetch(url);
        var jsonData = await response.json(); 
        var currentTemp = jsonData.current.temperature_2m; 
        var currentData = jsonData.current;

        weatherBox.innerHTML = topLeftWeather(currentData, city.name);//左上角天气文字

        treeVisual.src = getTreeImage(currentTemp);//树更新

        var backgroundFileName = getWeatherBackground(currentData);
        weather.style.backgroundImage = 'url(' + backgroundFileName + ')';

    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        weatherBox.innerHTML = '<p>Weather data failed to load.</p>';
        treeVisual.src = 'tree.png'; 
        weather.style.backgroundImage = 'none'; 
    }//以防api无法连接失效，所以有这句code 会自动出来一棵树

    var locationContent = "";
    locationContent += '<p><strong>Location</strong></p>';
    locationContent += '<p>' + city.location + '</p>';
    locationBox.innerHTML = locationContent;

    var hardFactContent = "";
    hardFactContent += '<p><strong>Hard Fact</strong></p>';
    hardFactContent += '<p>' + city.hardFact + '</p>';
    hardFactBox.innerHTML = hardFactContent;
}


function onClickCity(event) {
    var cityKey = event.currentTarget.getAttribute('data-city'); // 获取城市

    cities.forEach(function(item) {
        item.querySelector('img').src = 'location.png';//未被点击的设置
    });

    event.currentTarget.querySelector('img').src = 'selected.png';//被点击

    changeCity(cityKey);
}

function init() {
    cities.forEach(function(item) {
        item.addEventListener('click', onClickCity);
    });//设置点击功能

    var urlParams = new URLSearchParams(window.location.search);
    var initialCityKey = urlParams.get('city') || 'tokyo';//默认显示东京如果网址没有打出来

    var initialPlace = document.querySelector('.city[data-city="' + initialCityKey + '"]');

    if (initialPlace) {
        cities.forEach(function(item) {
            item.querySelector('img').src = 'location.png';///设置未选中的
        });

        initialPlace.querySelector('img').src = 'selected.png';//只把初始城市设为selected

        changeCity(initialCityKey);
    }
}

// 启动程序
document.addEventListener('DOMContentLoaded', init);