<template>
<section class="container">
<div class="login" @click="doLogin">[login:{{user_name}}]</div>
<h1>{{title}}</h1>
<p class="message">{{message}}</p>
<div v-if="logined">
  <table>
    <tr>
      <th>Message</th>
      <td><input v-model="msg" size="50"></td>
      <td><button @click="add">投稿</button></td>
    </tr>
  </table>
<hr>
<ul v-for="(data, key) in json_data">
  <li><div class="list1">{{data.msg}}</div>
  <button class="delete1" @click="del(key)">削除</button>
  <div class="list2">{{data.user}} ({{data.posted}}）</div>
  </li>
</ul>
</div>
</section>
</template>

<script>
import firebase from "firebase";
const axios=require('axios');
var config = {
    apiKey: "AIzaSyCoWwSo1UkjGA9vT36w0GvpH75R6yAnrFg",
    authDomain: "start-project-854ab.firebaseapp.com",
    databaseURL: "https://start-project-854ab.firebaseio.com",
    projectId: "start-project-854ab",
    storageBucket: "start-project-854ab.appspot.com",
    messagingSenderId: "860250614782",
  };
!firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

export default{
     data: function(){
       return{
          title:'Board',
          message:'ミニ伝言板。最新の投稿を表示します。',
          user_name:'',
          logined:true,
          msg:'',
          page:0,
          num_per_page:10,
          json_data:{},
       };
     },
     methods:{
       login:function(){
         let provider = new firebase.auth.GoogleAuthProvider();
         let self=this;
         firebase.auth().signInWithPopup(provider).then(function(result){
           console.log(result.user);
           self.user=result.user;
           self.user_name=result.user.displayName;
           self.message='ログインしました';
           let db=firebase.database();
           let ref=db.ref('board');
           ref.orderByKey()
                    .limitToLast(self.num_per_page)
                    .on('value',function(snapshot){
                      if (firebase.auth().currentUser != null){
                        let arr=[];
                        let data=snapshot.val();
                        for(let item in data){
                          arr.unshift(data[item]);
                        }
                        //console.log(arr);
                        self.json_data=arr;
                        //console.log(self.json_data);
                      } else {
                        self.json_data={};
                      }
                  }).catch(function(error){
                  });
         });
       },
         logout: function(){
           firebase.auth().signOut();
           this.user_name = '';
           this.json_data={};
           this.message='ログアウトしました。';
         },
         doLogin:function(){
           if (firebase.auth().currentUser == null){
             this.login();
           } else {
             this.logout();
           }
         },
         add:function(){
           if (firebase.auth().currentUser == null){
             alert('ログインしないと投稿できません。');
             return;
           }
           let db=firebase.database();
           let user=firebase.auth().currentUser;
           console.log(user);
           let ref=db.ref('board');
           let self=this;
           let d=new Date();
           let dstr = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ":" + d.getSeconds();
           let id=d.getTime();
           let data = {
             msg:this.msg,
             user:user.displayName,
             posted:dstr,
           };
           firebase.database().ref('board/'+id).set(data);
           this.msg='';
           this.message='投稿しました';
         },
         del:function(key){
            let db=firebase.database();
            let user=firebase.auth().currentUser;
            let p_data=this.json_data[key].posted;//得られたデータベースのjsonからクリックした位置のpostedの値を取得
            let ref=db.ref('board').orderByChild('posted').equalTo(p_data);
            //postedと一致したデータのみ検索・
            //let orderref=ref.orderByChild('msg').equalTo('テスト投稿');
            ref.once("value",function(snapshot){  //ref.onだとエラーが出る
               let data=snapshot.val();
               
　　　　　　　　　const id = Object.keys(data)[0];
               
                // 主キーより一つ下の階層が取れる。
              //Firebaseデータスナップショットからキーを取得する方法は？ で解説。idを取得する。
　　　　　　　　 firebase.database().ref('board/'+id).remove(); 
         });
            
             this.msg='';
             this.message='投稿を削除しました'; 
         }
     },
     created: function(){
       
       if (firebase.auth().currentUser == null){
         this.login();
       }
       

       console.log("test="+firebase.auth().currentUser);
       
     }
}
</script>

<style>
.login {
  font-weight: bold;
  font-size: 12pt;
  cursor: pointer;
}
.list1 {
  text-align: left;
  font-size: 16pt;
}
.list2 {
  text-align: right;
  font-size: 10pt;
}
.delete1 {
  position: relative;
  width:80px;
  height:35px;
  top:50%;
  left:50%;
  margin-left: 200px;
  margin-top: 0px;
  right: 20px;
  cursor: pointer;
  appearance: none;
  border: 0;
  border-radius: 5px;
  background: #4676D7;
  color: #fff;
  padding: 4px 16px;
  font-size: 12px;
}
.container {
  padding: 5px 10px;
}
h1 {
  font-size: 60pt;
  color: #345980;
}
p {
  padding-top: 5px;
  margin: 10px 0px;
  font-size: 20pt;
}
.message {
  font-size: 16pt;
}
div {
  font-size: 14pt;
}
ul {
  margin: 0px 10px;
  background-color: aliceblue;
}
li {
  padding: 10px;
  font-size: 14pt;
}
tr th {
  width: 120px;
  background-color: darkblue;
  color:white;
  font-size: 16pt;
}
tr td {
  padding: 5px 10px;
  background-color: #eef;
  font-size: 14pt;
}
hr {
  margin: 10px 0px;
}
input {
  font-size: 14pt;
}
button{
  font-size: 14pt;
}
</style>