window.onload = function () {
    if (location.href.indexOf("?") != -1) {
        var id = location.href.substring(location.href.indexOf("=") + 1);
        document.getElementById("submit").addEventListener('click', sub_comment(localStorage.token, id));

        ajax('get', url + '/posts/details?id=' + id, function (data) {
            if (data.code != "SUCCESS") {
                alert(data.message);
                return;
            }
            var dt = data.data.article;
            document.getElementById("article_title").innerText = dt.title;
            document.getElementById("author_header").src = dt.author.avatar ? img_url + dt.author.avatar : "./img/ico_header.jpg";
            document.getElementById("author_name").innerText = dt.author.name;
            var create_time = isNaN(dt.create_time) ? moment(dt.create_time).format("YYYY-MM-DD HH:mm:ss") : moment(dt.create_time * 1).format("YYYY-MM-DD HH:mm:ss");
            document.getElementById("time").innerText = create_time;
            document.getElementById("praise_num").innerText = dt.praise_sum || 0;
            document.getElementById("see_num").innerText = dt.look_sum || 0;
            preLoadImg(dt.pic, "article_img");
            document.getElementById("text_box").innerHTML = dt.body;

        }, null);
        
        load_comments(1, id);
        document.getElementById("arrow_down").addEventListener('click', click_load(id));
    }else{
        history.go(-1);
    }
    // //test
    // load_comments();
}
//提交评论
function sub_comment(token, id) {

    return function () {
        var body = document.getElementById("write_comments").value;
        ajax('post', url + '/comment/add', function (data) {
            if (data.code == "SUCCESS") {
                alert(data.message);
                document.getElementsByClassName("comments")[0].innerHTML = '';
                load_comments(1, id);
            } else {
                alert(data.message);
            }
        }, "token=" + token + "&body=" + body + "&article=" + id);
        document.getElementById("write_comments").value = '';
    }
}
//加载评论区
function load_comments(page, id) {
    ajax('get', url + '/comment/list?page=' + page + '&limit=3&article=' + id, function (data) {
        var dt = data.data.comments;
        if (data.code != "SUCCESS" || dt.length == 0) {
            document.getElementById("arrow_down").style.display = "none";
        }
        for (var i = 0; i < dt.length; i++) {
            var str = '<section class="comment">';
            str += '<div class="comment_head">';
            var avatar = dt[i].author.avatar ? img_url + dt[i].author.avatar : "./img/ico_header.jpg";
            str += '<img src=' + avatar + ' class="comment_header">';
            str += '<span class="comment_name">' + dt[i].author.name + '</span>';
            var create_time = get_com_time(dt[i].create_time);
            str += '<span class="comment_time">' + create_time + '</span>';
            str += '<img src="./img/icon_thumb_up.png" alt="" class="comment_praise" onclick="click_praise(this)">';
            str += '<span class="comment_praise_num">' + dt[i].praise_sum + '</span></div>';
            str += '<p class="comment_con">' + dt[i].body + '</p>';
            str += '</section>';
            document.getElementsByClassName("comments")[0].insertAdjacentHTML('beforeend', str);
        }

    }, null);
}

function get_com_time(time) {
    var create_time = isNaN(time) ? time.getTime() : time;
    
    var new_time = new Date();
    var diff = new_time.getTime() - create_time;
    var diff_date = new Date(diff);
    console.log(new_time.getTime());
    console.log(create_time);
    console.log(diff);
    if (diff_date < 60 * 1000) {
        return "刚刚";
    } else if (diff_date < 60 * 1000 * 60) {
        return diff_date.getMinutes()+"分钟前";
    } else if (diff_date < 60 * 1000 * 60 * 24) {
        return diff_date.getHours()+"小时前";
    } else if (diff_date <= 60 * 1000 * 60 * 24 * 31) {
        return diff_date.getDate()+"天前";
    } else {
        return moment(create_time).format("YYYY-MM-DD");
    }


}

function click_load(id) {
    var page = 2;
    return function () {
        load_comments(page++, id);
    }
}


// //test
// function load_comments() {
//     ajax('get', 'http://localhost:8080/project/program/JSON/comment3.json', function (data) {
//         var dt = data.data.comments;
//         if (data.code != "SUCCESS" || dt.length == 0) {
//             document.getElementById("arrow_down").style.display = "none";
//         }
//         for (var i = 0; i < dt.length; i++) {
//             var str = '<section class="comment">';
//             str += '<div class="comment_head">';
//             var avatar = dt[i].author.avatar ? img_url + dt[i].author.avatar : "./img/ico_header.jpg";
//             str += '<img src=' + avatar + ' class="comment_header">';
//             str += '<span class="comment_name">' + dt[i].author.name + '</span>';
//             var create_time = get_com_time(dt[i].create_time);
//             str += '<span class="comment_time">' + create_time + '</span>';
//             str += '<img src="./img/icon_thumb_up.png" alt="" class="comment_praise" onclick="click_praise(this)">';
//             str += '<span class="comment_praise_num">' + dt[i].praise_sum + '</span></div>';
//             str += '<p class="comment_con">' + dt[i].body + '</p>';
//             str += '</section>';
//             document.getElementsByClassName("comments")[0].insertAdjacentHTML('beforeend', str);
//         }

//     }, null);
// }