<template>
  <div class="home">
    <div>每个面不同颜色的立方体</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
import Matrix4 from '../tooplib/cuon-matrix'
export default {
  name:'dobule6',
  data() {
    return {
      gltext:{},
      indices:new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
      ]),
      indicesBuffer:{stride:1,bufferType:'ELEMENT_ARRAY_BUFFER',arr:[]},
      verticesData:new Float32Array([
        // 设置顶点
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
      ]),
      verticesArr:{
        stride:3,
        bufferType:'ARRAY_BUFFER',
        arr:[
          {keyword:'a_Position',size:3,type:'FLOAT',offset:0}
        ]
      },
      ColorsData:new Float32Array([
        0.4, 0.4, 0.4,  0.4, 0.4, 0.4,  0.4, 0.4, 0.4,  0.4, 0.4, 0.4,  // v0-v1-v2-v3 front(blue)
        0.9, 0.9, 0.9,  0.9, 0.9, 0.9,  0.9, 0.9, 0.9,  0.9, 0.9, 0.9,  // v0-v3-v4-v5 right(green)
        0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  // v0-v5-v6-v1 up(red)
        0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  // v1-v6-v7-v2 left
        0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  // v7-v4-v3-v2 down
        0.8, 0.8, 0.8,  0.8, 0.8, 0.8,  0.8, 0.8, 0.8,  0.8, 0.8, 0.8   // v4-v7-v6-v5 back
      ]),
      ColorsArr:{
        stride:3,
        bufferType:'ARRAY_BUFFER',
        arr:[
          {keyword:'a_Color',size:3,type:'FLOAT',offset:0}
        ]
      },
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    `attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelViewMatrix;
    varying vec4 v_Color;
    void main(){
      gl_Position = u_ModelViewMatrix *a_Position;
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
    //从缓冲区得到点位坐标
    let datanumt =this.initVertexBuffers(this.gltext,this.verticesData,this.verticesArr); 
    //从缓冲区得到点位颜色
    let datanumc =this.initVertexBuffers(this.gltext,this.ColorsData,this.ColorsArr); 
    //将顶点索引数据写入缓冲区
    let datanum1 =this.initVertexBuffers(this.gltext,this.indices,this.indicesBuffer);  
    //设置变换、视图矩阵
    this.setmatrix()

    //点索引绘图
    this.drawElements(datanum1)
  },
  methods:{
    initVertexBuffers(gl,data,argument){
      let vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl[argument.bufferType],vertexBuffer);
      gl.bufferData(gl[argument.bufferType],data,gl.STATIC_DRAW);
      let FSIZE = data.BYTES_PER_ELEMENT;
      let DNUM  = data.length/argument.stride;
      for (let index = 0; index < argument.arr.length; index++) {
        const element = argument.arr[index];
        this[element.keyword] = gl.getAttribLocation(gl.program, element.keyword);
        gl.vertexAttribPointer(this[element.keyword],element.size, gl[element.type], false, FSIZE*argument.stride,FSIZE*element.offset);
        gl.enableVertexAttribArray(this[element.keyword]);
      }
      return DNUM;
    },
    drawElements(n){
      //设置画布背景颜色
      this.gltext.clearColor(0.0,0.0,0.0,1.0);
      //开启隐藏面清除
      this.gltext.enable(this.gltext.DEPTH_TEST);
      //清空颜色和深度缓冲区
      this.gltext.clear(this.gltext.DEPTH_BUFFER_BIT);
      this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
      //绘制图形
      this.gltext.drawElements(this.gltext.TRIANGLES,n,this.gltext.UNSIGNED_BYTE,0);
    },
    setmatrix(){
      //获取矩阵的传输通道
      this.u_ModelViewMatrix = this.gltext.getUniformLocation(this.gltext.program,"u_ModelViewMatrix");
      //设置场景的透视视域
      let viewMatrix = new Matrix4();
      viewMatrix.setLookAt(2,2,-7,0,0,0,0,1,0);
      //设置模型矩阵的相关信息
      let modelMatrix = new Matrix4();
      modelMatrix.setRotate(0, 0, 0,1);
      //设置透视投影矩阵
      let projMatrix = new Matrix4();
      projMatrix.setPerspective(30,this.$refs.exampe.width/this.$refs.exampe.height,1,100);
      //计算出模型视图矩阵 viewMatrix.multiply(modelMatrix)相当于在着色器里面u_ViewMatrix * u_ModelMatrix
      let modeViewMatrix = projMatrix.multiply(viewMatrix.multiply(modelMatrix));
      //将试图矩阵传给u_ViewMatrix变量
      this.gltext.uniformMatrix4fv(this.u_ModelViewMatrix, false, modeViewMatrix.elements);
    }
  }
}
</script>

<style scoped>

</style>
