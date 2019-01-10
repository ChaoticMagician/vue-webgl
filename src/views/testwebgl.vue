<template>
  <div class="home">
    <div>这是webgl测试</div>
    <canvas ref="exampe" id="testcanvas" width="400" height="400" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
// @ is an alias to /src
import glutil from 'gl-util'
export default {
  name: "testwebgl",
  components: { },
  data() {
    return {
      gltext:{},
    }
  },
  mounted() {
    if(!this.$refs.exampe){
      console.log('canvas元素错误'+this.$refs.exampe);
      return;
    };
  
      // 这是二维画个蓝色的矩形；
      var ctx = this.$refs.exampe.getContext('2d');
      ctx.fillStyle = '#ADD8E6';
      ctx.fillRect(120,10,150,150);
      ctx.drawColor(0.91,0.502,0.502,1.0);
      ctx.drawPoint(0,0,0,10);

    // this.gltext = glutil.context(this.$refs.exampe);
    // console.log(this.gltext);
    // this.gltext.clearColor(0.28,0.82,0.8,1.0);
    // this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);


  
  },
};
</script>
