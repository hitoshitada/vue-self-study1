<template>
  <section>
    <div class="login" @click="doLogin">[login:{{username}}]</div>
    <h1>{{title}}</h1>
    <p class="message">{{message}}</p>
    <div v-if="this.status">
      <table>
        <tr>
       <td><nuxt-link to="/edit">Create New Page</nuxt-link></td>
        </tr>
        <tr>
       <td>Message Title</td> 
        </tr> 
      </table>  
  <hr>
  
   <ul v-for="(data, key) in json_data">
     <li>
     <nuxt-link to="/edit" class="list1">{{data.title}}</nuxt-link>
     <button class="delete1" @click="del(key)">削除</button>div>
     <div class="list2">{{data.user}}({{data.posted}})</div>
     </li>
   </ul>
  
   </div>
  </section>
</template>

<script>
  import { mapState, mapActions ,mapMutations } from 'vuex';
  import firebase from "firebase";
 
export default{
     data: function(){
       return{
          title:'Fire-Memo',
          message:'テキストメモ。最新の投稿を表示します。',
          msg:'',
          page:0,
          num_per_page:10,
          json_data:{},
       };
     },
     
    computed: {
     ...mapState(['username']),
     ...mapState(['status'])
    } ,   

     methods:{
       ...mapActions(['logout']),
       ...mapActions(['getUser']),

       doLogin: function(){
         if (this.status != "loggedIn"){
           this.login();
         } else {
           this.logout();
            this.message='ログアウトしました';
         }
       },
       

     }
}
</script>


<style>
.container {
  padding: 5px 10px;
}

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