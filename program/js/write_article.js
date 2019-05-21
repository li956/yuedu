window.onload = function () {
    if(localStorage.user=="null")
    {
        alert("请先登录!");
        location.href="http://localhost:8080/project/program/index.html?";
    }
    document.getElementById("files").onchange = function () {
        var file = this.files[0];
        var img_reader = new FileReader;
        img_reader.onload = function (e) {
            var img = document.createElement('img');
            img.src = e.target.result;
            img.id = 'img';
            //避免多次上传图片
            if(document.getElementById("img")!=null){
                document.getElementById("title_img").removeChild(document.getElementById("img"));
            }

            document.getElementById("title_img").appendChild(img);
            document.getElementById("label").style.zIndex=999;
            document.getElementsByClassName("file_bg")[0].style.display="none";
        }
        img_reader.readAsDataURL(file);
    };
    document.getElementById("write_article").addEventListener('click', upload);
}
//获取信息以formdata格式封装并上传
function upload() {
    var formdata = new FormData();
    var file = document.getElementById('files').files[0];
    formdata.append('pic', file);
    formdata.append('token', localStorage.token);
    var title = document.getElementById('title').value;
    formdata.append('title', title);
    var body = document.getElementById("main_txt").value;
    formdata.append('body', body);
    var buer=checkparam(file,title,body);
    if(buer){
        file_ajax(url+'/posts/add', function (data) {
            if (data.code == "SUCCESS") {
                alert(data.message);
                location.href="http://localhost:8080/project/program/articles.html";
            } else {
                alert(data.message);
                alert_info(data);
            }
        }, formdata);
    }
    
}
function checkparam(file,title,body){
    if(file==undefined){
        alert("请上传封面");
        return false;
    }else if(title==''){
        alert("请输入标题");
        return false;
    }else if(body==''){
        alert("请输入正文");
        return false;
    }else{
        return true;
    }
}
