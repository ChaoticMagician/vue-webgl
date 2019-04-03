<template>
  <div class="home">
    <div>添加图片纹理</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
export default {
  name:'dobule6',
  data() {
    return {
      gltext:{},
      verticesColorsData:new Float32Array([
        0.0,  0.5,  1.0,  0.0,  0.0, 
        -0.5, -0.5,  0.0,  1.0,  0.0, 
        0.5, -0.5,  0.0,  0.0,  1.0, 
      ]),
      attributeArr:[
        {keyword:'a_Position',size:2,type:'FLOAT',stride:5,offset:0},
        {keyword:'a_Color',size:3,type:'FLOAT',stride:5,offset:2}
      ]
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    `attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main(){
      gl_Position = a_Position;
      v_Color = a_Color;
    }`;
    let FSHADER_SOURCE = 
    `precision mediump float;
    varying vec4 v_Color;
    void main(){
      gl_FragColor = v_Color;
    }`;
    this.gltext = glutil.context(this.$refs.exampe);
    initShaders(this.gltext,VSHADER_SOURCE,FSHADER_SOURCE);
    //从缓冲区得到点位坐标和颜色
    let datanum =this.initVertexBuffers(this.gltext,this.verticesColorsData,this.attributeArr);  
    //设置画布背景颜色
    this.gltext.clearColor(1.0,0.0,1.0,1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    //绘制图形
    this.gltext.drawArrays(this.gltext.TRIANGLES,0,datanum);
  },
  methods:{
    initVertexBuffers(gl,data,arr){
      let vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      let FSIZE = data.BYTES_PER_ELEMENT;
      let DNUM  = data.length/arr[0].stride;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        this[element.keyword] = gl.getAttribLocation(gl.program, element.keyword);
        gl.vertexAttribPointer(this[element.keyword],element.size, gl[element.type], false, FSIZE*element.stride,FSIZE*element.offset);
        gl.enableVertexAttribArray(this[element.keyword]);
      }
      return DNUM;
    }
  }
}
</script>

<style scoped>

</style>
