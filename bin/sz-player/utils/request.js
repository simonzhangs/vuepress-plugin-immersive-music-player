import axios from 'axios';
// import { getCookie } from '@/utils/auth';

// let baseURL = '';
let baseURL = 'https://netease-cloud-music-api-two-rust.vercel.app/'

const service = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
});

service.interceptors.request.use(function (config) {
    if(!config.params) config.params = {};
    // if (baseURL[0] !== '/' && !process.env.IS_ELECTRON) {
    //     // config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`;
    // }

    // if (!process.env.IS_ELECTRON && !config.url.includes('/login')) {
    //     config.params.realIP = '211.161.244.70';
    // }

    // const proxy = JSON.parse(localStorage.getItem('settings')).proxyConfig;
    // if (['HTTP', 'HTTPS'].includes(proxy.protocol)) {
    //     config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`;
    // }
    config.proxyConfig = {
        protocol: 'noProxy',
        server: '',
        port: null,
    };
    return config;
});

service.interceptors.response.use(
    response => {
        const res = response.data;
        return res;
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;