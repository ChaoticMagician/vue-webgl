<template>
  <div class="home">
    <div>这是webgl测试,attribute（属性）变量传参</div>
    <canvas @click="clickpoint" ref="exampe" id="testcanvas" width="400" height="400" >
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
      a_Position:{},
      a_PointSize:{},
      g_paints:[]
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
    'void main(){\n'+
    ' gl_Position = a_Position;\n'+
    ' gl_PointSize = a_PointSize;\n'+
    '}\n' ;
    var FSHADER_SOURCE =
    "void main() {\n" +
    //设置颜色
    "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" +
    "}\n";
    //初始化着色器
    if (!initShaders(this.gltext, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return;
    };
    //
    this.a_Position = this.gltext.getAttribLocation(this.gltext.program,'a_Position');
    this.a_PointSize = this.gltext.getAttribLocation(this.gltext.program,'a_PointSize');
    if (this.a_Positions<0) {
      console.log('获取本地a_positio的位置错误');
      return;   
    }
    this.gltext.vertexAttrib3f(this.a_Position,0.5,0.5,0.0);
    // this.gltext.vertexAttrib1f(this.a_Position,-0.6);
    this.gltext.vertexAttrib1f(this.a_PointSize,50);
    //设置<canvas>的背景色
    this.gltext.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);

    //绘制一个点
    this.gltext.drawArrays(this.gltext.POINTS, 0, 1);
  },
  methods:{
    clickpoint(e){
      let rect = e.toElement;
      let x = ((e.clientX-rect.offsetLeft)-rect.offsetWidth/2)/(rect.offsetWidth/2);
      let y = -((e.clientY-rect.offsetTop)-rect.offsetHeight/2)/(rect.offsetHeight/2);
      this.g_paints.push({x,y})
      //清空<canvas>
      this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
      //循环加载点
      for (let index = 0; index < this.g_paints.length; index++) {
        this.gltext.vertexAttrib3f(this.a_Position,this.g_paints[index].x,this.g_paints[index].y,0)
        this.gltext.drawArrays(this.gltext.POINTS, 0, 1);
      }
    }
  }
};
</script>
