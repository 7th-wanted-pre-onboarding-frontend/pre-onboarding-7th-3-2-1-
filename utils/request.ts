import axios from 'axios';

const request = axios.create({
  withCredentials: true
});

export default request;
