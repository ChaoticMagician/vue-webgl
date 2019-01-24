<template>
  <div class="home">
    <div>彩色三角形</div>
    <canvas @click="clickpoint" ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
import glutil from 'gl-util'
export default {
  name:'texture',
  data() {
    return {
      gltext:{}
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    'attribute ver4 a_Position;\n'+
    'attribute ver4 a_PonintSize;\n'+
    'void main(){'+
      'gl_Position = a_Position;\n'+
      'gl_PointSize - a_PonintSize;\n'+
    '}\n';
    let FSHADER_SOURCE = 
    'void main(){\n'+
      'gl_FragColor = ver4(1.0,0.0,0.0,1.0);\n'+
    '}\n'
    if(!this.$refs.exampe){
      console.log('canvas元素错误'+this.$refs.exampe);
      return;
    };
    this,gltext = glutil.context(this.$refs.exampe);
    if (!this.gltext.initShaders(this.gltext,VSHADER_SOURCE,FSHADER_SOURCE)) {
      return
    }
    

  }
}
</script>
