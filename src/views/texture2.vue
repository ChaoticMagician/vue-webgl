<template>
  <div class="home">
    <div>着色器，图片映射</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
import glutil from 'gl-util'
export default {
  name:'texture2',
  data() {
    return {
      gltext:{},
      verticesColors:new Float32Array([
        0.0,  0.5,  1.0,  0.0,  0.0, 
        -0.5, -0.5,  0.0,  1.0,  0.0, 
        0.5, -0.5,  0.0,  0.0,  1.0, 
      ]),
      pointnum:3,
      a_Position:{ad:'adf'},
      a_Color:{aasdfd:'adadff'},
      attributeArr:[
        {keyword:'a_Position',size:2,type:'FLOAT',stride:5,offset:0},
        {keyword:'a_Color',size:3,type:'FLOAT',stride:5,offset:2}
      ]
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+
    'attribute vec4 a_Color;\n'+
    'varying vec4 v_Color;\n' +
    'void main() {\n'+
    ' gl_Position = a_Position;\n'+
    ' v_Color = a_Color;\n'+
    '}\n';
    let FSHADER_SOURCE = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';
    if(!this.$refs.exampe){
      console.log('canvas元素错误'+this.$refs.exampe);
      return;
    };
    this.gltext = glutil.context(this.$refs.exampe);
    if (!initShaders(this.gltext,VSHADER_SOURCE,FSHADER_SOURCE)) {
      return
    }
    this.initVertexBuffers(this.gltext,this.verticesColors,3,this.attributeArr);
    this.gltext.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    this.gltext.drawArrays(this.gltext.TRIANGLES,0,this.pointnum);
  },
  methods:{
    initVertexBuffers(gl,data,num,arr){
      let vartexBuffer = gl.createBuffer();
      if (!vartexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
      };
      gl.bindBuffer(gl.ARRAY_BUFFER,vartexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      let FSIZE = data.BYTES_PER_ELEMENT;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        this[element.keyword] = gl.getAttribLocation(gl.program, element.keyword);
        if (this[element.keyword] < 0) {
          console.log('Failed to get the storage location of a_Position');
          return -1;
        };
        gl.vertexAttribPointer(this[element.keyword],element.size, gl[element.type], false, FSIZE*element.stride,FSIZE*element.offset);
        gl.enableVertexAttribArray(this[element.keyword]);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }
    }
  }
}
</script>
