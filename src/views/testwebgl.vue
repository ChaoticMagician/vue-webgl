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
    this.gltext = glutil.context(this.$refs.exampe);
  
    // // 这是二维画个蓝色的矩形；
    // var ctx = this.$refs.exampe.getContext('2d');
    // ctx.fillStyle = '#ADD8E6';
    // ctx.fillRect(120,10,150,150);
    // ctx.drawColor(0.91,0.502,0.502,1.0);
    // ctx.drawPoint(0,0,0,10);

    // // 设置画布的背景色
    // console.log(this.gltext);
    // this.gltext.clearColor(0.28,0.82,0.8,1.0);
    // this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);

    var VSHADER_SOURCE =
      "void main() { \n" +
      //设置坐标
      "gl_Position = vec4(0.0, 0.0, 0.0, 1.0); \n" +
      //设置尺寸
      "gl_PointSize = 10.0; \n" +
      "} \n";
    //片元着色器
    var FSHADER_SOURCE =
        "void main() {\n" +
        //设置颜色
        "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" +
        "}\n";
     //初始化着色器
     if (!initShaders(this.gltext, VSHADER_SOURCE, FSHADER_SOURCE)) {
         return;
     };
     //设置<canvas>的背景色
     this.gltext.clearColor(1.0, 1.0, 0.5, 1.0);
 
     //清空<canvas>
     this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
 
     //绘制一个点
     this.gltext.drawArrays(this.gltext.POINTS, 0, 1);

  },
};
</script>
