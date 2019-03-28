<template>
  <div class="home">
    <div>用图形变换矩阵，对图形进行变换:并测试叠加变换</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
export default {
  name:'dobule5',
  data() {
    return {
      gltext:{},
      a_Position:{},
      a_PointSize:{},
      u_FragColor:{},
      g_paints:[],
      g_colors:[],
      vertexF32A:new Float32Array([0.0,0.0, 0.0,0.8, 0.2,0.2, 0.6,0.0, 0.2,-0.2, 0.0,-0.8, -0.2,-0.2, -0.6,0.0, -0.2,0.2, ]),
      pingyimatrx:new Float32Array([
        //平移
        1.0,0.0,0.0,0.0,
        0.0,1.0,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.2,0.3,0.0,1.0,
      ]),
      angle:100,
      xuanzhuanmatrx:new Float32Array([
        //旋转
        Math.cos(Math.PI*100/180.0),Math.sin(Math.PI*100/180.0),0.0,0.0,
        -Math.sin(Math.PI*100/180.0),Math.cos(Math.PI*100/180.0),0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0,
      ]),
      suofangmatrf:new Float32Array([
        //缩放
        1.2,0.0,0.0,0.0,
        0.0,1.2,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0,
      ]),
      pointsum:0,
      u_xformMatrix:{},
      u_xformMatrixtwo:{},
      //动画的速度
      ANGLE_STEP : 45.0,
      g_last :Date.now(),
    }
  },
  mounted() {
    // console.log(this.xuanzhuanmatrx)
    this.gltext = glutil.context(this.$refs.exampe);
    //顶点着色器
    var VSHADER_SOURCE = 
      `attribute vec4 a_Position;
      attribute float a_PointSize;
      uniform mat4 u_xformMatrix;
      uniform mat4 u_xformMatrixtwo;
      void main(){
        gl_Position = u_xformMatrix*a_Position*u_xformMatrixtwo;
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
    //获取Uniform变换函数，并赋值,
    ///PS，替换不同的变换矩阵，可获得不同的变换效果
    this.u_xformMatrix = this.gltext.getUniformLocation(this.gltext.program,'u_xformMatrix');
    this.gltext.uniformMatrix4fv(this.u_xformMatrix , false , this.pingyimatrx);
    ///PS，叠加矩阵获得叠加效果
    this.u_xformMatrixtwo = this.gltext.getUniformLocation(this.gltext.program,'u_xformMatrixtwo');
    this.gltext.uniformMatrix4fv(this.u_xformMatrixtwo , false , this.suofangmatrf);
    //载入缓冲区，并绑定值
    this.initVertexBuffers(this.gltext,this.vertexF32A,this.a_Position);
    //设置画布背景颜色
    this.gltext.clearColor(1.0,0.0,1.0,1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    //绘制点
    this.gltext.drawArrays(this.gltext.PRINTS, 0, 9);
    // this.gltext.drawArrays(this.gltext.LINES, 0, 9);
    // this.gltext.drawArrays(this.gltext.LINE_STRIP, 0, 9);
    // this.gltext.drawArrays(this.gltext.LINE_LOOP, 0, 9);
    // this.gltext.drawArrays(this.gltext.TRIANGLES, 0, 9);
    // this.gltext.drawArrays(this.gltext.TRIANGLE_STRIP , 0, 9);
    this.gltext.drawArrays(this.gltext.TRIANGLE_FAN, 0, 9);
    console.log(this.g_last);
    this.animentaction(this.g_last,this.angle,this.ANGLE_STEP);
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
    animentaction(lasttime,angle,angleStep){
      let that = this;
      let animentfunction = function () {
        let thisangle = function(lasttime,angle,angleStep){
          let newtime = Date.now();
          let gotime = newtime-lasttime;
          lasttime = newtime;
          let newangle = angle+(angleStep*gotime)/1000.0
          return newangle%=360;
        };
        console.log(thisangle(lasttime,angle,angleStep))
      };
      animentfunction();
    }
  }
}
</script>

<style scoped>

</style>
