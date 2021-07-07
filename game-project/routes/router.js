//router(라우트) : 사용자가 요청한 경로에 따른 기능 처리.
//express에서 Main 역할하는 파일
//kiddleware(미들웨어) : 사용자가 요청한 기능을 수행하기 위해 필요한 기능들을 정의

request = require("express");
const express = require("express");
const router = express.Router();
const conn = require("../config/DB_config.js");



router.post("/Login", function(request, response){

    let id = request.body.id;
    let pw = request.body.pw;
    //사용자가 입력한 id가 smart이고
    //사용자가 입력한 pw가 123일 때 성공이면 LoginS.html로 이동. 실패하면 LoginF.html로 이동.zㅋ

        conn.connect(); //mysql 연결
    
        let sql = "select * from member where member_id = ?";
    
        conn.query(sql,[id,pw], function(err, row){

            console.log(row);

            if(row.length>0){
                if(pw==row[0].member_pw){ //검색된 ID가 있을 때 비교

                    request.session.user ={
                        "id" : id
                    }

                    response.render("LoginS", {
                        in_row : row
                    })
                    console.log("로그인 성공" +id);
                }
                else {
                    response.redirect("http://127.0.0.1:5500/NODEJS/game-project/public/ex02LoginF.html");
                    console.log("로그인 실패");
                }
            }
            else{ //검색된 ID가 없을 때
                response.redirect("http://127.0.0.1:5500/NODEJS/game-project/public/ex02LoginF.html");
                console.log("로그인 실패");
            }
        })
        conn.end();

    //response.redirect("http://daum.net");
});


router.post("/Join", function(request, response){

    let member_id = request.body.member_id;
    let member_pw = request.body.member_pw;
    let member_name = request.body.member_name;
    let member_email = request.body.member_email;
    let member_phone = request.body.member_phone;
    let member_lol_name =request.body.member_lol_name;

    conn.connect(); //mysql 연결

    let sql = "insert into member (member_id, member_pw, member_name, member_email, member_phone, member_lol_name) values(?, ?, ?, ?, ?, ?)";

    conn.query(sql,[member_id, member_pw, member_name, member_email, member_phone, member_lol_name], function(err, row){
        if(!err){
            console.log("입력 성공");
            console.log(row);
        }else{
            console.log("입력 실패"+err);
        }
    })
    // conn.end();

});


// router.post("/Join", function(request, response){

//     let member_id = request.body.id;
//     let member_pw = request.body.pw;
//     let member_name = request.body.name;
//     let member_email = request.body.email;
//     let member_phone = request.body.phone;
//     let member_lol_name =request.body.nickname;

//     conn.connect(); //mysql 연결

//     let sql = "insert into member (member_id, member_pw, member_name, member_email, member_phone, member_lol_name) values(?, ?, ?, ?, ?, ?)";

//     conn.query(sql,[member_id, member_pw, member_name, member_email, member_phone, member_lol_name], function(err, row){
//         if(!err){
//             console.log("입력 성공");
//             console.log(row);
//             response.redirect("http://127.0.0.1:5500/NODEJS/0625Express/public/ex02Main.html");
//         }else{
//             console.log("입력 실패"+err);
//         }
//     })
//     conn.end();

// });


router.post("/Delete", function(request, response){

    let id = request.body.id;

    conn.connect(); //mysql 연결

    let sql = "delete from member where member_id = ?";

    conn.query(sql,[id], function(err, row){
        if(!err){
            console.log("삭제 성공");
            response.redirect("http://127.0.0.1:5500/NODEJS/0625Express/public/ex02Main.html");
        }else{
            console.log("삭제 실패"+err);
        }
    })
    conn.end();

});


router.post("/Update", function(request, response){

    let id = request.body.id;
    let choice = request.body.choice;
    let update_data = request.body.update_data;

    conn.connect(); //mysql 연결

    //let sql=""; 이 코드는 만약 이 sql이라는 변수에 한방에 담아서 코드를 간결하게 할꺼면 저렇게 하고, if문 안에 있는 let이라는 문구를 지우면 된다.

    if(choice == "PW"){
        let sql = "update member set member_pw = ? where member_id = ?;";
        conn.query(sql,[update_data, id], function(err, row){
            if(!err){
                console.log("비밀번호 성공");
                response.redirect("http://127.0.0.1:5500/NODEJS/game-project/public/ex02Main.html");
            }else{
                console.log("비밀번호 실패"+err);
            }
        })
        conn.end();
    }

    else if(choice == "EMAIL"){
        let sql = "update member set member_email = ? where member_id = ?;";
        conn.query(sql,[update_data, id], function(err, row){
            if(!err){
                console.log("이메일 성공");
                response.redirect("http://127.0.0.1:5500/NODEJS/game-project/public/ex02Main.html");
            }else{
                console.log("이메일 실패"+err);
            }
        })
        conn.end();
    }
});


router.get("/Select", function(request, response){

    conn.connect(); //mysql 연결
    
    let sql = "select * from member";

    conn.query(sql, function(err, row){
        response.render("select", {
            in_row : row
        })
    })
    conn.end();

});


router.post("/OneSelect", function(request, response){

    let id = request.body.id;

    conn.connect(); //mysql 연결

    let sql = "select * from member where member_id = ?";

    conn.query(sql,[id], function(err, row){
        console.log(row);
        response.render("select", {
            in_row : row
        })
        
    })
    conn.end();

});



router.get("/freecommentjoin", function(request, response){

    conn.connect(); //mysql 연결
    
    let sql = "select f.board_num, f.free_board_title, f.member_lol_name, f.board_text_num,  c.member_lol_name,  c.free_comment_text from free_board f, free_comment c where c.board_text_num = f.board_text_num and f.board_text_num = 1;";

    conn.query(sql, function(err, row){
        console.log(row);
        response.render("free-comment-join", {
            in_row : row
        })
    })
    conn.end();

});

router.get("/qacommentjoin", function(request, response){

    conn.connect(); //mysql 연결
    
    let sql = "select f.board_num, f.qa_board_title, f.member_lol_name, f.board_text_num,  c.member_lol_name,  c.qa_comment_text from qa_board f, qa_comment c where c.board_text_num = f.board_text_num and f.board_text_num = 1;";

    conn.query(sql, function(err, row){
        console.log(row);
        response.render("qa-comment-join", {
            in_row : row
        })
    })
    conn.end();

});

router.get("/free-text", function(request, response){
    
    let free_board_title = request.body.free_board_title;
    let member_lol_name = request.body.member_lol_name;
    let free_board_time = request.body.free_board_time;
    let free_board_text = request.body.free_board_text;

    conn.connect(); //mysql 연결
    
    let sql = "insert into free_board (free_board_title, member_lol_name, free_board_time, free_board_text) values(?,?,?,?)";

    conn.query(sql[free_board_title, member_lol_name, free_board_time, free_board_text], function(err, row){
        console.log(row);
        response.render("free-text", {
            in_row : row
        });
    });
    conn.end();

});



router.get("/text-comment", function(request, response){

    conn.connect(); //mysql 연결
    
    let sql = "select * from member";

    conn.query(sql, function(err, row){
        response.render("select", {
            in_row : row
            
        })
    })
    conn.end();

});









router.get("/index", function (request, response){

    let num1 = 10;
    let num2 = 5;

    response.render("index", {
        in_num1 : num1,
        in_num2 : num2 //key : value
    });//라우터에서 ejs 파일을 실행하기 위한 기능
});



router.post("/Grade", function (request, response){

    let name1 = request.body.name;
    let html1 = request.body.html;
    let css1 = request.body.css;
    let nodejs1 = request.body.nodejs;
    let android1 = request.body.android;

    response.render("grade", {
        in_name : name1,
        in_html : parseInt(html1),
        in_css : parseInt(css1),
        in_nodejs : parseInt(nodejs1),
        in_android : parseInt(android1),
        // avg = in_html+in_css+in_nodejs+android
         //key : value

    });//라우터에서 ejs 파일을 실행하기 위한 기능
});


router.get("/Main", function(request, response){

    //로그인 정보가 없을 때 : undefinded
    //로그인 정보가 있을 때 : object

    console.log("로그인 유무 : "+request.session.user);

    response.render("Main", {
        user: request.session.user

    })
});

router.get("/Logout", function(request, response){

    delete request.session.user;

    console.log("로그인 유무 : "+request.session.user);

    response.render("Main", {
        user : undefined

    })
});

module.exports = router;