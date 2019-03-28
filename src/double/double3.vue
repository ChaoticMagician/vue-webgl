<template>
  <div class="home">
    <div>用缓冲区绘制多点和图形</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
export default {
  name:'dobule3',
  data() {
    return {
      gltext:{},
      a_Position:{},
      a_PointSize:{},
      u_FragColor:{},
      g_paints:[],
      g_colors:[],
      vertexF32A:new Float32Array([-0.5,0.5, -0.5,-0.5, 0.5,0.5, 0.5,-0.5, ]),
      pointsum:0
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
    this.a_PointSize = this.gltext.getAttribLocation(this.gltext.program,'a_PointSize');
    this.gltext.vertexAttrib1f(this.a_PointSize,30);
    //载入缓冲区，并绑定值
    this.initVertexBuffers(this.gltext,this.vertexF32A,this.a_Position);
    //设置画布背景颜色
    this.gltext.clearColor(1.0,0.0,1.0,1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    //绘制点
    this.gltext.drawArrays(this.gltext.PRINTS, 0, 4);
    // this.gltext.drawArrays(this.gltext.LINES, 0, 4);
    // this.gltext.drawArrays(this.gltext.LINE_STRIP, 0, 4);
    // this.gltext.drawArrays(this.gltext.LINE_LOOP, 0, 4);
    // this.gltext.drawArrays(this.gltext.TRIANGLES, 0, 4);
    this.gltext.drawArrays(this.gltext.TRIANGLE_STRIP , 0, 4);
    // this.gltext.drawArrays(this.gltext.TRIANGLE_FAN, 0, 4);
  },
  methods:{
    initVertexBuffers(context,data,vertexAttribute){
      //创建缓冲区对象
      var vertexBuffer = context.createBuffer();
      //绑定到当前上下文
      context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
      //把数据写到缓冲区对象中
      context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);
      //获取顶点着色器代码中的顶点变量
      vertexAttribute = context.getAttribLocation(context.program,'a_Position');
      //设置变量获取数据规则
      context.vertexAttribPointer(vertexAttribute,2,context.FLOAT,false,0,0);
      //允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
      context.enableVertexAttribArray(vertexAttribute);
    },
  }
}
</script>

<style scoped>

</style>
