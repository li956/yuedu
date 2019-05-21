window.onload = function () {
    if (location.href.indexOf("?") != -1) {

        var user = location.href.substring(location.href.indexOf("=") + 1);

        loadarticle(1, user, true);
        window.addEventListener('scroll', _.throttle(waterfall(user), 400));
        window.onscroll=function(){
            lazyload();
        }
    }else
    {
        history.go(-1);
    }


}
function loadarticle(page, user, buer) {
    ajax('get', url + '/posts/list?page=' + page + '&limit=3&user=' + user, function (data) {
        
        if (data.code != "SUCCESS" || data.data.article.length == 0) {
            document.getElementById("loading").innerText = "没有更多的文章了";
            return false;
        }
        var dt = data.data.articles;
        if (dt.length <3)
            document.getElementById("loading").innerText = "没有更多的文章了";
        for (var i = 0; i < dt.length; i++) {
            var str = '<section class="article">';
            str += '<a href="http://localhost:8080/project/program/article_detail.html?id=' + dt[i]._id + '">';
            var cover = dt[i].cover ? img_url + dt[i].cover : "http://localhost:8080/project/program/img/2.png";
            str += '<img src="./img/ico_preload.gif" data-src=' + cover + ' class="article_img"/>';
            str += '<span class="title">' + dt[i].title + '</span>';
            var abstract = dt[i].abstract ? dt[i].abstract : ".........";
            str += '<p>' + abstract + '</p>';
            str += '</a>';
            var avatar = dt[i].author.avatar ? img_url + dt[i].author.avatar : "http://localhost:8080/project/program/img/ico_header.jpg";
            str += '<div class="author">';
            str += '<img  src=' + avatar + ' alt="" class="author_header">';
            str += '<span class="author_name">' + dt[i].author.name + '</span>';
            var create_time = isNaN(dt[i].create_time) ? moment(dt[i].create_time).format("YYYY-MM-DD HH:mm:ss") : moment(dt[i].create_time * 1).format("YYYY-MM-DD HH:mm:ss");
            str += '<span class="time">' + create_time + '</span>';
            str += '</div>';
            str += '<img src="./img/icon_thumb_up.png" alt="" class="praise" onclick="click_praise(this)">';
            var praise_sum = dt[i].praise_sum || 0;
            str += '<span class="praise_num">' + praise_sum + '</span>';

            str += '<img src="./img/icon_saw.png" alt="" class="see">';
            var look_sum = dt[i].look_sum ? dt[i].look_sum : 0;
            str += '<span class="see_num">' + look_sum + '</span>';
            str += '</section>';
            document.getElementById("content").insertAdjacentHTML('beforeend', str);

            lazyload();
        }
        

        if (buer) {
            get_info(data);
        }

    }, null);
}

function waterfall(user) {
    var page_num = 2;
    return function () {
        var loading = document.getElementById("loading");
        if (loading.offsetHeight + loading.getBoundingClientRect().top < document.documentElement.clientHeight) {
            loadarticle(page_num++,user,false);
        }
    }
}

function lazyload() {
    var imgs = document.getElementsByClassName('article_img');
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
       
        if (img.dataset.src == '') continue;
        if (img.offsetHeight * 0.25 + img.getBoundingClientRect().top < document.documentElement.clientHeight) {
            preload(img);
            img.dataset.src = '';
        }

    }

}

function preload(img) {
    var tmpimg = new Image();
    tmpimg.src = img.dataset.src;
    tmpimg.onload = function () {
        img.src = tmpimg.src;
    }
    tmpimg.onerror = function () {
        img.src = "./img/timg.jpg";
    }
}

function get_info(data) {
    var dt = data.data.articles;
    var avatar = dt[0].author.avatar ? img_url + dt[0].author.avatar : "http://localhost:8080/project/program/img/ico_header.jpg";

    document.getElementById("personal_header").src = avatar;

    var sex = dt[0].author.gender;
    if (sex == "man") {
        document.getElementById("sex").src = "http://localhost:8080/project/program/img/icon_boy.png";
    } else {
        document.getElementById("sex").src = "http://localhost:8080/project/program/img/icon_girl.png";
    }
    document.getElementById("personal_name").innerText = dt[0].author.name;
    var city_id = dt[0].author.city[1];
    get_city(city_id);
    document.getElementById("star").innerText=dt[0].author.constellations ||" ";
    document.getElementById("marke").innerText="文章("+data.count+")";
}

function get_city(city_id) {
    ajax('get', url + '/city/city?CityID=' + city_id, function (data) {
        if (data.code == "SUCCESS") {
            document.getElementById("city").innerText = data.data.city;
        }
    }, null);
    
}