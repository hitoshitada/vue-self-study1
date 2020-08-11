<template>
    <div>
      <h1>
        fire-memo-edit
      </h1>
      <hr>  
      <table>
　　　　　<tr>
           <td class="margin10"><nuxt-link to="/memotest">Go to List</nuxt-link></td>
          <td class="numberDisp" @click="this.dispMinus">prev</td>
          <td>{{ pagecount }}</td>
          <td class="numberDisp" @click="this.dispPlus">next</td>
          <td class="numberDisp" @click="this.dispReset">Reset</td>
          <td class="numberDisp" @click="this.saveData">SaveData</td>
          <td class="numberDisp" @click="this.addPage">AddPage</td>
          <td>&nbsp;&nbsp;&nbsp;Input Page (1 to {{maxpagedata}})=></td>
          <td><input type="text"  class="inputText" size="4"  v-model="datanum"></td>
          <td><input type="submit" value="MovePage" class="button1" @click="this.movePage"></td>
       </tr>
        
      </table>
      <table>
        <tr>
        <th>Title</th>
        <td><input type="text" name="title"
        class="title" size="122" 
        v-model="title" >
        </td>
        </tr>
        <tr>
          <th>Memo Text</th>
          <td><textarea name="content" class="content"
          cols="110" rows="13" v-model="content"></textarea></td>
        </tr>



      </table>
    </div>
</template>

<script>

import firebase, { functions } from "firebase";
const axios=require('axios');
import Vuex from 'vuex'
import { mapState, mapActions ,mapMutations } from 'vuex';

 export default{
  data:function(){
    return{
      title: "",
      content: "",
      titleSave: "",
      contentSave: "",
      maxpagedata: 0,
      maxpagedata2:0,
      dataflag:1,
      datanum:0,
   };
  },
  computed: mapState(['pagecount','status','maxpage']),  //pagecountを同じ変数でマッピングする
  
  maxpagedata2: {
    get(){return this.$store.state.maxpage;
    },
    set(maxpagedata) {this.$store.dispatch('pageMax',maxpagedata)},

  },
  
  created: function(){
      this.getMaxpage();
      this.pageDisp();

  },
      
    
  
  methods:{
       ...mapMutations(['pagePlus']),
       ...mapMutations(['pageMinus']),
       ...mapMutations(['pageReset']),
       ...mapMutations(['pegeMaxset']),

    dispPlus: function(){
    
    if ((this.title !== this.titleSave) || (this.content !== this.contentSave)){   
    let result = window.confirm('データが編集されていますがページ移動してもいいですか？');   
    if (result==false) {
 　　　　return
   }
  }
    this.getMaxpage();
    this.pagePlus();
    this.pageDisp();
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
    //console.log(maxpage[0].num);
    self.maxpagedata=maxpage[0].num;
    self.$store.dispatch('pageMax',self.maxpagedata);
    //console.log(self.$store.state.maxpage);
    });
    };
    retMaxpage();
   },
  
    dispMinus: function(){
      if ((this.title !== this.titleSave) || (this.content !== this.contentSave)){   
    let result = window.confirm('データが編集されていますがページ移動してもいいですか？');   
    if (result==false) {
 　　　　return
   }
  }
      this.pageMinus();
      this.pageDisp();
    },
    
    dispReset: function(){
       if ((this.title !== this.titleSave) || (this.content !== this.contentSave)){   
    let result = window.confirm('データが編集されていますがページ移動してもいいですか？');   
    if (result==false) {
 　　　　return
   }
  }
       this.pageReset();
       this.pageDisp();
    },
    
　　pageDisp: function(){
  
     let Ref=firebase.database().ref('fire-memo'); 
     let retpagedata = () => {
      let self = this;
      let page = self.$store.state.pagecount;
      Ref.orderByChild('num').equalTo(page).once('value',function(snapshot){
      let data = snapshot.val();
      let obj = Object.values(data);
      //console.log(obj);
      self.content=obj[0].msg;
      self.title=obj[0].title;
      self.contentSave=self.content;
      self.titleSave=self.title;
      });
     };
      retpagedata();
    },


    saveData: function(){
     let result = window.confirm('このページのデータをSAVEしてもいいですか？'); 
     if (result==false) {
 　　　　return
   　　}
    　let Ref=firebase.database().ref('fire-memo'); 
      let d= new Date();
      let dstr = d.getFullYear()+'-'+("00"+(d.getMonth()+1)).slice(-2) + '-' + ("00"+d.getDate()).slice(-2) + ' ' +("00"+d.getHours()).slice(-2) 
      + ':'+("00"+d.getMinutes()).slice(-2) + ':' + ("00"+d.getSeconds()).slice(-2);
      let id = this.$store.state.pagecount;
      let data = {
        dataflag:true,
        msg:this.content,
        num:this.$store.state.pagecount,
        posted:dstr,
        title:this.title,
      };
      firebase.database().ref('fire-memo/'+id).set(data);     
      this.titleSave=this.title;
      this.contentSave=this.content;

    },
    addPage: function(){
      let result = window.confirm('新たなページを追加しますか？');
      if (result==false){
        return
      }
      let Ref=firebase.database().ref('fire-memo');
      let d= new Date();
      let dstr = d.getFullYear()+'-'+("00"+(d.getMonth()+1)).slice(-2) + '-' + ("00"+d.getDate()).slice(-2) + ' ' +("00"+d.getHours()).slice(-2) 
      + ':'+("00"+d.getMinutes()).slice(-2) + ':' + ("00"+d.getSeconds()).slice(-2);
      let id = parseInt(this.$store.state.maxpage)+1;
      let data = {
        dataflag:true,
        msg:"message"+id,
        num:id,
        posted:dstr,
        title:"Title"+id,
      };
       firebase.database().ref('fire-memo/'+dstr).set(data);
        this.$store.dispatch('pageinSetMaxpage',id);
        this.getMaxpage();
        this.pageDisp();
    },
    movePage: function(){
       /*let result = window.confirm('ページを移動します。データを保存してますか？');
       if (result==false){
        return
      }
      */
      if (0<parseInt(this.datanum) && parseInt(this.datanum)<=this.maxpagedata){
        this.$store.dispatch('pageset',parseInt(this.datanum));
         this.pageDisp();
      } 
 


    }, 
  
  }
    
    }      
    
    




       

 
</script>

<style>

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title{
  font-size:14pt;
  margin: 5px;
}


pre{
  padding: 10px;
  font-size: 18pt;
  background-color: #efefef;
}

.margin10{
    margin-left : 100px;
}

textarea{
  resize:none;
  font-size:14pt;
  margin:5px;
}

.inputText{
resize: none;

}
.button1{
  display: inline-block;
  padding: 0em 0.5em;
  text-decoration: none;
  border-radius: 4px;
  color: #ffffff;
  background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.29);
  border-bottom: solid 3px #5e7fca;
}
.button1:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  border-bottom: none;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.numberDisp {
  padding: 5px 10px;
  background-color: #eef;
  font-size: 14pt;
  cursor: pointer;
}
.numberDisp:active {
  transform: translateY(4px);
  border: none;
}
.links {
  padding-top: 15px;
}

</style>
