window.onload = function () {
    if (localStorage.user == "null") {
        location.href = "http://localhost:8080/project/program/index.html?";
    }
    get_info();
    getprovince();
    document.getElementById("files").onchange = function () {
        var file = this.files[0];
        var img_reader = new FileReader;
        img_reader.onload = function (e) {
            if (document.getElementById("img") != null) {
                document.getElementById("lab_img").removeChild(document.getElementById("img"));
            }
            var img = document.createElement("img");
            img.src = e.target.result;
            img.id = "img";
            document.getElementById("lab_img").appendChild(img);
        }
        img_reader.readAsDataURL(file);
    };
    document.getElementById("province").onchange = function () {
        if (document.getElementById('city') != null) {
            this.parentNode.removeChild(document.getElementById("city"));

        }
        if (document.getElementById('area') != null) {
            this.parentNode.removeChild(document.getElementById("area"));
        }
        var id = this.selectedOptions[0].dataset.id;
        if (id == undefined) {
            return;
        }
        getcity(id);


    }
}
document.getElementById("btn_sub").addEventListener('click', submit);
//提交数据
function submit() {
    var formdata = new FormData();
    var file = document.getElementById("files").files[0];
    formdata.append('token', localStorage.token);
    formdata.append('avatar', file);
    if (document.getElementById("man").checked == true) {
        var sex = document.getElementById("man").value;

    } else {
        var sex = document.getElementById("woman").value;
    }
    formdata.append('gender', sex);
    var province = document.getElementById("province").selectedOptions[0].dataset.id;
    if (province != undefined) {
        var city = document.getElementById("city").selectedOptions[0].dataset.id;
        var arr = [];
        arr.push(province * 1);
        if (city != undefined) {
            var area = document.getElementById("area").selectedOptions[0].dataset.id;
            if (area != undefined) {
                arr.push(city * 1);
                arr.push(area * 1);
                formdata.append('city', JSON.stringify(arr));
            }
        }
    }


    var constellation = document.getElementById("stars").selectedOptions[0].textContent
    formdata.append('constellations', constellation);
    var name=document.getElementById("name").value;
    formdata.append('name',name);

    file_ajax(url + '/account/profile', function (data) {
        if (data.code != "SUCCESS") {
            alert(data.message);
            alert_info(data);
        } else {
            alert("提交成功");
            localStorage.setItem("user", JSON.stringify(data.data.user));
            localStorage.setItem("token", data.data.user.token);
            history.go(0);
        }

    }, formdata);
}

function getprovince() {
    var province = document.getElementById("province");
    ajax('get', url + '/city/province', function (data) {
        if (data.code == "SUCCESS") {
            var str = "<option>请选择</option>";
            var dt = data.data.province;
            for (var i = 0; i < dt.length; i++) {
                str += '<option data-id=' + dt[i].ProID;
                if(JSON.parse(localStorage.getItem("user")).city[0]==dt[i].ProID){
                    str+=' selected=ture';
                    getcity(dt[i].ProID);
                }
                str +='>';
                str += dt[i].name;
                str += '</option>';
               
            }
            province.insertAdjacentHTML('afterbegin', str);
    
        } else {
            province.insertAdjacentHTML('afterbegin', '无法获取请重新加载');
            return;
        }
    }, null);
}

function getcity(id, cb) {
    var str = '<select id="city">';
    ajax('get', url + '/city/city?ProID=' + id, function (data) {
        if (data.code == "SUCCESS") {
            str += "<option>请选择</option>";
            var dt = data.data.city;
            for (var i = 0; i < dt.length; i++) {
                str += '<option data-id=' + dt[i].CityID;
                if(JSON.parse(localStorage.getItem("user")).city[1]==dt[i].CityID){
                    str+=' selected=ture';
                    getarea(dt[i].CityID);
                }
                str+='>';
                str += dt[i].name;
                str += '</option>';
            }
            str += '</select>';

        } else {
            str = '<select id="city"><option>请求失败</option></select>';
        }
        document.getElementById("province").insertAdjacentHTML('afterend', str);
        document.getElementById("city").onchange = function () {
            if (document.getElementById('area') != null) {
                this.parentNode.removeChild(document.getElementById("area"));
            }
            var id = this.selectedOptions[0].dataset.id;
            if (id == undefined) {
                return;
            }
            getarea(id);
        }

    }, null);

}

function getarea(id) {
    var str = '<select id="area">';
    ajax('get', url + '/city/area?CityID=' + id, function (data) {
        if (data.code == "SUCCESS") {
            str += "<option>请选择</option>";
            var dt = data.data.area;
            for (var i = 0; i < dt.length; i++) {
                str += '<option data-id=' + dt[i].Id;
                if(JSON.parse(localStorage.getItem("user")).city[2]==dt[i].Id){
                    str+=' selected=ture';
                }
                str+='>';
                str += dt[i].DisName;
                str += '</option>';
            }
        } else {
            str = '<select id="city"><option>请求失败</option></select>';
        }
        document.getElementById("city").insertAdjacentHTML('afterend', str);
    }, null);
}

function get_info() {
    var user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("name").value = user.name;
    var sex = user.gender || 'man';
    document.getElementById(sex).checked = "checked";
    if (user.avatar) {
        document.getElementById("lab_img").style.backgroundImage = 'url(' + img_url + user.avatar + ')';
    }
    var constellation = {
        "白羊座": 1,
        "金牛座": 2,
        "双子座": 3,
        "巨蟹座": 4,
        "狮子座": 5,
        "处女座": 6,
        "天秤座": 7,
        "天蝎座": 8,
        "射手座": 9,
        "摩羯座": 10,
        "水瓶座": 11,
        "双鱼座": 12
    };
    document.getElementById("stars").selectedIndex = constellation[user.constellations];
    

}