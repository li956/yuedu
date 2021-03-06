function checkphone(e){
    var values=e.value;
    var tip=document.getElementById("tip1");
    var reg=/^1[34578]\d{9}$/;
    if(!values==''){
        if(!reg.test(values)){
            tip.innerText="手机号码格式不正确!";
            return false;
        }else{
            tip.innerText="";
            return true;
        }
    }else{
        tip.innerText="请输入手机号!";
        return false;
    }
     
}
function checkprove(e){
    var reg=/^[0-9]+$/;
    var values=e.value;
    var tip=document.getElementById("tip2");
    if(!values==""){
        if(!reg.test(values)){
            tip.innerText="验证码必须是6位数!";
            return false;
        }else{
            tip.innerText="";
            return true;
        }
    }else{
        tip.innerText="请输入验证码!";
        return false;
    }
}
function checkpwd(e){
    var values=e.value;
    var tip=document.getElementById("tip3");
    var reg=values.length;
    if(!values==""){
        if(reg>=6 && reg<=32){
            tip.innerText="";
            return true;
        }else{
            tip.innerText="密码必须是6~32位!";
            return false;
        }
    }else{
        tip.innerText="请输入密码!";
        return false;
    }
}
function checkagainpwd(e){
    var values=e.value;
    var tip=document.getElementById("tip4");
    if(!values==""){
        if(values!=document.getElementById("pwd").value){
            tip.innerText="两次输入的密码不一样!";
            return false;
        }else{
            tip.innerText="";
            return true;
        }
    }else{
        tip.innerText="请输入密码!";
        return false;
    }
}
function getcaptcha(){
    var phone=document.getElementById("phone");
    if(checkphone(phone)){
        ajax("GET",url+"/captcha?type=reset&phone="+phone.value,function(data){
            if(data.code==="SUCCESS")
            {
                alert(data.captcha);
            }
            else
            {
                alert(data.message);
            }
        },null);
    }
}
function reset_pwd(){
    var phone=document.getElementById("phone");
    var captcha=document.getElementById("captcha");
    var pwd=document.getElementById("pwd");
    var againpwd=document.getElementById("againpwd");
    var isphone=checkphone(phone);
    var iscaptcha=checkprove(captcha)
    var ispwd=checkpwd(pwd);
    var isagainpwd=checkagainpwd(againpwd);
    if(isphone && iscaptcha && ispwd && isagainpwd){
        ajax("post",url+"/account/reset",function(data){
            if(data.code=="SUCCESS"){
                localStorage.setItem("token",data.token);
                location.href="http://localhost:8080/project/program/index.html?";
            }else{
                alert(data.message);
            }

        },"password="+pwd.value+"&captcha="+captcha.value+"&phone="+phone.value)
    }
}