export function Geo()
{
    const options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    }
    async function success(pos)
    {
        const crd = pos.coords;
        let res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json&apiKey=0e961d561ecf48f49e85702a9a629b6c`);
        let dataCity = await res.json();
        console.log((dataCity.results[0].city).toString());
        return (dataCity.results[0].city).toString()
    
    }
    async function error(e)
    {
        console.log(e);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}