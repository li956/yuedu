window.addEventListener('load',function(){
    if (localStorage.getItem("user") != "null") {
      var user_info = document.getElementById("user_info");
      var to_index = document.getElementById("to_index");
      user_info.style.display = "inline-block";
      to_index.style.display = "none";
      getinformation();
    } else {
      var user_info = document.getElementById("user_info");
      var to_index = document.getElementById("to_index");
      user_info.style.display = "none";
      to_index.style.display = "inline-block";
    }
  });
  //获取用户信息
  function getinformation() {
    var user = JSON.parse(localStorage.getItem("user"));
    var header = document.getElementById("header");
    document.getElementById("user_name").innerText = user.name;
    if (user.avatar) {
        header.src = 'https://dev.apis.ittim.ltd/FBtL8tkEzD/static/'+user.avatar;
    }
  }