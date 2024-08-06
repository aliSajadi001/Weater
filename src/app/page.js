'use client';
import { useEffect, useState } from 'react';
import { TiWeatherSunny } from 'react-icons/ti';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { LuCloudFog } from 'react-icons/lu';
import { IoRainyOutline } from 'react-icons/io5';
import { MdOutlineWindPower } from 'react-icons/md';
import moment from 'moment';
import Axios from './axiosConfig/axios';

export default function Home() {
  let [search, setSearch] = useState('');
  let [weather, setWeather] = useState({});
  let [loading, setLoading] = useState(false);
  let [currentTime, setCurrentTime] = useState('');
  let [hors, setHors] = useState(Date.now());
  let [nightOrDay, setNigtOrDay] = useState(false);
  let sunrise = weather?.sys?.sunrise * 1000;
  let sunset = weather?.sys?.sunset * 1000;
  useEffect(() => {
    setNigtOrDay(hors < sunrise || hors > sunset);
  }, [sunset, sunrise]);
  let getTime = () => {
    return moment().format('YYYY/MM/DD - HH:mm');
  };
  useEffect(() => {
    let nowTime = getTime();
    setCurrentTime(nowTime);
    let interval = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  let getWeather = async () => {
    try {
      setLoading(true);
      let data = await Axios.get('data/2.5/weather', {
        params: {
          q: search,
          appid: process.env.NEXT_PUBLIC_API_WEATHER,
        },
      });
      setSearch('');
      if (data) {
        setWeather(data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  let handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };
  return (
    <div className=" h-[100vh] w-full relative flex items-center justify-center ">
      {Object.keys(weather).length > 0 ? (
        <>
          {nightOrDay ? (
            <>
              <video
                className=" h-full object-cover w-full"
                src={
                  weather.weather[0].main === 'Clear'
                    ? '../../videos/2735069-uhd_3240_2160_15fps.mp4'
                    : weather.weather[0].main === 'Clouds'
                    ? '../../videos/854739-hd_1920_1080_30fps.mp4'
                    : weather.weather[0].main === 'Rain'
                    ? '../../videos/4323285-hd_1920_1080_30fps.mp4'
                    : ''
                }
                autoPlay
                loop
                muted
              />
            </>
          ) : (
            <>
              <video
                className=" h-full object-cover w-full"
                src={
                  weather.weather[0].main === 'Clear'
                    ? '../../videos/7498095-uhd_3840_2160_30fps.mp4'
                    : weather.weather[0].main === 'Clouds'
                    ? '../../videos/855785-hd_1920_1080_24fps.mp4'
                    : weather.weather[0].main === 'Rain'
                    ? '../../videos/3813820-hd_1920_1080_24fps.mp4'
                    : ''
                }
                autoPlay
                loop
                muted
              />
            </>
          )}
        </>
      ) : (
        <>
          <img
            className="h-full object-cover w-full"
            src="../../videos/pexels-biluk-165537.jpg"
            alt=""
          />
        </>
      )}

      <div className="absolute backdrop-blur-sm md:w-[500px] md:h-[600px] h-[80%] w-[90%] bg-white rounded-lg bg-opacity-10 flex flex-col  justify-center items-center md:p-10 p-5">
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center items-center gap-3">
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search..."
            className=" w-[70%] outline-none border border-blue-300 rounded-full md:p-2 p-1 flex justify-center items-center"
          />
          <button className="md:p-2 p-1 rounded-full bg-blue-600 text-white font-normal">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {Object.keys(weather).length > 0 && (
          <p className="text-9xl flex items-center justify-center text-blue-600 font-bold ">
            {Math.floor(weather?.main?.temp - 273.15)}
            <TbTemperatureCelsius />
          </p>
        )}
        <div>
          {Object.keys(weather).length > 0 && (
            <div className={`flex items-center justify-center ${nightOrDay ? "text-white" : ""} `}>
              <p className="text-2xl flex items-center justify-center  font-mono ">
                {weather.name}
              </p>
              <p className="text-2xl flex items-center justify-center  font-mono ">
                -{weather.sys.country}
              </p>
            </div>
          )}
        </div>

        <div className="w-full h-full mt-10 p-5">
          {Object.keys(weather).length > 0 && (
            <div className="flex items-center justify-between">
              {weather.weather[0].main === 'Clear' ? (
                <div className="flex flex-col items-center">
                  <TiWeatherSunny className="size-32 text-blue-900 " />
                  <p className="text-2xl font-mono text-blue-900">Clear</p>
                </div>
              ) : weather.weather[0].main === 'Clouds' ? (
                <div className="flex flex-col items-center">
                  <LuCloudFog className="size-32 text-blue-900 " />
                  <p className="text-2xl font-mono text-blue-900">Clouds</p>
                </div>
              ) : weather.weather[0].main === 'Rain' ? (
                <div className="flex flex-col items-center">
                  <IoRainyOutline className="size-32 text-blue-900 " />
                  <p className="text-2xl font-mono text-blue-900">Rain</p>
                </div>
              ) : (
                ''
              )}
              <div className="flex flex-col items-center font-mono">
                <MdOutlineWindPower className="size-32 text-blue-900 " />
                <p className="text-2xl text-blue-900">{weather.wind.speed}km</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className={`font-bold underline ${nightOrDay ? "text-white" : ""}`}>{currentTime}</p>
        </div>
      </div>
    </div>
  );
}
