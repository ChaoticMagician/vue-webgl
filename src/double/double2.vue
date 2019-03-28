<template>
  <div class="home">
    <div>点击绘点,点击绘制点，传入颜色绘制点</div>
    <canvas @click="clickpoint" ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
export default {
  name:'dobule2',
  data() {
    return {
      gltext:{},
      a_Position:{},
      a_PointSize:{},
      u_FragColor:{},
      g_paints:[],
      g_colors:[]
    }
  },
  mounted() {
    this.gltext = glutil.context(this.$refs.exampe);
    //顶点着色器
    var VSHADER_SOURCE = 
      `attribute vec4 a_Position;
      attribute float a_PointSize;
      void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
      }`;
    var FSHADER_SOURCE =
      `precision mediump float;
      uniform vec4 u_FragColor;
      void main(){
        gl_FragColor = u_FragColor;
      }`
    //初始化着色器
    initShaders(this.gltext, VSHADER_SOURCE, FSHADER_SOURCE);
    //获取attract储存位置
    this.a_Position = this.gltext.getAttribLocation(this.gltext.program,'a_Position');
    this.a_PointSize = this.gltext.getAttribLocation(this.gltext.program,'a_PointSize');
    this.gltext.vertexAttrib3f(this.a_Position,0.5,0.5,0.0);
    this.gltext.vertexAttrib1f(this.a_PointSize,30);
    //读取uniform储存位置并赋值
    this.u_FragColor = this.gltext.getUniformLocation(this.gltext.program,'u_FragColor');
    this.gltext.uniform4f(this.u_FragColor,1.0,1.0,0.0,1.0)
    //设置画布背景颜色
    this.gltext.clearColor(1.0,0.0,1.0,1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    //绘制点
    this.gltext.drawArrays(this.gltext.POINTS,0,1)
  },
  methods:{
    clickpoint(e){
      let rect = e.toElement;
      let x = ((e.pageX-rect.offsetLeft)-rect.offsetWidth/2)/(rect.offsetWidth/2);
      let y = -((e.pageY-rect.offsetTop)-rect.offsetHeight/2)/(rect.offsetHeight/2);
      this.g_paints.push({x,y})
      //设施各点的颜色
      if (x >= 0.0 && y >= 0.0 ) {
        this.g_colors.push([1.0,0.0,0.0,1.0]);
      } else if(x < 0.0 && y < 0.0 ){
        this.g_colors.push([0.0,1.0,0.0,1.0]);
      }else{
        this.g_colors.push([1.0,1.0,1.0,1.0]);
      }
      //清空<canvas>
      this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
      //循环加载点
      for (let index = 0; index < this.g_paints.length; index++) {
        this.gltext.vertexAttrib3f(this.a_Position,this.g_paints[index].x,this.g_paints[index].y,0)
        this.gltext.uniform4f(this.u_FragColor,this.g_colors[index][0],this.g_colors[index][1],this.g_colors[index][2],this.g_colors[index][3]);
        this.gltext.drawArrays(this.gltext.POINTS, 0, 1);
      }
    }
  }
}
</script>

<style scoped>

</style>
