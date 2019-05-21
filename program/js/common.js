var url = 'https://dev.apis.ittim.ltd/FBtL8tkEzD';
var img_url = 'https://dev.apis.ittim.ltd/FBtL8tkEzD/static/';
/**
 * 原生AJAX封装函数
 * @param {String} method http请求方式(如'GET','POST')
 * @param {String} url 请求接口地址
 * @param {function} cb 请求成功后执行函数
 * @param {String} params 'POST'请求时传递参数
 */
function ajax(method, url, cb, params) {
  if (window.XMLHttpRequest) {
    var Ajax = new XMLHttpRequest(); // E7+、Firefox、Chrome、Safari 以及 Opera
  } else {
    var Ajax = new ActiveXObject("Microsoft.XMLHTTP"); //IE6浏览器创建ajax对象
  }
  Ajax.open(method, url, true);
  Ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //设置请求头类型，POST请求时必须设置
  Ajax.withCredentials = true; // **设置该属性后调用接口才会弹框提示授权**
  Ajax.send(params); // 发送请求
  Ajax.onreadystatechange = function () {
    if (Ajax.readyState == 4) { // 请求已完成，且响应已就绪
      if (Ajax.status == 200) {
        var data = JSON.parse(Ajax.response) // 将数据转化为js对象
        cb(data); //成功的时候调用这个方法
      } else {
        // ...异常处理
      }
    }
  };
}
function preLoadImg(img,id){
  var tmpImg = new Image();
  // 图片加载成功后，替换临时图片。
  tmpImg.onload = function(){
         document.getElementById(id).src = tmpImg.src
  }
  // 加载失败。
  tmpImg.onerror = function(){
         var error = './img/timg.jpg' // 此处为错误图片地址，用户自行修改
     document.getElementById(id).src = error
  }
  // 预加载图片(接口返回的图片地址需要前加上服务器地址)。
      tmpImg.src = img_url+ img;
}


/**
 * 原生AJAX封装函数
 * @param {String} url 请求接口地址
 * @param {function} cb 请求成功后执行函数
 * @param {object} params 请求时传递参数(formData格式)
 */
function file_ajax(url, cb, params) {
  if (window.XMLHttpRequest) {
    var Ajax = new XMLHttpRequest(); // E7+、Firefox、Chrome、Safari 以及 Opera
  } else {
    var Ajax = new ActiveXObject("Microsoft.XMLHTTP"); //IE6浏览器创建ajax对象
  }
  Ajax.open('POST', url, true);
  // 请求头会自动添加，无需设置，否则服务器报错
  Ajax.send(params); // 发送请求
  Ajax.onreadystatechange = function () {
    if (Ajax.readyState == 4) { // 请求已完成，且响应已就绪
      if (Ajax.status == 200) {
        cb(JSON.parse(Ajax.response)); //成功的时候调用这个方法
      } else {
        // ...异常处理
      }
    }
  };
}

//个人中心
function personal_info() {
  var user = JSON.parse(localStorage.getItem("user"));
  location.href = "http://localhost:8080/project/program/personal.html?user=" + user._id;
}
//账号设置
function setting_info() {
  location.href = "http://localhost:8080/project/program/user_config.html?";
}
//退出登录
function loginOut() {
  // 
  localStorage.setItem("user", null);
  localStorage.setItem("token", null);
  location.href = "http://localhost:8080/project/program/index.html?";
}
//返回文章列表
function goback() {
  location.href="http://localhost:8080/project/program/articles.html";
}
//点赞
function click_praise(img){
  var praise=img.nextElementSibling;
    if(img.src=="http://localhost:8080/project/program/img/icon_thumb_up.png"){
      img.src="./img/icon_thumb_up_like_blue.png";
      praise.textContent=praise.textContent*1+1;
    }else{
      img.src="./img/icon_thumb_up.png";
      praise.textContent=praise.textContent*1-1;
    }
}
//datamessage处理
function alert_info(data){
  if(data.code=="account_token_invalid"){
    location.href="http://localhost:8080/project/program/index.html?";
  }
}