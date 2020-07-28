<template>
  <section>
    <div class="login" @click="doLogin">[login:{{username}}]</div>
    <h1>{{title}}</h1>
    <p class="message">{{message}}</p>
    <div v-if="this.status">     
       <nuxt-link to="/edit">Go to Edit Page</nuxt-link>
      
        <table>
       <tr>
       <td @click="this.pageMinus">prevPage</td>
          <td>{{ $store.state.pagecount }}</td>
          <td @click="this.pagePlus">nextPage</td>
          <td @click="this.pageReset_num">Reset</td>
        </tr> 
      </table>  
  <hr>
  
   <ul v-for="(data,key) in array_data">
     <li>
       <tr>
      <td>{{parseInt($store.state.pagecount)+key}}</td>
     <td @click="select(key)" class="list1">{{data.title}}</td>
     <td><button class="delete1" @click="del(key)">削除</button></td>
       </tr>
     <div class="list2">{{data.posted}}</div>
     </li>
   </ul>
  
   </div>
  </section>
</template>

<script>
 
 import firebase, { functions } from "firebase";
const axios=require('axios');
import Vuex from 'vuex'
import { mapState, mapActions ,mapMutations } from 'vuex';


export default{
     
     data: function(){
       return{
          title:'Fire-Memo',
          message:'テキストメモ。投稿の一覧表示ページ',
          msg:'',
          page:0,
          num_per_page:5,
          array_data:[],
          maxpagedata:0,
       };
     },
    computed: mapState(['pagecount','status','maxpage']),  
    created:function(){
      this.getMaxpage();
      this.pageRead();
      
    },

    computed: {
     ...mapState(['username']),
     ...mapState(['status'])
    } ,   

     methods:{
       ...mapActions(['logout']),
       ...mapActions(['getUser']),
       ...mapMutations(['pageReset']),

       pagePlus: function(){
         this.$store.dispatch('pageIncrease',parseInt(this.num_per_page));
         this.pageRead();
       },
       pageMinus: function(){
         this.$store.dispatch('pageDecrease',parseInt(this.num_per_page));
         this.pageRead();
       },
       pageReset_num: function(){
       this.pageReset();
       this.pageRead();
       },


       doLogin: function(){
         if (this.status != "loggedIn"){
           this.login();
         } else {
           this.logout();
            this.message='ログアウトしました';
         }
       },

    getMaxpage: function(){
    let Ref=firebase.database().ref('fire-memo');
    let pagein =1;
   
    let retMaxpage = () => {
    let self = this;
    let maxpage=0;
    Ref.orderByChild('num').limitToLast(1).once('value',function(snapshot){
    let data = snapshot.val();
    maxpage = Object.values(data);
    //console.log(maxpage);
    self.maxpagedata=maxpage[0].num;
    self.$store.dispatch('pageMax',self.maxpagedata);
    //console.log(self.$store.state.maxpage);
    });
    };
    retMaxpage();
   },

      pageRead: function(){
     //console.log(this.$store.state.maxpage);
     let Ref=firebase.database().ref('fire-memo'); 

     let retpagedata = () => {
      let self = this;
      let page = self.$store.state.pagecount;
      self.array_data=[];
      let arraydata=[];
    
      let myPromise = Promise.resolve();
      myPromise=myPromise.then(task1.bind(this,page)).then(looper).then(looperUnit)
      myPromise.then((val)=>{
       self.array_data=val[1];
       console.log('finished!');
       console.log(self.array_data);
       });   
 
 
//****************************** 

async function looperas(val) {
       console.log(val);
       let a=0;      
       while (val[2]>5){
        await task3();
       }

      let task3 = (val) => {
       Ref.orderByChild('num').startAt(val[0]).endAt(val[0]).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
       console.log(val[0]);
       val[0]++;       
       val[1]=val[1].concat(getarraydata);
       if (getarraydata[0].dataflag===0){val[2]++};
       console.log(val[1]); 
      })  
     }
       }
        
//***************************** 


function looperUnit(val){
  return new Promise(function(resolve, reject) {
        console.log('looperUnit');
        console.log(val);
        if (val[2]<5){
          console.log('looperUnit-Bunki1');
          //myPromise.then(looper).then(looperUnit)
          looper(val).then(looperUnit);
        } else {
          resolve(val);
        }
      })         
  }
   
function looper(val) {
  return new Promise(function(resolve, reject) {
       console.log(val);
       let a=0;      
       Ref.orderByChild('num').startAt(val[0]).endAt(val[0]).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
       console.log(val[0]);
       val[0]++;       
       val[1]=val[1].concat(getarraydata);
       if (getarraydata[0].dataflag===0){val[2]++};
       console.log(val[1]); 
       resolve(val);
    })
  })
 }
     



/* function loopUnit(val) {
  return new Promise(function(resolve, reject) {
    resolve(val)
  })
}

function looper(val) {
  return new Promise(function(resolve, reject) {
    // 永久ループにならないように限界条件を入れる (optional)
    console.log(val);
    if (val[2]>100) {
      resolve(val);
      return
    }
    // ループ処理
    let a=0;      
       Ref.orderByChild('num').startAt(val[0]).endAt(val[0]).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
       console.log(val[0]);
       val[0]++;       
       val[1]=val[1].concat(getarraydata);
       if (getarraydata[0].dataflag===0){val[2]++};
       console.log(val[1]);
       //looper(val);       
    })
    loopUnit(val).then(function(val) {
      console.log(val);
      if ( val[2]<5 ) {
        myPromise.then(looper)
      } else {
        
        resolve(val)
      }
    })
  }) 
}

//looper();

/*




      
      //for(var i = 1; i <= 4; i++) {
     /* 
      myPromise = myPromise.then((val)=>{
        console.log(val);
        console.log(self.$store.state.maxpage);
        task2;
        //if ((val[0]<self.$store.state.maxpage)||(val[2]<5)){task2()}
        //else {resolve(val)};
      });
      //};

       myPromise.then((val)=>{
       self.array_data=val[1];
       });
      
     */


// ループで実行する処理
       function task1(val){ // 引数pageを受け取る
       return new Promise(function(resolve, reject) {
      let a=0;      
      Ref.orderByChild('num').startAt(val).endAt(val).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
       console.log(val);
       val++; 
       if (getarraydata[0].dataflag===0){a++};

       console.log(getarraydata);
       console.log(getarraydata[0].dataflag);
       resolve([val,getarraydata,a]);
        })          
      }); 
     }
      
        function task2(val){ // 引数[val,getarraydata]を受け取る
       return new Promise(function(resolve, reject) {     
        Ref.orderByChild('num').startAt(val[0]).endAt(val[0]).once('value',function(snapshot){
      let getarraydata=Object.values(snapshot.val());
       console.log(val[0]);
       val[0]++;       
       val[1]=val[1].concat(getarraydata);
       if (getarraydata[0].dataflag===0){val[2]++};
       console.log(val[1]);
       resolve(val);       
        })      
      }); 
     }
    
    
      
    
     };
      retpagedata();
    },
    select:function(key){
    this.$store.dispatch('pageset',key+this.$store.state.pagecount);
    this.$router.push('/edit');
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
  cursor: pointer;
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