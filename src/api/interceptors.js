import axios from "axios";
import router from "@/router";

/* 请求拦截器 */
axios.interceptors.request.use(
  (config) => {
    // config.data = JSON.stringify(config.data);
    const token = localStorage.getItem("Token"); //获取token
    if (token) {
      config.headers["TOKEN"] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    // store.commit("loading_status", true);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/* 响应拦截器 */
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 10015 || response.data.code === 10001) {
      //token失效/为空
      localStorage.removeItem("Token");
      router.replace({
        path: "/",
      });
    }

    // 自定义加载动画结束
    // store.commit("loading_status", false);
    return response;
  },
  (error) => {
    // 自定义加载动画结束
    console.log("--------------响应拦截------------");
    try {
      if (error.response) {
        switch (error.response.code) {
          case 10015: //token过期
            localStorage.removeItem("Token");
            router.replace({
              path: "/",
            });
            return;
        }
      }
      // store.commit("loading_status", false);
      return Promise.reject(error.reponse.data);
    } catch (e) {
      console.log(e);
    }
  }
);
