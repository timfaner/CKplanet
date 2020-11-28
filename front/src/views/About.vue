<template>

<div class="my-4">

  

<h4>
  CKplanet <a href="https://github.com/timfaner/CKplanet"> github</a>
</h4>

<p>
  Simple demo to show different way of manage Users' data

</p>
  
<div class="markdown-body" v-html="body"></div>


</div>


</template>


<script>
export default {
  name : "About",

  created(){
    fetch("https://raw.githubusercontent.com/timfaner/CKplanet/master/README.md")
    .then((res)=> res.text())
    .then((res) => this.content=res)
    .catch((e) => console.error(e))
  },
  computed:{
    body : function(){
      return  window.marked(this.content, { sanitize: true });
    }
  },
  
  data: function() {
    return {
      content: '',

    };
  },
}
</script>
