import axios from 'axios';

let Axios = axios.create({
  baseURL: 'https://api.openweathermap.org/',
});
export default Axios;
