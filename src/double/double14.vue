<template>
  <div class="home">
    <div>彩色立方体</div>
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
        0, 1, 2,   0, 2, 3,    // 前
        0, 3, 4,   0, 4, 5,    // 右
        0, 5, 6,   0, 6, 1,    // 上
        1, 6, 7,   1, 7, 2,    // 左
        7, 4, 3,   7, 3, 2,    // 下
        4, 7, 6,   4, 6, 5     // 后
      ]),
      indicesBuffer:{stride:1,bufferType:'ELEMENT_ARRAY_BUFFER',arr:[]},
      verticesColorsData:new Float32Array([
        // 设置顶点和颜色（偷的顶点代码位置）
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
      ]),
      attributeArr:{
        stride:6,
        bufferType:'ARRAY_BUFFER',
        arr:[
          {keyword:'a_Position',size:3,type:'FLOAT',stride:6,offset:0},
          {keyword:'a_Color',size:3,type:'FLOAT',stride:6 ,offset:3}
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
    //从缓冲区得到点位坐标和颜色
    let datanum =this.initVertexBuffers(this.gltext,this.verticesColorsData,this.attributeArr); 
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
      this.gltext.clearColor(1.0,0.0,1.0,1.0);
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
      viewMatrix.setLookAt(6,6,-5,0,0,0,0,1,0);
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
