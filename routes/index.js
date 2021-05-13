module.exports = function(app, passport) {
    var passport = require('passport');
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "",
        port:3306
    });
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: '',
            pass: ''
        }
   }));

    function NOW_COURSE_TIME(row){
        var w = []
        for(let i=0;i<row.length;i++){
            var x = (row[i].Select_Course_Time).split(" ")
            var y = ""
            var z = 0
            for(let j=0;j<x.length;j++){
                x[j] = x[j].replace(/,/gi,x[j].substring(0,1))
                for(let k=0;k<x[j].length;k++){
                    if(x[j].substring(k,k+1)=='一'||x[j].substring(k,k+1)=='二'||x[j].substring(k,k+1)=='三'||x[j].substring(k,k+1)=='四'||x[j].substring(k,k+1)=='五'||x[j].substring(k,k+1)=='六'||x[j].substring(k,k+1)=='日'){
                        y = x[j].substring(k,k+1)
                        z = k
                    }else if(x[j].substring(k+1,k+2)=='一'||x[j].substring(k+1,k+2)=='二'||x[j].substring(k+1,k+2)=='三'||x[j].substring(k+1,k+2)=='四'||x[j].substring(k+1,k+2)=='五'||x[j].substring(k+1,k+2)=='六'||x[j].substring(k+1,k+2)=='日'){
                        w.push([y,x[j].substring(z+1,k+1),row[i].Select_Course_ID,row[i].Select_Course_Class,row[i].Select_Course_Name])
                    }else if(k==x[j].length-1){
                        w.push([y,x[j].substring(z+1,k+1),row[i].Select_Course_ID,row[i].Select_Course_Class,row[i].Select_Course_Name])
                    }
                }
            }
        }
        return w
    }

    function EVER_COURSE_TIME(result){
        var is_re = true
        var temp = result[0].Course_Time
        for(var i=0;i<temp.length;i++){
            if(temp.substring(i,i+1)==" "){
                is_re = false
            }
        }
        var re_x = []
        if(is_re){
            re_x.push(temp)
        }else{
            re_x = temp.split(" ")
        }
        var re_y = ""
        var re_z = 0
        var re_w = []
        for(let j=0;j<re_x.length;j++){
            re_x[j] = re_x[j].replace(/,/gi,re_x[j].substring(0,1))
            for(let k=0;k<re_x[j].length;k++){
                if(re_x[j].substring(k,k+1)=='一'||re_x[j].substring(k,k+1)=='二'||re_x[j].substring(k,k+1)=='三'||re_x[j].substring(k,k+1)=='四'||re_x[j].substring(k,k+1)=='五'||re_x[j].substring(k,k+1)=='六'||re_x[j].substring(k,k+1)=='日'){
                    re_y = re_x[j].substring(k,k+1)
                    re_z = k
                }else if(re_x[j].substring(k+1,k+2)=='一'||re_x[j].substring(k+1,k+2)=='二'||re_x[j].substring(k+1,k+2)=='三'||re_x[j].substring(k+1,k+2)=='四'||re_x[j].substring(k+1,k+2)=='五'||re_x[j].substring(k+1,k+2)=='六'||re_x[j].substring(k+1,k+2)=='日'){
                    re_w.push([re_y,re_x[j].substring(re_z+1,k+1),result[0].Course_ID,result[0].Course_Class,result[0].Course_Name_Chinese])
                }else if(k==re_x[j].length-1){
                    re_w.push([re_y,re_x[j].substring(re_z+1,k+1),result[0].Course_ID,result[0].Course_Class,result[0].Course_Name_Chinese])
                }
            }
        }
        return re_w
    }

    function IS_HIT(re_w,w){
        var all_true = true
        var cour = []
        var hit = []
        for(let i=0;i<re_w.length;i++){
            for(let j=0;j<w.length;j++){
                if(re_w[i][0]==w[j][0]){
                    if(re_w[i][1]==w[j][1]){
                        all_true = false
                        cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                        hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                    }else if(re_w[i][1]=='A'||w[j][1]=='A'){
                        if(w[j][1]=='1'||w[j][1]=='2'||re_w[i][1]=='1'||re_w[i][1]=='2'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='B'||w[j][1]=='B'){
                        if(w[j][1]=='3'||w[j][1]=='2'||re_w[i][1]=='3'||re_w[i][1]=='2'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='C'||w[j][1]=='C'){
                        if(w[j][1]=='4'||w[j][1]=='5'||re_w[i][1]=='4'||re_w[i][1]=='5'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='D'||w[j][1]=='D'){
                        if(w[j][1]=='5'||w[j][1]=='6'||re_w[i][1]=='5'||re_w[i][1]=='6'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='E'||w[j][1]=='E'){
                        if(w[j][1]=='7'||w[j][1]=='8'||re_w[i][1]=='7'||re_w[i][1]=='8'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='F'||w[j][1]=='F'){
                        if(w[j][1]=='8'||w[j][1]=='9'||re_w[i][1]=='8'||re_w[i][1]=='9'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='G'||w[j][1]=='G'){
                        if(w[j][1]=='10'||w[j][1]=='11'||re_w[i][1]=='10'||re_w[i][1]=='11'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='H'||w[j][1]=='H'){
                        if(w[j][1]=='11'||w[j][1]=='12'||re_w[i][1]=='11'||re_w[i][1]=='12'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='I'||w[j][1]=='I'){
                        if(w[j][1]=='13'||w[j][1]=='14'||re_w[i][1]=='13'||re_w[i][1]=='14'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }else if(re_w[i][1]=='J'||w[j][1]=='J'){
                        if(w[j][1]=='14'||w[j][1]=='15'||re_w[i][1]=='14'||re_w[i][1]=='15'){
                            all_true = false
                            cour.push([re_w[i][0],re_w[i][1],re_w[i][2],re_w[i][3],re_w[i][4]])
                            hit.push([w[j][0],w[j][1],w[j][2],w[j][3],w[j][4]])
                        }
                    }
                }
            }
        }
        var temp = [all_true,cour,hit]
        return temp
    }

    function TEACHER_SUBJECT(search){
        if(search[0]==""){
            search[0] = "無限制"
        }
        if(search[1]==""){
            search[1] = "無限制"
        }
        return search
    }

    function BACHELOR_SELECTION_LAST(result,user,res,te,ad){
        var selection_people = []
        var last_remaining = []
        var student_is_select = []
        for(let i=0;i<result.length;i++){
            var cmd = "select * from selection where Select_Course_ID = ? and Select_Course_Class = ?"
            con.query(cmd,[result[i].Course_ID,result[i].Course_Class],function(err,row){
                var k = 0
                var l = true
                selection_people.push(row.length)
                for(let j=0;j<row.length;j++){
                    if(row[j].Is_Selection){
                        k = k + 1
                    }
                    if(row[j].Select_Student_ID==user.Student_ID){
                        student_is_select.push(true)
                        l = false
                    }
                }
                if(l){
                    student_is_select.push(false)
                }
                last_remaining.push(result[i].Course_People-k)
                if(i==result.length-1){
                    if(ad==1){
                        BACHELOR_RESPONSE1(res,result,user,te,student_is_select,selection_people,last_remaining)
                    }else if(ad==2){
                        BACHELOR_RESPONSE2(res,result,user,te,student_is_select,selection_people,last_remaining)
                    }
                }
            })
        }
    }

    function BACHELOR_RESPONSE1(res,result,user,te,student_is_select,selection_people,last_remaining){
        res.render('next_selection',{
            courses:result,
            co:1,
            user:user,
            grade:te,
            student_is_select:student_is_select,
            selection_people:selection_people,
            last_remaining:last_remaining
        })
    }

    function BACHELOR_RESPONSE2(res,result,user,search,student_is_select,selection_people,last_remaining){
        var sear = TEACHER_SUBJECT(search)
        if(sear[6]==1){
            res.render('next_advanced',{
                courses:result,
                co:11,
                user:user,
                student_is_select:student_is_select,
                selection_people:selection_people,
                last_remaining:last_remaining,
                teacher:sear[0],
                cour_na:sear[1],
                choose_department:sear[2],
                search_time:sear[3],
                all_department:sear[4],
                query_type:sear[5]
            })
        }else if(sear[6]==2){
            res.render('next_advanced_course_information',{
                courses:result,
                co:11,
                user:user,
                teacher:sear[0],
                cour_na:sear[1]
            })
        }
        
    }

    function MASTER_SELECTION_LAST(result,user,res,te,ad){
        var selection_people = []
        var last_remaining = []
        var student_is_select = []
        for(let i=0;i<result.length;i++){
            var cmd = "select * from selection where Select_Course_ID = ? and Select_Course_Class = ?"
            con.query(cmd,[result[i].Course_ID,result[i].Course_Class],function(err,row){
                selection_people.push(row.length)
                var l = true
                for(let j=0;j<row.length;j++){
                    if(row[j].Select_Student_ID==user.Student_ID){
                        student_is_select.push(true)
                        l = false
                    }
                }
                if(result[i].Course_People==0){
                    last_remaining.push("無限制")
                }else{
                    last_remaining.push(result[i].Course_People)
                }
                if(l){
                    student_is_select.push(false)
                }
                if(i==result.length-1){
                    if(ad==1){
                        MASTER_RESPONSE1(res,result,user,te,student_is_select,selection_people,last_remaining)
                    }else if(ad==2){
                        MASTER_RESPONSE2(res,result,user,te,student_is_select,selection_people,last_remaining)
                    }

                }
            })
        }
    }

    function MASTER_RESPONSE1(res,result,user,te,student_is_select,selection_people,last_remaining){
        res.render('next_selection',{
            courses:result,
            co:2,
            user:user,
            grade:te,
            student_is_select:student_is_select,
            selection_people:selection_people,
            last_remaining:last_remaining
        })
    }

    function MASTER_RESPONSE2(res,result,user,search,student_is_select,selection_people,last_remaining){
        var sear = TEACHER_SUBJECT(search)
        if(sear[6]==1){
            res.render('next_advanced',{
                courses:result,
                co:22,
                user:user,
                student_is_select:student_is_select,
                selection_people:selection_people,
                last_remaining:last_remaining,
                teacher:sear[0],
                cour_na:sear[1],
                choose_department:sear[2],
                search_time:sear[3],
                all_department:sear[4],
                query_type:sear[5]
            })
        }else if(sear[6]==2){
            res.render('next_advanced_course_information',{
                courses:result,
                co:22,
                user:user,
                teacher:sear[0],
                cour_na:sear[1]
            })
        }
    }

    function GENERAL_SELECTION_LAST(result,user,res,ge1,ge2,ad){
        var selection_people = []
        var last_remaining = []
        var student_is_select = []
        for(let i=0;i<result.length;i++){
            var cmd = "select * from selection where Select_Course_ID = ? and Select_Course_Class = ?"
            con.query(cmd,[result[i].Course_ID,result[i].Course_Class],function(err,row){
                var k = 0
                var l =true
                selection_people.push(row.length)
                for(let j=0;j<row.length;j++){
                    if(row[j].Select_Student_ID==user.Student_ID){
                        student_is_select.push(true)
                        l = false
                    }
                    if(row[j].Is_Selection){
                        k = k + 1
                    }
                }
                if(l){
                    student_is_select.push(false)
                }
                last_remaining.push(result[i].Course_People-k)
                if(i==result.length-1){
                    if(ad==1){
                    GENERAL_RESPONSE1(res,result,user,ge1,ge2,student_is_select,selection_people,last_remaining)
                    }else if(ad==2){
                        GENERAL_RESPONSE2(res,result,user,ge1,student_is_select,selection_people,last_remaining)
                    }
                }
            })
        }
    }

    function GENERAL_RESPONSE1(res,result,user,ge1,ge2,student_is_select,selection_people,last_remaining){
        res.render('next_selection',{
            courses:result,
            co:3,
            user:user,
            ge1:ge1,
            ge2:ge2,
            student_is_select:student_is_select,
            selection_people:selection_people,
            last_remaining:last_remaining
        })
    }

    function GENERAL_RESPONSE2(res,result,user,search,student_is_select,selection_people,last_remaining){
        var sear = TEACHER_SUBJECT(search)
        if(sear[6]==1){
            res.render('next_advanced',{
                courses:result,
                co:33,
                user:user,
                student_is_select:student_is_select,
                selection_people:selection_people,
                last_remaining:last_remaining,
                teacher:sear[0],
                cour_na:sear[1],
                choose_department:sear[2],
                search_time:sear[3],
                all_department:sear[4],
                query_type:sear[5]
            })
        }else if(sear[6]==2){
            res.render('next_advanced_course_information',{
                courses:result,
                co:33,
                user:user,
                teacher:sear[0],
                cour_na:sear[1]
            })
        }
    }

    function GE2_TE_GE1(re,co){
        var ge2 = re['ge2']
        var te = "一年級科目列表"
        var ge1 = "博雅通識"
        if(co==1 || co==2){
            if(re['grade']==1){
                te = "一年級科目列表"
            }else if(re['grade']==2){
                te = "二年級科目列表"
            }else if(re['grade']==3){
                te = "三年級科目列表"
            }else if(re['grade']==4){   
                te = "四年級科目列表"
            }     
        }
        else{
            if(ge2=="中國語文知識與應用"||ge2=="英文能力訓練"||ge2=="資訊能力課程"||ge2=="基礎概論課程"){
                ge1 = "基礎通識"
            }
        }
        return ge2,te,ge1
    }

    function INSERT_COURSE(result,add,user,xx){
        var cmd = "INSERT INTO selection SET Select_Course_ID=?,Select_Course_Class=?,Select_Student_ID=?,Is_Selection=?,Select_Course_Time=?,Select_Course_Name=?,Select_Credit=?"
        if(result[0].Selection_Rule=="不需篩選"){
            con.query(cmd,[add[xx][0],add[xx][1],user['Student_ID'],true,result[0].Course_Time,result[0].Course_Name_Chinese,result[0].Course_Credit] , function(err, result){
                if(err) throw err;
                console.log(result);
            });
        }
        else{
            con.query(cmd,[add[xx][0],add[xx][1],user['Student_ID'],false,result[0].Course_Time,result[0].Course_Name_Chinese,result[0].Course_Credit] , function(err, result){
                if(err) throw err;
                console.log(result);
            });
        }
    }

    function ACADEMY_CATEGORY(rows){
        var literature = []
        var science = []
        var society = []
        var engineering = []
        var management = []
        var law = []
        var education = []
        var other = []
        for(let i=0;i<rows.length;i++){
            if(rows[i].Course_Academy=="文學院"){
                literature.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="理學院"){
                science.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="社會科學學院"){
                society.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="工學院"){
                engineering.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="管理學院"){
                management.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="法學院"){
                law.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="教育學院"){
                education.push(rows[i].Course_department)
            }
            else if(rows[i].Course_Academy=="其他"){
                other.push(rows[i].Course_department)
            }
        }
        var len = [literature.length,science.length,society.length,engineering.length,management.length,law.length,education.length,other.length]
        var academy=len[0]
        for(let i=0;i<7;i++){
            if(len[i]<len[i+1]){
                academy = len[i+1]
            }
        }
        var x = [literature,science,society,engineering,management,law,education,other,academy]
        return x
    }

    function ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result,query_type,search_time_time,user,res,adv,abc){
        var id = []
        var cla = []
        for(let i=0;i<result.length;i++){
            var x = result[i].Course_Time
            var v = x.split(" ")
            var cour_time = []
            var z = []
            var y = ""
            var w = 0
            for(let j=0;j<v.length;j++){
                v[j] = v[j].replace(/,/gi,v[j].substring(0,1))
                for(let k=0;k<v[j].length;k++){
                    if(v[j].substring(k,k+1)=='一'||v[j].substring(k,k+1)=='二'||v[j].substring(k,k+1)=='三'||v[j].substring(k,k+1)=='四'||v[j].substring(k,k+1)=='五'||v[j].substring(k,k+1)=='六'||v[j].substring(k,k+1)=='日'){
                        y = v[j].substring(k,k+1)
                        w = k
                    }else if(v[j].substring(k+1,k+2)=='一'||v[j].substring(k+1,k+2)=='二'||v[j].substring(k+1,k+2)=='三'||v[j].substring(k+1,k+2)=='四'||v[j].substring(k+1,k+2)=='五'||v[j].substring(k+1,k+2)=='六'||v[j].substring(k+1,k+2)=='日'){
                        z = [y,v[j].substring(w+1,k+1)]
                        cour_time.push(z)
                    }else if(k==v[j].length-1){
                        z = [y,v[j].substring(w+1,k+1)]
                        cour_time.push(z)
                    }
                }
            }
            var counter = []
            for(let j=0;j<cour_time.length;j++){
                if(query_type=='query_only'){
                    for(let k=0;k<search_time_time.length;k++){
                        if(cour_time[j][0]==search_time_time[k][0]){
                            if(cour_time[j][1]==search_time_time[k][1]){
                                counter.push(true)
                            }
                        }
                    }
                    if(j==cour_time.length-1){
                        if(counter.length==cour_time.length){
                            id.push(result[i].Course_ID)
                            cla.push(result[i].Course_Class)
                        }
                    }
                }else if(query_type=='query_all'){
                    for(let k=0;k<search_time_time.length;k++){
                        if(cour_time[j][0]==search_time_time[k][0]){
                            if(cour_time[j][1]==search_time_time[k][1]){
                                if(id[id.length-1]!=result[i].Course_ID||cla[cla.length-1]!=result[i].Course_Class){
                                    id.push(result[i].Course_ID)
                                    cla.push(result[i].Course_Class)
                                }
                            }
                        }
                    }
                }
            }
            var result_result = []
            if(i==result.length-1){
                for(let j=0;j<result.length;j++){
                    for(let k=0;k<id.length;k++){
                        if(result[j].Course_ID==id[k]&&result[j].Course_Class==cla[k]){
                            result_result.push(result[j])
                        }
                    }
                    if(j==result.length-1){
                        if(result_result.length!=0){
                            search = [search_teacher,search_subject,choose_department,search_time,all_department,query_type,abc]
                            if(adv==1){
                                BACHELOR_SELECTION_LAST(result_result,user,res,search,2)
                            }else if(adv==2){
                                MASTER_SELECTION_LAST(result_result,user,res,search,2)
                            }else if(adv==3){
                                GENERAL_SELECTION_LAST(result_result,user,res,search,1,2)
                            }else if(adv==4){
                                ALL_SELECTION_LAST(result_result,user,res,search,abc)
                            }
                        }else{
                            TIME_NO_COURSE(res,user)
                        }
                    }
                }
            }
        }
    }

    function ALL_SELECTION_LAST(result,user,res,search,abc){
        if(abc==1){
            var selection_people = []
            var last_remaining = []
            var student_is_select = []
            for(let i=0;i<result.length;i++){
                var cmd = "select * from selection where Select_Course_ID = ? and Select_Course_Class = ?"
                con.query(cmd,[result[i].Course_ID,result[i].Course_Class],function(err,row){
                    var k=0
                    var l = true
                    selection_people.push(row.length)
                    for(let j=0;j<row.length;j++){
                        if(row[j].Select_Student_ID==user.Student_ID){
                            student_is_select.push(true)
                            l = false
                        }
                    }
                    if(result[i].co==2){
                        if(result[i].Course_People==0){
                            last_remaining.push("無限制")
                        }else{
                            last_remaining.push(result[i].Course_People)
                        }
                    }else if(result[i].co==1||result[i].co==3){
                        for(let j=0;j<row.length;j++){
                            if(row[j].Is_Selection){
                                k = k + 1
                            }
                        }
                        last_remaining.push(result[i].Course_People-k)
                    }
                    if(l){
                        student_is_select.push(false)
                    }
                    if(i==result.length-1){
                        var sear = TEACHER_SUBJECT(search)
                        res.render('next_advanced',{
                            courses:result,
                            co:44,
                            user:user,
                            student_is_select:student_is_select,
                            selection_people:selection_people,
                            last_remaining:last_remaining,
                            teacher:sear[0],
                            cour_na:sear[1],
                            choose_department:sear[2],
                            search_time:sear[3],
                            all_department:sear[4],
                            query_type:sear[5]
                        })
                    }
                })
            }
        }else if(abc==2){
            var sear = TEACHER_SUBJECT(search)
            res.render('next_advanced_course_information',{
                courses:result,
                co:44,
                user:user,
                teacher:sear[0],
                cour_na:sear[1]
            })
        }
    }

    function TIME_NO_COURSE(res,user){
        res.render('advanced_no_course',{
            user:user
        })
    }

    function ADVANCED_COURSE(res,user,body,abc){
        var choose_department = body['choose_department']
        var search_teacher = body['teacher']
        var search_subject = body['subject']
        if(search_teacher=="無限制"){
            search_teacher = ""
        }
        if(search_subject=="無限制"){
            search_subject = ""
        }
        var search_time = body['time']
        var query_type = body['query_type']
        var search_time_time = []
        var all_department = body['all_department']
        if(typeof search_time == "string"){
            var Time_Is_First_String = true
            var Time_Is_Second_String = true
            for(let i=0;i<search_time.length;i++){
                if(search_time.substring(i,i+1)==","){
                    Time_Is_First_String = false
                    if(search_time.substring(i+1,i+2)=="_"){
                        Time_Is_Second_String = false
                    }
                }
            }
            if(Time_Is_First_String){
                var a = search_time.split("_")
                search_time_time.push(a)
            }else if(Time_Is_Second_String){
                var a = search_time.split(",")
                for(let i=0;i<a.length;i++){
                    var b = a[i].split("_")
                    search_time_time.push(b)
                }
            }else{
                var a = search_time.replace(/,/gi,"")
                var b = a.split("_")
                search_time_time.push(b)
            }
        }else if(typeof search_time == "object"){
            for(let i=0;i<search_time.length;i++){
                var a = search_time[i].split("_")
                search_time_time.push(a)
            }
        }
        if(search_time==undefined){
            TIME_NO_COURSE(res,user)
        }else if(typeof choose_department=='string'&&all_department!="all_department"){
            if(search_teacher==""&&search_subject==""){
                var cmd = "select * from bachelor_courses where Course_Department = ?"
                con.query(cmd,[choose_department],function(err, result){
                    if(result.length!=0){
                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result,query_type,search_time_time,user,res,1,abc)
                    }else{
                        var cmd1 = "select * from master_courses where Course_Department = ?"
                        con.query(cmd1,[choose_department],function(err, result1){
                            if(result1.length!=0){
                                ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result1,query_type,search_time_time,user,res,2,abc)
                            }else{
                                var cmd2 = "select * from general_courses where Course_Department = ?"
                                con.query(cmd2,[choose_department],function(err,result2){
                                    if(result2.length!=0){
                                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result2,query_type,search_time_time,user,res,3,abc)
                                    }else{
                                        TIME_NO_COURSE(res,user)
                                    }
                                })
                            }
                        })
                    }
                })
            }else if(search_teacher!=""&&search_subject!=""){
                var cmd = "select * from bachelor_courses where Course_Department = ? and Course_Teacher = ? and Course_Name_Chinese = ?"
                con.query(cmd,[choose_department,search_teacher,search_subject],function(err, result){
                    if(result.length!=0){
                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result,query_type,search_time_time,user,res,1,abc)
                    }else{
                        var cmd1 = "select * from master_courses where Course_Department = ? and Course_Teacher = ? and Course_Name_Chinese = ?"
                        con.query(cmd1,[choose_department,search_teacher,search_subject],function(err, result1){
                            if(result1.length!=0){
                                ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result1,query_type,search_time_time,user,res,2,abc)
                            }else{
                                var cmd2 = "select * from general_courses where Course_Department = ? and Course_Teacher = ? and Course_Name_Chinese = ?"
                                con.query(cmd2,[choose_department,search_teacher,search_subject],function(err,result2){
                                    if(result2.length!=0){
                                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result2,query_type,search_time_time,user,res,3,abc)
                                    }else{
                                        TIME_NO_COURSE(res,user)
                                    }
                                })
                            }
                        })
                    }
                })
            }else if(search_teacher!=""){
                var cmd = "select * from bachelor_courses where Course_Department = ? and Course_Teacher = ?"
                con.query(cmd,[choose_department,search_teacher],function(err, result){
                    if(result.length!=0){
                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result,query_type,search_time_time,user,res,1,abc)
                    }else{
                        var cmd1 = "select * from master_courses where Course_Department = ? and Course_Teacher = ?"
                        con.query(cmd1,[choose_department,search_teacher],function(err, result1){
                            if(result1.length!=0){
                                ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result1,query_type,search_time_time,user,res,2,abc)
                            }else{
                                var cmd2 = "select * from general_courses where Course_Department = ? and Course_Teacher = ?"
                                con.query(cmd2,[choose_department,search_teacher],function(err,result2){
                                    if(result2.length!=0){
                                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result2,query_type,search_time_time,user,res,3,abc)
                                    }else{
                                        TIME_NO_COURSE(res,user)
                                    }
                                })
                            }
                        })
                    }
                })
            }else if(search_subject!=""){
                var cmd = "select * from bachelor_courses where Course_Department = ? and Course_Name_Chinese = ?"
                con.query(cmd,[choose_department,search_subject],function(err, result){
                    if(result.length!=0){
                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result,query_type,search_time_time,user,res,1,abc)
                    }else{
                        var cmd1 = "select * from master_courses where Course_Department = ? and Course_Name_Chinese = ?"
                        con.query(cmd1,[choose_department,search_subject],function(err, result1){
                            if(result1.length!=0){
                                ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result1,query_type,search_time_time,user,res,2,abc)
                            }else{
                                var cmd2 = "select * from general_courses where Course_Department = ? and Course_Name_Chinese = ?"
                                con.query(cmd2,[choose_department,search_subject],function(err,result2){
                                    if(result2.length!=0){
                                        ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result2,query_type,search_time_time,user,res,3,abc)
                                    }else{
                                        TIME_NO_COURSE(res,user)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }else if(all_department=="all_department"){
            if(search_teacher==""&&search_subject==""){
                var result3 = []
                var cmd = "select * from bachelor_courses"
                con.query(cmd,function(err, result){
                    for(let i=0;i<result.length;i++){
                        result[i].co=1
                        result3.push(result[i])
                    }
                    var cmd1 = "select * from master_courses"
                    con.query(cmd1,function(err, result1){
                        for(let i=0;i<result1.length;i++){
                            result1[i].co=2
                            result3.push(result1[i])
                        }
                        var cmd2 = "select * from general_courses"
                        con.query(cmd2,function(err,result2){
                            for(let i=0;i<result2.length;i++){
                                result2[i].co=3
                                result3.push(result2[i])
                            }
                            ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result3,query_type,search_time_time,user,res,4,abc)
                        })
                    })
                })
            }else if(search_teacher!=""&&search_subject!=""){
                var result3 = []
                var cmd = "select * from bachelor_courses where Course_Teacher = ? and Course_Name_Chinese = ?"
                con.query(cmd,[search_teacher,search_subject],function(err, result){
                    for(let i=0;i<result.length;i++){
                        result[i].co=1
                        result3.push(result[i])
                    }
                    var cmd1 = "select * from master_courses where Course_Teacher = ? and Course_Name_Chinese = ?"
                    con.query(cmd1,[search_teacher,search_subject],function(err, result1){
                        for(let i=0;i<result1.length;i++){
                            result1[i].co=2
                            result3.push(result1[i])
                        }
                        var cmd2 = "select * from general_courses where Course_Teacher = ? and Course_Name_Chinese = ?"
                        con.query(cmd2,[search_teacher,search_subject],function(err,result2){
                            for(let i=0;i<result2.length;i++){
                                result2[i].co=3
                                result3.push(result2[i])
                            }
                            ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result3,query_type,search_time_time,user,res,4,abc)
                        })
                    })
                })
            }else if(search_subject!=""){
                var result3 = []
                var cmd = "select * from bachelor_courses where Course_Name_Chinese = ?"
                con.query(cmd,[search_subject],function(err, result){
                    for(let i=0;i<result.length;i++){
                        result[i].co=1
                        result3.push(result[i])
                    }
                    var cmd1 = "select * from master_courses where Course_Name_Chinese = ?"
                    con.query(cmd1,[search_subject],function(err, result1){
                        for(let i=0;i<result1.length;i++){
                            result1[i].co=2
                            result3.push(result1[i])
                        }
                        var cmd2 = "select * from general_courses where Course_Name_Chinese = ?"
                        con.query(cmd2,[search_subject],function(err,result2){
                            for(let i=0;i<result2.length;i++){
                                result2[i].co=3
                                result3.push(result2[i])
                            }
                            ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result3,query_type,search_time_time,user,res,4,abc)
                        })
                    })
                })
            }else if(search_teacher!=""){
                var result3 = []
                var cmd = "select * from bachelor_courses where Course_Teacher = ?"
                con.query(cmd,[search_teacher],function(err, result){
                    for(let i=0;i<result.length;i++){
                        result[i].co=1
                        result3.push(result[i])
                    }
                    var cmd1 = "select * from master_courses where Course_Teacher = ?"
                    con.query(cmd1,[search_teacher],function(err, result1){
                        for(let i=0;i<result1.length;i++){
                            result1[i].co=2
                            result3.push(result1[i])
                        }
                        var cmd2 = "select * from general_courses where Course_Teacher = ?"
                        con.query(cmd2,[search_teacher],function(err,result2){
                            for(let i=0;i<result2.length;i++){
                                result2[i].co=3
                                result3.push(result2[i])
                            }
                            ADVANCED(search_teacher,search_subject,choose_department,search_time,all_department,result3,query_type,search_time_time,user,res,4,abc)
                        })
                    })
                })
            }
        }else{
            TIME_NO_COURSE(res,user)
        }
    }

    function ADVANCED_PRODUCT(res,user,abc){
        var cmd ="(select distinct Course_Academy,Course_department from bachelor_courses)union(select distinct Course_Academy,Course_department from master_courses)union(select distinct Course_Academy,Course_department from general_courses)";
        
        con.query(cmd, function (err, result){
            var stu_cmd = "select * from selection where Select_Student_ID = ?"
            con.query(stu_cmd,[user['Student_ID']],function(err, row){     
                var w = ""
                if(row.length!=0){
                    for(let i=0;i<row.length;i++){ 
                        var x = (row[i].Select_Course_Time).split(" ")
                        var y = ""
                        var z = 0
                        for(let j=0;j<x.length;j++){
                            x[j] = x[j].replace(/,/gi,x[j].substring(0,1))
                            for(let k=0;k<x[j].length;k++){
                                if(x[j].substring(k,k+1)=='一'||x[j].substring(k,k+1)=='二'||x[j].substring(k,k+1)=='三'||x[j].substring(k,k+1)=='四'||x[j].substring(k,k+1)=='五'||x[j].substring(k,k+1)=='六'||x[j].substring(k,k+1)=='日'){
                                    y = x[j].substring(k,k+1)
                                    z = k
                                }else if(x[j].substring(k+1,k+2)=='一'||x[j].substring(k+1,k+2)=='二'||x[j].substring(k+1,k+2)=='三'||x[j].substring(k+1,k+2)=='四'||x[j].substring(k+1,k+2)=='五'||x[j].substring(k+1,k+2)=='六'||x[j].substring(k+1,k+2)=='日'){
                                    w = w+y+"_"+x[j].substring(z+1,k+1)+" "
                                }else if(k==x[j].length-1){
                                    w = w+y+"_"+x[j].substring(z+1,k+1)+" "
                                }
                            }
                        }
                        if(i==row.length-1){
                            var lesson =[['A','1','2'],['B','2','3'],['C','4','5'],['D','5','6'],['E','7','8'],['F','8','9'],['G','10','11'],['H','11','12'],['I','13','14'],['J','14','15']]
                            var a = w.split(" ")
                            var b = []
                            for(let j=0;j<a.length-1;j++){
                                b.push(a[j].split("_"))
                            }
                            var c = b
                            for(let j=0;j<a.length-1;j++){
                                var d = true
                                var d1 = true
                                var d2 = true
                                var d_d = 0
                                var d1_1 = 0
                                var d2_2 = 0
                                for(let m=0;m<10;m++){
                                    for(let n=0;n<3;n++){
                                        if(b[j][1]==lesson[m][n]){
                                            d_d = m
                                            d1_1 = m
                                            d2_2 = m
                                            for(let o=0;o<c.length;o++){
                                                if(b[j][0]==c[o][0]){
                                                    if(n>0){
                                                        if(c[o][1]==lesson[m][0]){
                                                            d = false
                                                        }
                                                    }else{
                                                        d = false
                                                        if(c[o][1]==lesson[m][1]){
                                                            d1 = false
                                                        }
                                                        if(c[o][1]==lesson[m][2]){
                                                            d2 = false
                                                        }
                                                    }
                                                }
                                            }
                                            break
                                        }
                                    }
                                }
                                if(d){
                                    c.push(b[j][0],lesson[d_d][0])
                                    w = w + b[j][0]+'_'+lesson[d_d][0]+' '
                                }else{
                                    if(d1){
                                        c.push(b[j][0],lesson[d1_1][1])
                                        w = w + b[j][0]+'_'+lesson[d1_1][1]+' '
                                    }
                                    if(d2){
                                        c.push(b[j][0],lesson[d2_2][2])
                                        w = w + b[j][0]+'_'+lesson[d2_2][2]+' '
                                    }
                                }
                            }
                            if(abc==1){
                                res.render('advanced_course',{
                                    user:user,
                                    result:result,
                                    stu_cour:w
                                })
                            }else if(abc==2){
                                res.render('advanced_course_information',{
                                    user:user,
                                    result:result,
                                    stu_cour:w
                                })
                            }
                        }
                    }
                }
                else{
                    if(abc==1){
                        res.render('advanced_course',{
                            user:user,
                            result:result,
                            stu_cour:""
                        })
                    }else if(abc==2){
                        res.render('advanced_course_information',{
                            user:user,
                            result:result,
                            stu_cour:w
                        })
                    }
                }
            })
        })
    }

    function WITHDRAW(user,res,abc){
        var cmd_course = "select * from selection where Select_Student_ID = ?"
        var all_course = []
        con.query(cmd_course,[user['Student_ID']],function(err,stu_course){
            if(stu_course.length!=0){
                for(let i=0;i<stu_course.length;i++){
                    var bachelor_cmd = "select * from bachelor_courses where Course_ID = ? and Course_Class = ?"
                    con.query(bachelor_cmd,[stu_course[i].Select_Course_ID,stu_course[i].Select_Course_Class],function(err,bac_course){
                        if(bac_course.length!=0){
                            WITHDRAW_COURSE_PUSH(all_course,bac_course[0],i,stu_course.length-1,user,res,abc,stu_course[i].Is_Selection)
                        }else{
                            var master_cmd = "select * from master_courses where Course_ID = ? and Course_Class = ?"
                            con.query(master_cmd,[stu_course[i].Select_Course_ID,stu_course[i].Select_Course_Class],function(err,mas_course){
                                if(mas_course.length!=0){
                                    WITHDRAW_COURSE_PUSH(all_course,mas_course[0],i,stu_course.length-1,user,res,abc,stu_course[i].Is_Selection)
                                }else{
                                    var general_cmd = "select * from general_courses where Course_ID = ? and Course_Class = ?"
                                    con.query(general_cmd,[stu_course[i].Select_Course_ID,stu_course[i].Select_Course_Class],function(err,gen_course){
                                        if(gen_course.length!=0){
                                            WITHDRAW_COURSE_PUSH(all_course,gen_course[0],i,stu_course.length-1,user,res,abc,stu_course[i].Is_Selection)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }else{
                res.render('no_course',{
                    user:user
                })
            }
        })
    }

    function WITHDRAW_COURSE_PUSH(all_course,course,i,j,user,res,abc,Is_Selection){
        var x = course.Course_ID + " " + course.Course_Class
        if(abc==1){
            all_course.push([course.Course_ID,course.Course_Name_Chinese,course.Course_Teacher,course.Course_Class,course.Course_Credit,course.Course_Category,course.Course_Time,course.Course_Classroom,x])
        }else if(abc==2){
            all_course.push([course.Course_ID,course.Course_Name_Chinese,course.Course_Teacher,course.Course_Class,course.Course_Credit,course.Course_Category,course.Course_Time,course.Course_Classroom,course.Course_Outline,Is_Selection])
        }
        if(i==j){
            GO_TO_WITHDRAW(all_course,user,res,abc)
        }else{
            return all_course
        }
    }

    function GO_TO_WITHDRAW(all_course,user,res,abc){
        if(abc==1){
            res.render('withdraw',{
                courses:all_course,
                user:user
            })
        }else if(abc==2){
            var lesson_day = ['一','二','三','四','五','六','日']
            var lesson = [[1,2,'A',3,'B'],[4,5,'c',6,'D'],[7,8,'E',9,'F'],[10,11,'G',12,'H'],[13,14,'I',15,'J']]
            var schedule = [[[],[],[],[],[]],[[],[],[],[],[]],[[],[],[],[],[]],[[],[],[],[],[]],[[],[],[],[],[]],[[],[],[],[],[]],[[],[],[],[],[]]]
            for(let i=0;i<all_course.length;i++){
                var space = all_course[i][6].split(" ")
                for(let j=0;j<space.length;j++){
                    space[j] = space[j].replace(/,/gi,"_"+space[j].substring(0,1))
                    var line = space[j].split("_")
                    for(let k=0;k<line.length;k++){
                        for(let x=0;x<7;x++){
                            if(line[k].substring(0,1)==lesson_day[x]){
                                for(let y=0;y<5;y++){
                                    for(let z=0;z<5;z++){
                                        if(lesson[y][z]==line[k].substring(1,4)){
                                            if(schedule[x][y].length!=0){
                                                var Is_Push = true
                                                for(let w=0;w<schedule[x][y].length;w++){
                                                    var temp2 = schedule[x][y][w].substring(1,schedule[x][y][w].length)
                                                    var temp = temp2.split(")")
                                                    for(let v=0;v<5;v++){
                                                        if(lesson[y][v]==temp[0]){
                                                            if(v>y){
                                                                var temp1 = schedule[x][y]
                                                                schedule[x][y] = []
                                                                for(let m=0;m<temp1.length;m++){
                                                                    if(z>v){
                                                                        schedule[x][y].push(temp1[i])
                                                                    }else if(z==v){
                                                                        Is_Push = false
                                                                        schedule[x][y].push("("+line[k].substring(1,4)+")"+all_course[i][1])
                                                                        schedule[x][y].push(temp1[m])
                                                                    }else if(z<v){
                                                                        schedule[x][y].push(temp1[m])
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if(Is_Push){
                                                    schedule[x][y].push("("+line[k].substring(1,4)+")"+all_course[i][1])
                                                }
                                            }else{
                                                schedule[x][y].push("("+line[k].substring(1,4)+")"+all_course[i][1])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            res.render('curriculum',{
                schedule:schedule,
                courses:all_course,
                user:user
            })
        }
    }

    function COURSE_COMMENT(user,res,abc,body){
        var cmd ="(select distinct Course_Academy,Course_department from bachelor_courses)union(select distinct Course_Academy,Course_department from master_courses)union(select distinct Course_Academy,Course_department from general_courses)"
        con.query(cmd,function(err,result){
            var x = ACADEMY_CATEGORY(result)
            var literature = x[0]
            var science = x[1]
            var society = x[2]
            var engineering = x[3]
            var management = x[4]
            var law = x[5]
            var education = x[6]
            var other = x[7]
            var academy = ['文學院','理學院','社會科學學院','工學院','管理學院','法學院','教育學院','其他']
            var new_comment_cmd = "select * from course_comment order by C_id desc"
            con.query(new_comment_cmd,function(err,row){
                if(abc==1){
                    res.render('course_comment',{
                        user:user,
                        result:result,
                        literature:literature,
                        science:science,
                        society:society,
                        engineering:engineering,
                        management:management,
                        law:law,
                        education:education,
                        other:other,
                        academy:academy,
                        row:row
                    })
                }else if(abc==2){
                    if(body['all_department']==undefined){
                        if(body['subject']==""&&body['teacher']==""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Department = ?"
                            con.query(comment_cmd,[body['department']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }else if(body['subject']!=""&&body['teacher']!=""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Department = ? and Course_Name = ? and Course_Teacher = ?"
                            con.query(comment_cmd,[body['department'],body['subject'],body['teacher']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }else if(body['subject']!=""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Department = ? and Course_Name = ?"
                            con.query(comment_cmd,[body['department'],body['subject']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }else if(body['teacher']!=""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Department = ? and Course_Teacher = ?"
                            con.query(comment_cmd,[body['department'],body['teacher']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }
                    }else if(body['all_department']=="all_department"){
                        if(body['subject']==""&&body['teacher']==""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment"
                            con.query(comment_cmd,function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }else if(body['subject']!=""&&body['teacher']!=""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Name = ? and Course_Teacher = ?"
                            con.query(comment_cmd,[body['subject'],body['teacher']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }else if(body['subject']!=""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Name = ?"
                            con.query(comment_cmd,[body['subject']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }else if(body['teacher']!=""){
                            var comment_cmd = "select distinct Comment_Course_ID_Class,Course_Department,Course_Teacher,Course_Name from course_comment where Course_Teacher = ?"
                            con.query(comment_cmd,[body['teacher']],function(err,result1){
                                GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1)
                            })
                        }
                    }
                }
            })
        })
    }

    function GET_COURSE_COMMENT(res,user,result,literature,science,society,engineering,management,law,education,other,academy,row,result1){
        if(result1.length!=0){
            var cou_id = []
            for(let i=0;i<result1.length;i++){
                var temp = result1[i].Comment_Course_ID_Class
                var temp1 = temp.split(",")
                cou_id.push(temp1[0])
            }
            res.render('next_course_comment',{
                user:user,
                result:result,
                literature:literature,
                science:science,
                society:society,
                engineering:engineering,
                management:management,
                law:law,
                education:education,
                other:other,
                academy:academy,
                row:row,
                have:1,
                result1:result1,
                cou_id:cou_id
            })
        }else{
            res.render('next_course_comment',{
                user:user,
                result:result,
                literature:literature,
                science:science,
                society:society,
                engineering:engineering,
                management:management,
                law:law,
                education:education,
                other:other,
                academy:academy,
                row:row,
                have:2
            })
        }
    }

    function THIS_COURSE_COMMENT(body,res,user){
        var cmd = 'select * from course_comment where Comment_Course_ID_Class = ? order by C_Id DESC'
        con.query(cmd,[body['Comment_Course_ID_Class']],function(err,result){
            var temp = body['Comment_Course_ID_Class']
            var Course_ID_Class = temp.split(',')
            res.render('this_course_comment',{
                temp:temp,
                user:user,
                result:result,
                Course_ID_Class:Course_ID_Class
            })
        })
    }

    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index');
    });

    app.get('/announce_id_20090601', function(req, res, next) {
        res.render('announce_id_20090601');
    });
  
    app.get('/announce_id_20110913', function(req, res, next) {
        res.render('announce_id_20110913');
    });
  
    app.get('/announce_id_20120912', function(req, res, next) {
        res.render('announce_id_20120912');
    });
  
    app.get('/announce_id_20130905', function(req, res, next) {
        res.render('announce_id_20130905');
    });
  
    app.get('/announce_id_20140101', function(req, res, next) {
        res.render('announce_id_20140101');
    });
  
    app.get('/announce_id_20141230', function(req, res, next) {
        res.render('announce_id_20141230');
    });
  
    app.get('/announce_id_20200212', function(req, res, next) {
        res.render('announce_id_20200212');
    });
  
    app.get('/announce_id_20201130', function(req, res, next) {
        res.render('announce_id_20201130');
    });
  
    app.get('/announce_id_20201210', function(req, res, next) {
        res.render('announce_id_20201210');
    });

    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/'
    }));
    app.get('/loginSuccess',isLoggedIn,function(req, res) {
        res.render('loginSuccess', 
        { 
            user:req.user
        });
    });
    app.get('/general_question',isLoggedIn,function(req, res) {
        res.render('general_question', 
        { 
            user:req.user
        });
    });
    app.get('/additional_selection',isLoggedIn,function(req, res) {
        var cmd ="(select distinct Course_Academy,Course_department from bachelor_courses)union(select distinct Course_Academy,Course_department from master_courses)union(select distinct Course_Academy,Course_department from general_courses)";
        con.query(cmd, function (err, rows, fields) {
            var x = ACADEMY_CATEGORY(rows)
            var literature = x[0]
            var science = x[1]
            var society = x[2]
            var engineering = x[3]
            var management = x[4]
            var law = x[5]
            var education = x[6]
            var other = x[7]
            var academy = x[8]
            
            res.render('additional_selection', 
            { 
                user:req.user,
                literature: literature,
                science: science,
                society: society,
                engineering: engineering,
                management: management,
                law: law,
                education: education,
                other: other,
                academy:academy
            });
        });
    });
    app.post('/selection',function(req,res){
        var department = req.body['department']
        var grade = req.body['GRADE']
        var te = "一年級科目列表"
        var ge2 = req.body['DIMENSION']
        var ge1 = "博雅通識"
        if(ge2=="中國語文知識與應用"||ge2=="英文能力訓練"||ge2=="資訊能力課程"||ge2=="基礎概論課程"){
            ge1 = "基礎通識"
        }
        if(grade==1){
            te = "一年級科目列表"
        }else if(grade==2){
            te = "二年級科目列表"
        }else if(grade==3){
            te = "三年級科目列表"
        }else if(grade==4){
            te = "四年級科目列表"
        }
        var cmd = "select * from bachelor_courses where Course_Department = ?";
        con.query(cmd,[department],function(err,result){
            if(result.length!=0){
                var next_cmd = "select * from bachelor_courses where Course_Department = ? and Course_Grade = ?";
                con.query(next_cmd,[department,grade],function(err,new_result){
                    if(new_result.length!=0){
                        BACHELOR_SELECTION_LAST(new_result,req.user,res,te,1)
                    }else{
                        BACHELOR_SELECTION_LAST(result,req.user,res,te,1)
                    }
                })
            }
            else{
                var cmd = "select * from master_courses where Course_Department = ?";
                con.query(cmd,[department],function(err,result){
                    if(result.length!=0){
                        MASTER_SELECTION_LAST(result,req.user,res,te,1)
                    }
                    else{
                        var cmd = "select * from general_courses where Course_Dimension = ?";
                        con.query(cmd,[ge2],function(err,result){
                            if(result.length!=0){
                                GENERAL_SELECTION_LAST(result,req.user,res,ge1,ge2,1)
                            }
                        })
                    }
                })
            }
        })
    })
    app.post('/select_course',function(req,res){
        var text = req.body['course']
        var co = req.body['co']
        var add = []
        if(typeof text == "string"){
            add.push(text.split(" "))
        }else{
            for(let i=0;i<text.length;i++){
                add.push(text[i].split(" "))
            }
        }
        var SID = req.user['Student_ID']
        var s_cmd = "select * from selection where Select_Student_ID =?"
        var have = []
        var hit = []
        var have_hit = true
        var b = []
        for(let xx=0;xx<add.length;xx++){
            var cmd
            if(co==2||co==22){
                cmd= "(select * from master_courses left join others on others.Others_Course_ID = master_courses.Course_ID and others.Others_Course_Class = master_courses.Course_Class where Course_ID = ? and Course_Class = ?)"
            }else if(co==3||co==33){
                cmd = "(select * from general_courses left join others on others.Others_Course_ID = general_courses.Course_ID and others.Others_Course_Class = general_courses.Course_Class where Course_ID = ? and Course_Class = ?)"
            }else if(co==1||co==11){
                cmd = "(select * from bachelor_courses left join others on others.Others_Course_ID = bachelor_courses.Course_ID and others.Others_Course_Class = bachelor_courses.Course_Class where Course_ID = ? and Course_Class = ?)"
            }else if(co==44){
                if(add[xx][2]=="通識教育中心"){
                    cmd = "(select * from general_courses left join others on others.Others_Course_ID = general_courses.Course_ID and others.Others_Course_Class = general_courses.Course_Class where Course_ID = ? and Course_Class = ?)"
                }else if(add[xx][3]!="x"){
                    cmd= "(select * from master_courses left join others on others.Others_Course_ID = master_courses.Course_ID and others.Others_Course_Class = master_courses.Course_Class where Course_ID = ? and Course_Class = ?)"
                }else{
                    cmd = "(select * from bachelor_courses left join others on others.Others_Course_ID = bachelor_courses.Course_ID and others.Others_Course_Class = bachelor_courses.Course_Class where Course_ID = ? and Course_Class = ?)"
                }
            }
            con.query(s_cmd,[SID],function(err,row){
                if(row.length!=0){
                    var w = NOW_COURSE_TIME(row)
                    con.query(cmd,[add[xx][0],add[xx][1]],function(err,result){
                        var a=0
                        for(var now=0;now<row.length;now++){
                            a+=row[now].Select_Credit
                        }
                        if((a+result[0].Course_Credit)>25){
                            b.push([add[xx][0],add[xx][1],result[0].Course_Name_Chinese])
                        }else{
                            INSERT_COURSE(result,add,req.user,xx)
                        }
                        var re_w = EVER_COURSE_TIME(result)
                        var temp = IS_HIT(re_w,w)
                        var all_true = temp[0]
                        var temp1 = temp[1]
                        var temp2 = temp[2]
                        if(all_true==false){
                            have_hit = false
                            have.push(temp1)
                            hit.push(temp2)
                        }
                        if(xx==add.length-1){
                            if(have_hit&&b.length==0){
                                var ge2,te,ge1 = GE2_TE_GE1(req.body,co)
                                if(co==1){
                                    var cmd3 = "select * from bachelor_courses where Course_Department = ? and Course_Grade = ?"
                                    con.query(cmd3,[req.body['department'],req.body['grade']],function(err,result1){
                                        if(result1.length!=0){
                                            BACHELOR_SELECTION_LAST(result1,req.user,res,te,1)
                                        }
                                    })
                                }else if(co==2){
                                    var cmd3 = "select * from master_courses where Course_Department = ? and Course_Grade = ?"
                                    con.query(cmd3,[req.body['department'],req.body['grade']],function(err,result1){
                                        if(result1.length!=0){
                                            MASTER_SELECTION_LAST(result1,req.user,res,te,1)
                                        }
                                    })
                                }else if(co==3){
                                    var cmd3 = "select * from general_courses where Course_Department = ? and Course_Dimension = ?"
                                    con.query(cmd3,[req.body['department'],req.body['ge2']],function(err,result1){
                                        GENERAL_SELECTION_LAST(result1,req.user,res,ge1,ge2,1)
                                    })
                                }else if(co==11||co==22||co==33||co==44){
                                    if(req.body['teacher']=="無限制"){
                                        req.body['teacher']=""
                                    }
                                    if(req.body['subject']=="無限制"){
                                        req.body['subject']=""
                                    }
                                    ADVANCED_COURSE(res,req.user,req.body,1)
                                }
                            }else if(have_hit==false&&b.length==0){
                                if(co==1||co==2){
                                    res.render('course_hit',{
                                        user:req.user,
                                        have:have,
                                        hit:hit,
                                        department:req.body['department'],
                                        grade:req.body['grade'],
                                        ge2:"中國語文知識與應用"
                                    })
                                }else if(co==3){
                                    res.render('course_hit',{
                                        user:req.user,
                                        have:have,
                                        hit:hit,
                                        department:req.body['department'],
                                        grade:req.body['grade'],
                                        ge2:req.body['ge2']
                                    })
                                }else{
                                    res.render('advanced_course_hit',{
                                        user:req.user,
                                        have:have,
                                        hit:hit,
                                        choose_department:req.body['choose_department'],
                                        query_type:req.body['query_type'],
                                        subject:req.body['subject'],
                                        teacher:req.body['teacher'],
                                        time:req.body['time'],
                                        all_department:req.body['all_department']
                                    })
                                }
                            }else{
                                if(co==1||co==2){
                                    res.render('credit_full',{
                                        user:req.user,
                                        have:have,
                                        hit:hit,
                                        b:b,
                                        department:req.body['department'],
                                        grade:req.body['grade'],
                                        ge2:"中國語文知識與應用"
                                    })
                                }else if(co==3){
                                    res.render('credit_full',{
                                        user:req.user,
                                        have:have,
                                        hit:hit,
                                        b:b,
                                        department:req.body['department'],
                                        grade:req.body['grade'],
                                        ge2:req.body['ge2']
                                    })
                                }else{
                                    res.render('advanced_credit_full',{
                                        user:req.user,
                                        have:have,
                                        hit:hit,
                                        b:b,
                                        choose_department:req.body['choose_department'],
                                        query_type:req.body['query_type'],
                                        subject:req.body['subject'],
                                        teacher:req.body['teacher'],
                                        time:req.body['time'],
                                        all_department:req.body['all_department']
                                    })
                                }
                            }
                        }
                    }) 
                }else{
                    con.query(cmd,[add[xx][0],add[xx][1]],function(err,result){
                        INSERT_COURSE(result,add,req.user,xx)
                        if(xx==add.length-1){
                            var ge2,te,ge1 = GE2_TE_GE1(req.body,co)
                            if(co==1){
                                var cmd3 = "select * from bachelor_courses where Course_Department = ? and Course_Grade = ?"
                                con.query(cmd3,[req.body['department'],req.body['grade']],function(err,result1){
                                    if(result1.length!=0){
                                        BACHELOR_SELECTION_LAST(result1,req.user,res,te,1)
                                    }
                                })
                            }else if(co==2){
                                var cmd3 = "select * from master_courses where Course_Department = ? and Course_Grade = ?"
                                con.query(cmd3,[req.body['department'],req.body['grade']],function(err,result1){
                                    MASTER_SELECTION_LAST(result1,req.user,res,te,1)
                                })
                            }else if(co==3){
                                var cmd3 = "select * from general_courses where Course_Department = ? and Course_Dimension = ?"
                                con.query(cmd3,[req.body['department'],req.body['ge2']],function(err,result1){
                                    GENERAL_SELECTION_LAST(result1,req.user,res,ge1,ge2,1)
                                })
                            }else if(co==11||co==22||co==33||co==44){
                                if(req.body['teacher']=="無限制"){
                                    req.body['teacher']=""
                                }
                                if(req.body['subject']=="無限制"){
                                    req.body['subject']=""
                                }
                                ADVANCED_COURSE(res,req.user,req.body)
                            }
                        }
                    })
                }
            })
        }
    })
    app.get('/withdraw',isLoggedIn,function(req,res){
        WITHDRAW(req.user,res,1)
    })
    app.post('/withdraw_course',function(req,res){
        course = req.body['course']
        if(course == undefined){
            WITHDRAW(req.user,res,1)
        }else{
            var delete_course = []
            if(typeof course=="string"){
                var a = course.split(" ")
                delete_course.push(a)
            }else if(typeof course=="object"){
                for(let i=0;i<course.length;i++){
                    var a = course[i].split(" ")
                    delete_course.push(a)
                }
            }
            var cmd = "delete from selection where Select_Course_ID = ? and Select_Course_Class = ?"
            for(let i=0;i<delete_course.length;i++){
                con.query(cmd,[delete_course[i][0],delete_course[i][1]],function(err,result){
                    if(err) throw err
                    if(i==delete_course.length-1){
                        WITHDRAW(req.user,res,1)
                    }
                })
            }
        }
    })
    app.get('/curriculum',isLoggedIn,function(req,res){
        WITHDRAW(req.user,res,2)
    })
    app.post('/course_other',function(req,res){
        var ID = req.body['id']
        var CLASS = req.body['class']
        var co = req.body['co']
        var cmd
        if (co==1){
            cmd = "select * from bachelor_courses left join others on others.Others_Course_ID = bachelor_courses.Course_ID and others.Others_Course_Class = bachelor_courses.Course_Class where Course_ID = ? and Course_Class = ?";
        }else if(co==2){
            cmd = "select * from master_courses left join others on others.Others_Course_ID = master_courses.Course_ID and others.Others_Course_Class = master_courses.Course_Class where Course_ID = ? and Course_Class = ?";
        }else if(co==3){
            cmd = "select * from general_courses left join others on others.Others_Course_ID = general_courses.Course_ID and others.Others_Course_Class = general_courses.Course_Class where Course_ID = ? and Course_Class = ?";
        }
        con.query(cmd,[ID,CLASS],function(err,result){
            if(result.length!=0){
                if(result[0].Others_Course_ID==null){
                    result[0].Support_Department = '無';
                    result[0].Support_Grade = '無';
                    result[0].Support_Class = '無';
                    result[0].Block_Department = '無';
                    result[0].Block_Grade = '無';
                    result[0].Block_Class = '無';
                    result[0].Keep = 0;
                    result[0].Selection_Rule = '一次篩選';
                    result[0].Support_General_Subject = '不支援';
                    result[0].Support_General_Population = 0;
                    result[0].Prerequisite = '無';
                    result[0].other = '無';
                }
                res.render('next_other',{
                    others:result,
                    user:req.user
                })
            }
        })
    })
    app.get('/change_password',isLoggedIn,function(req,res){
        res.render('change_password',{
            user:req.user
        })
    })
    app.post('/next_change_password',function(req,res){
        var original = req.body['original']
        var new_password = req.body['new_password']
        var sure_new_password = req.body['sure_new_password']
        var email = req.body['email']
        var cmd = 'select * from student where Student_ID = ?'
        var bcrypt = require('bcrypt-nodejs')
        var isValidPassword = function(userpass, Student_Password) {
            return bcrypt.compareSync(Student_Password, userpass);
        }
        con.query(cmd,[req.user.Student_ID],function(err,result){
            if(result[0].Student_Change==false){
                if(result[0].Student_Email==email && result[0].Student_Password==original){
                    if(new_password==sure_new_password){
                        var cmd2 = "Update student SET Student_Password = ? ,Student_Change = true where id = ?"
                        var h_password = bcrypt.hashSync(new_password, bcrypt.genSaltSync(8), null)
                        con.query(cmd2,[h_password,req.user.id],function(err,result1){
                        })
                        res.render('new_password_success',{
                            user:req.user
                        })
                    }
                    else{
                        res.render('new_password_error',{
                            user:req.user
                        })
                    }
                }
                else{
                    res.render('original_password_error',{
                        user:req.user
                    })
                }
            }else{
                if(result[0].Student_Email==email && isValidPassword(result[0].Student_Password,original)){
                    if(new_password==sure_new_password){
                        var cmd2 = "Update student SET Student_Password = ?,Student_Original_Password = ? where id = ?"
                        var h_password = bcrypt.hashSync(new_password, bcrypt.genSaltSync(8), null)
                        con.query(cmd2,[h_password,new_password,req.user.id],function(err,result1){
                        })
                        res.render('new_password_success',{
                            user:req.user
                        })
                    }
                    else{
                        res.render('new_password_error',{
                            user:req.user
                        })
                    }
                }
                else{
                    res.render('original_password_error',{
                        user:req.user
                    })
                }
            }
        })
    })
    app.get('/course_information',isLoggedIn,function(req, res) {
        var cmd ="(select distinct Course_Academy,Course_department from bachelor_courses)union(select distinct Course_Academy,Course_department from master_courses)union(select distinct Course_Academy,Course_department from general_courses)";
        con.query(cmd, function (err, rows, fields) {
            var x = ACADEMY_CATEGORY(rows)
            var literature = x[0]
            var science = x[1]
            var society = x[2]
            var engineering = x[3]
            var management = x[4]
            var law = x[5]
            var education = x[6]
            var other = x[7]
            var academy = x[8]
            res.render('course_information', 
            { 
                user:req.user,
                literature: literature,
                science: science,
                society: society,
                engineering: engineering,
                management: management,
                law: law,
                education: education,
                other: other,
                academy:academy
            });
        });
    });
    app.post('/course_infor',function(req,res){
        var department = req.body['department']
        var cmd = "select * from bachelor_courses where Course_Department = ?"
        con.query(cmd,[department],function(err,result){
            if(result.length!=0){
                res.render('next_course_information',{
                    courses:result,
                    co:1,
                    user:req.user
                })
            }else{
                cmd = "select * from master_courses where Course_Department = ?"
                con.query(cmd,[department],function(err,result1){
                    if(result1.length!=0){
                        res.render('next_course_information',{
                            courses:result1,
                            co:2,
                            user:req.user
                        })
                    }else{
                        cmd = "select * from general_courses where Course_Department = ?"
                        con.query(cmd,[department],function(err,result2){
                            res.render('next_course_information',{
                                courses:result2,
                                co:3,
                                user:req.user
                            })
                        })
                    }
                })
            }
        })
    })
    app.get('/advanced_course',isLoggedIn,function(req, res) {
        ADVANCED_PRODUCT(res,req.user,1)
    })
    app.post('/next_advanced_course',function(req,res){
        ADVANCED_COURSE(res,req.user,req.body,1)
    })
    app.get('/advanced_course_information',isLoggedIn,function(req,res){
        ADVANCED_PRODUCT(res,req.user,2)
    })
    app.post('/next_advanced_course_information',function(req,res){
        ADVANCED_COURSE(res,req.user,req.body,2)
    })
    //app.get('/loginFailure',authController.loginFailure);
    app.get('/logout',function(req, res) {
        req.session.destroy(function(err) {
            console.log("logout success");
            res.redirect('/');
        });
    });
    app.get('/query_password', function(req, res, next) {
        res.render('query_password');
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
    app.post('/query',function(req,res){
        var Student_ID = req.body['Student_ID'];
        var Student_Identify_ID = (req.body['Student_Identify_ID']).toUpperCase();
        var Student_Birth = req.body['Student_Birth'];
        var cmd ="SELECT * FROM student where Student_ID = ?";
        con.query(cmd, [Student_ID], function (err, result) {
            if(result.length == 0){
                res.locals.error = '學號錯誤';
                var error1 = '很抱歉，您的"學號格式"輸入錯誤(9位數字)，請重新嘗試。';
                var error2 = 'Oops, the format of Student ID. is not corrected (9-digit number), please try again!';
                res.render('query_error',{error1: error1,error2: error2});
            }
            else if(result[0].Student_Identify_ID != Student_Identify_ID || result[0].Student_Birth != Student_Birth){
                res.locals.error = '身分證字號或出生年月日錯誤';
                var error1 = '很抱歉，您的"身份證字號"與"出生年月日"輸入錯誤，請重新嘗試。';
                var error2 = 'Oops, your entered information is not corrected, please try again!';
                res.render('query_error',{error1: error1,error2: error2});
            }
            else{
                var error1 = '您的密碼已經送至您在本系統中登錄的個人信箱。';
                var error2 = 'Your password has been sent successfully. Please check your email, thanks.';
                var te = '您好,\nDear Madam/Sir,\n\n這是由學籍資料登錄系統所發出來的信件\n';
                te = te + 'This mail is sent by Student Academic Record Entry System Automatically.\n\n';
                te = te + '由於您查詢您的登錄密碼,其登入密碼如下.請妥為保管!\nDue to your query request, your password is shown as below. Please keep it carefully.';
                te = te + '\n\n您的登入密碼 : '+result[0].Student_Original_Password+'\nYour password : '+result[0].Student_Original_Password+'\n\n\n\n';
                te = te + '本通訊所含之資訊均屬機密，僅供查詢之收件人使用，若您並非查詢之收件人，請立即刪除\n';
                te = te + 'The information contained in this communication is confidential and is the result of password query provided only for the intended recipient.';
                te = te + '\nIf you are not the intended recipient, please delete this communication immediately. Any use of its contents is strictly prohibited.';
                const mailOptions = {
                    from: 'hank.890705125320698@gmail.com',
                    to: result[0].Student_Email,
                    subject: '學籍資料登錄系統寄送您的登入密碼 Password information for Student Academic Record Entry System',
                    text: te
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.render('query_success',{error1: error1,error2: error2});
            }
        });
    })
    app.get('/course_comment',isLoggedIn,function(req,res){
        COURSE_COMMENT(req.user,res,1,req.body)
    })
    app.post('/next_course_comment',function(req,res){
        COURSE_COMMENT(req.user,res,2,req.body)
    })
    app.post('/this_course_comment',function(req,res){
        THIS_COURSE_COMMENT(req.body,res,req.user)
    })
    app.post('/add_course_comment',function(req,res){
        console.log(req.body)
        var today = new Date();
        var Now_Year = today.getFullYear()
        var Now_Month = today.getMonth()+1
        var Now_Date = today.getDate()
        var Now_Hour = today.getHours()
        var Now_Minute = today.getMinutes()
        var Now_Second = today.getSeconds()
        var com_time = Now_Year+"-"+Now_Month+"-"+Now_Date+" "+Now_Hour+":"+Now_Minute+":"+Now_Second
        var nickname
        if(req.body['name']=='is'){
            nickname = '匿名'
        }else{
            nickname = req.body['nickname'] 
        }
        var cmd = 'INSERT INTO course_comment SET Course_Department=?,Course_Name=?,Comment_Name=?,Comment_Time=?,Course_Teacher=?,Comment_Text=?,Comment_Course_ID_Class=?'
        con.query(cmd,[req.body['Course_Department'],req.body['Course_Name'],nickname,com_time,req.body['Course_Teacher'],req.body['message_text'],req.body['Comment_Course_ID_Class']],function(err,result){
            if(err) throw err
            THIS_COURSE_COMMENT(req.body,res,req.user)
        })
    })
}
