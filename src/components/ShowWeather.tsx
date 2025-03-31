import {AiOutlineSearch} from "react-icons/ai";
import {BsCloudFog2Fill, BsCloudyFill, BsFillCloudRainFill, BsFillSunFill} from "react-icons/bs";
import {TiWeatherPartlySunny} from "react-icons/ti";
import {WiHumidity} from "react-icons/wi";
import {LuWind} from "react-icons/lu";
import { RiLoaderFill } from "react-icons/ri";
import axios from "axios";
import {useEffect, useState} from "react";

interface WeatherDataTypes {
    name: string;

    main: {
        temp: number;
        humidity: number;
    };
    sys: {
        country: string;
    };
    weather: {
        main: string;
    }[];
    wind: {
        speed: number;
    };
}

export const ShowWeather = () => {

    const api_key = "0cc86d16bf572f78cdc96c096c7627e5"; // old one
    // const api_key = "d1cb0fc2f4114a03dfa3ff86870c89f0"; // my new one
    const api_Endpoint = 'https://api.openweathermap.org/data/2.5/';

    const [weatherData, setWeatherData] = useState<WeatherDataTypes | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchedCurrentWeatherData = async (lat: number, lon: number) => {
        const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                Promise.all([
                    fetchedCurrentWeatherData(latitude, longitude)
                ]).then(([weatherData]) => {
                    setWeatherData(weatherData);
                    setLoading(true);
                })
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const iconChanger = (weather: string) => {
        let iconElement: React.ReactNode;
        let iconColor: string;

        switch (weather) {
            case "Rain":
                iconElement = <BsFillCloudRainFill />;
                iconColor = "#272829";
                break;

            case "Clear":
                iconElement = <BsFillSunFill />;
                iconColor = "#FFC436";
                break;
            case "Clouds":
                iconElement = <BsCloudyFill />;
                iconColor = "#102C57";
                break;

            case "Mist":
                iconElement = <BsCloudFog2Fill />;
                iconColor = "#279EFF";
                break;
            default:
                iconElement = <TiWeatherPartlySunny />;
                iconColor = "#7B2869";
        }

        return (
            <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
        );
    };

    const fetchWeatherData = async (city:string) => {
        try {
            const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
            const response = await axios.get(url);
            const currentSearch : WeatherDataTypes = response.data;
            return currentSearch;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = async () => {
        if (search.trim() === "") {
            return;
        }
        try {
            const currentSearch = await fetchWeatherData(search);
            if (currentSearch) {
                setWeatherData(currentSearch);
            } else {
                setWeatherData(null); // or some other default value
            }
            setSearch("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='min-h-screen relative'>
            {/*container*/}
            <div className='bg-white/50 w-[500px] h-[650px] rounded-[12px] p-8 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] text-black/80
            bg-blend-overlay flex justify-between items-center flex-col absolute top-40 left-0 right-0 bottom-0 mx-auto'>
                {/*search div*/}
                <div className='mt-5 flex justify-evenly items-center w-full'>
                    <input className='outline-none border border-gray-500 p-2 rounded-[20px] text-center w-4/5 bg-transparent' type="text" placeholder="enter a city"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                    {/*search circle*/}
                    <div className='border border-gray-500 w-[42px] h-[42px] rounded-full flex justify-center items-center cursor-pointer'>
                        <AiOutlineSearch className='text-[26px] text-gray-500' onClick={handleSearch}/>
                    </div>
                </div>

                {weatherData && loading ? (
                    <>
                        {/*weather div*/}
                        <div className='flex items-center flex-col my-[10px]'>
                            <h1 className='text-[3rem] font-bebas-neue'>{weatherData.name}</h1>
                            <span className='font-inter bottom-[15px] relative'>{weatherData.sys.country}</span>
                            <div className='text-[5rem]'>
                                {iconChanger(weatherData.weather[0].main)}
                            </div>
                            <h1 className='text-[3rem] top-[24px] relative font-bebas-neue'>{weatherData.main.temp.toFixed(0)}c</h1>
                            <h2 className='font-inter text-[2rem] font-normal'>{weatherData.weather[0].main}</h2>
                        </div>

                        {/*Info div*/}
                        <div className="flex items-center justify-space-between font-josefin-sans m-2.5 bg-gradient-to-r from-green-100/50 to-yellow-100 rounded-[12px] shadow-[0px_8px_18px_-5px_rgba(0,_0,_0,_0.1)]">
                            {/*humidity*/}
                            <div className='flex items-center mx-[20px]'>
                                <WiHumidity className='text-[4rem] mr-[10px]' />
                                <div className="humidInfo">
                                    <h1 className='text-[2.2rem] font-bebas-neue'>{weatherData.main.humidity}%</h1>
                                    <p className='bottom-[15px] relative'>Humidity</p>
                                </div>
                            </div>

                            <div className='flex items-center mx-[20px]'>
                                <LuWind className='text-[3rem] mr-[15px]' />
                                <div className="humidInfo">
                                    <h1 className='text-[2.2rem] font-bebas-neue'>{weatherData.wind.speed}km/h</h1>
                                    <p className='bottom-[15px] relative'>Wind speed</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='"h-[400px] w-[300px] flex flex-col justify-center items-center z-[9999] absolute top-20 left-0 right-0 bottom-0 mx-auto'>
                        <RiLoaderFill className='text-[3rem] animate-spin-slow' />
                        <p className='text-[22px] mt-[10px] font-josefin-sans'>Loading</p>
                    </div>
                )}
            </div>
        </div>
    );
};