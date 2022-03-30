let baseURL = "";
/*第一层if判断生产环境和开发环境*/
if (process.env.NODE_ENV === "production") {
  /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
  if (process.env.VUE_APP_FLAG === "pro") {
    //production 生产环境
    baseURL = "http://api.xinggeyun.com";
  } else {
    //test 测试环境
    baseURL = "http://192.168.119.249:11401";
  }
} else {
  //dev 开发环境
  // eslint-disable-next-line no-unused-vars
  baseURL = "http://192.168.119.249:11401";
}
