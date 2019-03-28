<template>
  <div class="home">
    <div>第二次，绘制一个点</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
export default {
  name:'dobule',
  data() {
    return {
      gltext:{},

    }
  },
  mounted() {
    if(!this.$refs.exampe){
      console.log('canvas元素有问题');
      return;
    }
    this.gltext = glutil.context(this.$refs.exampe);
    //设置画布背景颜色
    this.gltext.clearColor(1.0,0.0,1.0,1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    //顶点着色器
    var VSHADER_SOURCE = 
      `void main(){
        gl_Position = vec4(0.6,0.5,0.5,1.0);
        gl_PointSize = 10.0;
      }`;
    var FSHADER_SOURCE =
      `void main(){
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      }`
    //初始化着色器
    initShaders(this.gltext, VSHADER_SOURCE, FSHADER_SOURCE);
    this.gltext.drawArrays(this.gltext.POINTS,0,1)
  },
}
</script>

<style scoped>

</style>
