import axios from "axios";
import router from "@/router";
import { baseURL } from "@/api/baseURL";
const instance = axios.create({
  baseURL,
  timeout: 1000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 请求头携带 token
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers["TOKEN"] = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  async function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // token 失效 / 为空
    console.log(
      `拦截器：请求${response.config.url}成功，状态码${response.data.code}`
    );
    if (response.data.code === 10015 || response.data.code === 10001) {
      localStorage.removeItem("Token");
      alert(response.data.code === 10015 ? "Token过期" : "请先登录");
      await router.replace({
        path: "/",
      });
    }
    return response;
  },
  async function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log("发生错误", error.response);
    return Promise.reject(error);
  }
);

export { instance as axios };
