<template>
  <div class="home">
    <div>matrix矩阵旋转变换</div>
    <canvas @click="clickpoint" ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
import glutil from 'gl-util'
export default {
  name: "matrix",
  components: { },
  data() {
    return {
      gltext:{},
      a_Position:{},
      g_paints:[],
      u_FragColor:{},
      g_colors:[],
      a_PointSize:{},
      g_sizes:[],
      //顶点缓冲区的数据
      vertexF32A:new Float32Array([0.0,0.0, 0.0,0.8, 0.2,0.2, 0.6,0.0, 0.2,-0.2, 0.0,-0.8, -0.2,-0.2, -0.6,0.0, -0.2,0.2, ]),
      vertexSum:9,
      //图像旋转角
      angle:100,
      u_xformMatrix:{}

    }
  },
  mounted() {
    if(!this.$refs.exampe){
      console.log('canvas元素错误'+this.$refs.exampe);
      return;
    };
    this.gltext = glutil.context(this.$refs.exampe);
    var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n'+
    'attribute float a_PointSize;\n'+
    'uniform mat4 u_xformMatrix;\n' +
    'void main(){\n'+
    ' gl_Position = u_xformMatrix * a_Position;\n'+
    ' gl_PointSize = a_PointSize;\n'+
    '}\n' ;
    var FSHADER_SOURCE =
    "precision mediump float;\n"+
    "uniform vec4 u_FragColor;\n"+
    "void main() {\n" +
    //设置颜色
      "gl_FragColor = u_FragColor;\n" +
    "}\n";
    //初始化着色器
    if (!initShaders(this.gltext, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return;
    };
    //得到点大小的a_PointSize属性，并赋值；
    this.a_PointSize = this.gltext.getAttribLocation(this.gltext.program,'a_PointSize');
    this.gltext.vertexAttrib1f(this.a_PointSize,10);
    //创建变换矩阵，并将矩阵传给顶点着色器
    let radian = Math.PI*this.angle/180.0;
    let cosB = Math.cos(radian);
    let sinB = Math.sin(radian);
    let xformMatrix = new Float32Array([
      //旋转
      // cosB,sinB,0.0,0.0,
      // -sinB,cosB,0.0,0.0,
      // 0.0,0.0,1.0,0.0,
      // 0.0,0.0,0.0,1.0,
      //平移
      // 1.0,0.0,0.0,0.2,
      // 0.0,1.0,0.0,0.3,
      // 0.0,0.0,1.0,0.0,
      // 0.0,0.0,0.0,1.0,
      //缩放
      1.2,0.0,0.0,0.0,
      0.0,1.2,0.0,0.0,
      0.0,0.0,1.0,0.0,
      0.0,0.0,0.0,1.0,
    ]);
    this.u_xformMatrix = this.gltext.getUniformLocation(this.gltext.program,'u_xformMatrix');
    this.gltext.uniformMatrix4fv(this.u_xformMatrix , false , xformMatrix);

    this.initVertexBuffers(this.gltext);
    // 每一次重绘时的背景色
    this.gltext.clearColor(0.0, 0.0, 0.0, 1.0);
    // 清除 <canvas>
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    // 画n个点
    // this.gltext.drawArrays(this.gltext.PRINTS, 0, this.vertexSum);
    // this.gltext.drawArrays(this.gltext.LINES, 0, this.vertexSum);
    // this.gltext.drawArrays(this.gltext.LINE_LOOP, 0, this.vertexSum);
    // this.gltext.drawArrays(this.gltext.LINE_STRIP, 0, this.vertexSum);
    // this.gltext.drawArrays(this.gltext.TRIANGLES, 0, this.vertexSum);
    // this.gltext.drawArrays(this.gltext.TRIANGLE_STRIP , 0, this.vertexSum);
    this.gltext.drawArrays(this.gltext.TRIANGLE_FAN, 0, this.vertexSum);
  },
  methods:{
    clickpoint(){
      console.log('hehe')
    },
    //创建缓冲区的函数initVertexBuffers
    initVertexBuffers(context) {
      // 创建一个缓存对象，用于存放顶点数据
      var vertexBuffer = context.createBuffer();
      // 绑定缓存对象
      context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
      // 把数据写到缓冲对象中
      context.bufferData(context.ARRAY_BUFFER, this.vertexF32A, context.STATIC_DRAW);
      // 获取顶点着色器代码中的顶点变量
      this.a_Position = context.getAttribLocation(context.program, 'a_Position');
      // 设置变量获取数据规则
      context.vertexAttribPointer(this.a_Position, 2, context.FLOAT, false, 0, 0);
      // 允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
      context.enableVertexAttribArray(this.a_Position);
    }
  },
};
</script>
