//запускать с лайв сервера
const selector = document.querySelector('select');
const input = document.getElementById('inp');
const search = document.getElementById('searchBtn');
const spisokEl = document.querySelectorAll('li');
const info = document.getElementById('city-info');
const temperature = document.getElementById('temperature');
const pogodi = document.querySelectorAll('.pogodi');
const dynamicSpisok = document.getElementById('spisok');
const geoBtn = document.querySelector('button');

let gorod = "";
let lat1 = 0;
let lon1 = 0;

DownloadCities()

async function DownloadCities() 
{
    let cities = await fetch('cities/russian-cities.json');
    let data = await cities.json();
    for(let i = 0; i < data.length; i++)
    {
        let city = document.createElement('option');
        city.innerText = data[i].name;
        selector.appendChild(city);
        let searchCity = document.createElement('li');
        searchCity.innerText = data[i].name;
        dynamicSpisok.appendChild(searchCity);
        dynamicSpisok.children[i].style.display = 'none';
    }  


    function CloseIcons()
    {
        pogodi.forEach(el => el.style.display = 'none');
    }

    input.addEventListener('input', Search)

    let ListElement = dynamicSpisok.children;
    function Search()
    {
        let item;
        for(let i = 0; i < ListElement.length; i++)
        {
            
            if(ListElement[i].innerText.toLowerCase().startsWith(input.value.toLowerCase()) && input.value !== "")
            {
                ListElement[i].style.display = 'block';

                    if(ListElement[i].innerText == data[i].name)
                    {
                    
                    lat1 = Number(data[i].coords.lat);
                    lon1 = Number(data[i].coords.lon);
                    gorod = data[i].name;    
                    }
            }
            else
            {
                ListElement[i].style.display = 'none';

            }
            
        }
    }
    for(let j = 0; j < ListElement.length; j++)
    {
            ListElement[j].addEventListener('mouseover', function() { ListElement[j].classList.add("Hselector") })
            ListElement[j].addEventListener('mouseout', function() { ListElement[j].classList.remove("Hselector") })

            ListElement[j].addEventListener('click', function() { 
                findCity(); 

                ListElement[j].classList.add("Hselector-for-click")
            });
    }
    
    async function findCity()
    {
        const weatherData = `https://api.openweathermap.org/data/2.5/weather?lat=${lat1}&lon=${lon1}&appid=df37d6ea911fd6c24034793c7afde041`;
                    
        let dataW = await fetch(weatherData);
        let vivod = await dataW.json();
            if(vivod.weather[0].main == 'Clouds')
            {
                CloseIcons()
                document.getElementById('clouds').style.display = "inline-block";
            }
            if(vivod.weather[0].main == 'Clear')
            {
                CloseIcons()
                document.getElementById('sunny').style.display = "inline-block";
            }
            if(vivod.weather[0].main == 'Rain')
            {
                CloseIcons()
                document.getElementById('rain').style.display = "inline-block";
            }
            console.log(vivod) 
            info.innerHTML = ` ${gorod}`;
            temperature.innerText = `${parseInt(vivod.main.temp - 273)} °C`;
            
    }
    
       async function Select(el)
        {
            let nowValue = el.target.value;
            for(let j = 0; j < data.length; j++)
            {
                if(nowValue == data[j].name)
                {
                lat1 = Number(data[j].coords.lat);
                lon1 = Number(data[j].coords.lon);
                gorod = data[j].name;
                
                const weatherData = `https://api.openweathermap.org/data/2.5/weather?lat=${lat1}&lon=${lon1}&appid=df37d6ea911fd6c24034793c7afde041`;
                
                let dataW1 = await fetch(weatherData);
                let vivod = await dataW1.json();
                    if(vivod.weather[0].main == 'Clouds')
                    {
                        CloseIcons()
                        document.getElementById('clouds').style.display = "inline-block";
                    }
                    if(vivod.weather[0].main == 'Clear')
                    {
                        CloseIcons()
                        document.getElementById('sunny').style.display = "inline-block";
                    }
                    if(vivod.weather[0].main == 'Rain')
                    {
                        CloseIcons()
                        document.getElementById('rain').style.display = "inline-block";
                    }
                    console.log(vivod);
                    info.innerHTML = ` ${gorod}`;
                    temperature.innerText = `${parseInt(vivod.main.temp - 273)} °C`;
                    console.log(vivod.weather[0].main);
                }
            }
            warning.innerText = "";
        }
    selector.addEventListener('change', Select);
    function Geo()
    {
        async function success(pos)
        {
            const crd = pos.coords;
            let res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json&apiKey=0e961d561ecf48f49e85702a9a629b6c`);
            let dataCity = await res.json();
            lat1 = dataCity.results[0].lat;
            lon1 = dataCity.results[0].lon;
            gorod = dataCity.results[0].city + "<br>" + "(Не работает)";
            findCity()
        }
        async function error(e)
        {
            gorod = e
        }
            navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    }
    geoBtn.addEventListener('click', Geo);
}




