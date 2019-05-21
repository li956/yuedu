window.onload = function () {
    if (location.href.indexOf("?") === -1) {
        openregist();
    } else {
        openlogin();
    }
    //防止页面后退
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
}

function openlogin() {
    var lab2 = document.getElementsByClassName("lab2")[0];
    var lab1 = document.getElementsByClassName("lab1")[0];
    var login = document.getElementsByClassName("login")[0];
    var regist = document.getElementsByClassName("regist")[0];
    lab1.style.color = "#7f4a88";
    lab2.style.color = "#ffffff";
    lab1.style.borderBottom = "3px solid #7f4a88";
    lab2.style.borderBottom = "0px";
    login.style.display = "block";
    regist.style.display = "none";
}

function openregist() {
    var lab1 = document.getElementsByClassName("lab1")[0];
    var lab2 = document.getElementsByClassName("lab2")[0];
    var login = document.getElementsByClassName("login")[0];
    var regist = document.getElementsByClassName("regist")[0];
    lab1.style.color = "#ffffff";
    lab2.style.color = "#7f4a88";
    lab1.style.borderBottom = "0px";
    lab2.style.borderBottom = "3px solid #7f4a88";
    login.style.display = "none";
    regist.style.display = "block";

}

function checkphone(flag) {
    if (flag) {
        var values = document.getElementById("phone").value;
        var tip = document.getElementById("tip1");
    } else {
        var values = document.getElementById("loginphone").value;
        var tip = document.getElementById("logintip1");
    }

    var reg = /^1[34578]\d{9}$/;
    if (!values == "") {
        if (!reg.test(values)) {
            tip.innerText = "手机号码格式不正确！"
            return false;
        } else {
            tip.innerText = "";
            return true;
        }
    } else {
        tip.innerText = "请输入手机号！";
        return false;
    }
}

function checkprove() {
    var reg = /^[0-9]+$/;
    var values = document.getElementById("prove").value;
    var tip = document.getElementById("tip2");
    if (!values == "") {
        if (!reg.test(values)) {
            tip.innerText = "验证码必须是6位数！";
            return false;
        } else {
            tip.innerText = "";
            return true;
        }

    } else {
        tip.innerText = "请输入验证码！";
        return false;
    }
}

function checkpwd(flag, id) {
    if (flag) {
        var values = document.getElementsByClassName("content_two")[1].value;
        var tip = document.getElementById("tip3");
    } else {
        var values = document.getElementsByClassName("content_two")[0].value;
        var tip = document.getElementById("logintip2");
    }
    var reg = values.length;
    if (!values == "") {
        if (reg >= 6 && reg <= 32) {
            tip.innerText = "";
            return true;
        } else {
            tip.innerText = "密码必须是6~32位！";
            return false;
        }
    } else {
        tip.innerText = "请输入密码！";
        return false;
    }

}

function checkagainpwd() {
    var values = document.getElementsByClassName("content_two")[2].value;
    var tip = document.getElementById("tip4");
    if (!values == "") {
        if (values != document.getElementsByClassName("content_two")[1].value) {
            tip.innerText = "两次输入的密码不一样！";
            return false;
        } else {
            tip.innerText = "";
            return true;
        }
    } else {
        tip.innerText = "请输入密码！";
        return false;
    }

}

function getcaptcha() {
    var phone = document.getElementById("phone").value;
    if (checkphone(1)) {
        ajax("GET", url + "/captcha?type=register&phone=" + phone, function (data) {
            if (data.code === "SUCCESS") {
                alert(data.captcha);
            } else {
                alert(data.message);
            }
        }, null);
    }
}

function regist() {
    var isphone = checkphone(1);
    var ispwd = checkpwd(1);
    var isprove = checkprove();
    var isagainpwd = checkagainpwd();
    if (isphone && ispwd && isprove && isagainpwd) {
        var phone = document.getElementById("phone").value;
        var prove = document.getElementById("prove").value;
        var pwd = document.getElementsByClassName("content_two")[1].value;
        ajax("POST", url + "/account/register", function (data) {

            if (data.status == "SUCCESS") {
                openlogin();
            } else {
                alert(data.message);
            }

        }, "account=" + phone + "&password=" + pwd + "&captcha=" + prove);
    }
}

function login() {
    var isphone = checkphone(0);
    var ispwd = checkpwd(0);
    if (isphone && ispwd) {
        var phone = document.getElementById("loginphone").value;
        var pwd = document.getElementsByClassName("content_two")[0].value;
        ajax("POST", url + "/account/login", function (data) {
            if (data.code === "SUCCESS") {
                localStorage.setItem("user", JSON.stringify(data.data.user)); //用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。
                localStorage.setItem("token", data.data.user.token);
                location.href = "http://localhost:8080/project/program/articles.html";
            } else {
                alert(data.message);
            }
        }, "account=" + phone + "&password=" + pwd);
    }
}