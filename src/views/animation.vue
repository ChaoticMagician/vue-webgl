<template>
  <div class="home">
    <div>webgl动画</div>
    <canvas @click="clickpoint" ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
import glutil from 'gl-util'
export default {
  name: "animation",
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
      angle:100.0,
      u_xformMatrix:{},
      //动画的速度
      ANGLE_STEP : 45.0,
      g_last :Date,
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
        //平移
        1.0,0.0,0.0,0.0,
        0.0,1.0,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.2,0.3,0.0,1.0,
      ]);
    this.u_xformMatrix = this.gltext.getUniformLocation(this.gltext.program,'u_xformMatrix');
    this.gltext.uniformMatrix4fv(this.u_xformMatrix , false , xformMatrix);
    //改变图形颜色
    this.u_FragColor = this.gltext.getUniformLocation(this.gltext.program,'u_FragColor');
    this.gltext.uniform4f(this.u_FragColor , 1.0,0.0,1.0,1.0);

    this.initVertexBuffers(this.gltext);
    // 每一次重绘时的背景色
    this.gltext.clearColor(0.0, 0.0, 0.0, 0.5);
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
      this.g_last = Date.now();
      this.animentaction();
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
    },
    animate(angle) {
      // 计算距离上次调用经过了多长时间
      var now = Date.now();
      //得到这一次调用与上一次调用的时间间隔
      var elapsed = now - this.g_last;
      this.g_last = now;
      // 根据距离上次调用的时间，更新当前的旋转角度
      //变量gl_last和now都是Data对象now方法的返回值，单位是毫秒
      //所以我们要想按美妙来旋转多少度，我们还多除以1000
      var newAngle = angle + (this.ANGLE_STEP * elapsed) / 1000.0;
      //返回一个始终是小于360°的角度
      return newAngle %= 360;
    },
    animentaction(){
      let that = this;
      var animentfunction = function(){
        console.log(this)
        //更新旋转角
        that.angle = that.animate(that.angle);
        //获取模型矩阵
        let radian = Math.PI*that.angle/180.0;
        let cosB = Math.cos(radian);
        let sinB = Math.sin(radian);
        let xformMatrix = new Float32Array([
          //平移
          cosB,sinB,0.0,0.0,
          -sinB,cosB,0.0,0.0,
          0.0,0.0,1.0,0.0,
          0.0,0.0,0.0,1.0,
        ]);
        that.gltext.uniformMatrix4fv(that.u_xformMatrix , false , xformMatrix);
        // 清除 <canvas>
        that.gltext.clear(that.gltext.COLOR_BUFFER_BIT);
        //绘制图形
        that.gltext.drawArrays(that.gltext.TRIANGLE_FAN, 0, that.vertexSum);
        // 请求浏览器动画循环
        requestAnimationFrame(animentfunction); 
      };
      animentfunction();
    }
  },
};
</script>
