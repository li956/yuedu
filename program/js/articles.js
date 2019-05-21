window.onload = function () {
    if(localStorage.user!="null")
    {
        loadarticle(1);

        window.addEventListener('scroll', _.throttle(waterfall(), 400)); //节流
        //--- 防抖----addEventListener('scroll',_debounce(waterfall(),400));
        window.addEventListener('scroll', lazyload);
    }else{
        setTimeout(alter_loading,5000);
    }
   
}
function alter_loading(){
    document.getElementById("loading").innerText = "加载失败请重新加载!";
}


//加载文章
function loadarticle(page) {
    
    ajax('get', url+'/posts/list?limit=3&page='+page, function (data) {
        var dt = data.data.articles;
        if (data.code != "SUCCESS" || dt.length == 0) {
            document.getElementById("loading").innerText = "没有更多文章了";
            return false;
        }
        for (var i = 0; i < dt.length; i++) {
            var str = '<section class="article">';
            str += '<a href="http://localhost:8080/project/program/article_detail.html?id=' + dt[i]._id + '">';
            var cover = dt[i].cover ? img_url+dt[i].cover : "http://localhost:8080/project/program/img/2.png";
            str += '<img src="./img/ico_preload.gif" data-src=' + cover + ' class="article_img"/>';
            str += '<span class="title">' + dt[i].title + '</span>';
            var abstract = dt[i].abstract ? dt[i].abstract : ".........";
            str += '<p>' + abstract + '</p>';
            str += '</a>';
            var avatar = dt[i].author.avatar ? img_url+dt[i].author.avatar : "./img/ico_header.jpg";
            var author_id=dt[i].author._id;
            str += '<div class="author" onclick="get_author(this)" data-id='+author_id+'>';
            str += '<img  src=' + avatar + ' alt="" class="author_header">';
            str += '<span class="author_name">' + dt[i].author.name + '</span>';
            var create_time = isNaN(dt[i].create_time)?moment(dt[i].create_time).format("YYYY-MM-DD HH:mm:ss") :moment(dt[i].create_time*1).format("YYYY-MM-DD HH:mm:ss") ; 
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
        }
        lazyload();
    }, null);

}
//瀑布流
function waterfall() {
    var page_num = 2;
    return function () { //闭包---防止全局污染
        var loading = document.getElementById('loading');
        if (loading.offsetHeight + loading.getBoundingClientRect().top < document.documentElement.clientHeight) {
            loadarticle(page_num++);
        }

    }
}
//懒加载
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
//预加载
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
function get_author(e){
    
    var user=e.dataset.id;
    location.href="http://localhost:8080/project/program/personal.html?user="+user;
    
}