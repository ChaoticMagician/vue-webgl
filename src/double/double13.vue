<template>
  <div class="home">
    <div>前后压盖问题</div>
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
      verticesColorsData:new Float32Array([
        // 右侧的三个三角形
        0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // 前面的蓝色
        0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
        1.25, -1.0,   0.0,  1.0,  0.4,  0.4,

        0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // 中间的黄色
        0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
        1.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

        0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // 后面的绿色
        0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
        1.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

        // 左侧的三个三角形
        -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // 后面的绿色
        -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
        -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

        -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // 中间的黄色
        -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
        -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

        -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // 前面的蓝色
        -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
        -0.25, -1.0,   0.0,  1.0,  0.4,  0.4,
      ]),
      attributeArr:[
        {keyword:'a_Position',size:3,type:'FLOAT',stride:6,offset:0},
        {keyword:'a_Color',size:3,type:'FLOAT',stride:6 ,offset:3}
      ]
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
    //设置画布背景颜色
    this.gltext.clearColor(1.0,0.0,1.0,1.0);
    this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
      this.u_ModelViewMatrix = this.gltext.getUniformLocation(this.gltext.program,"u_ModelViewMatrix");
      //设置场景的透视视域
      let viewMatrix = new Matrix4();
      viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0);
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
        //开启隐藏面清除
        this.gltext.enable(this.gltext.DEPTH_TEST);
        //清空颜色和深度缓冲区
        this.gltext.clear(this.gltext.DEPTH_BUFFER_BIT);

    //绘制图形
    this.drawall(datanum)
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
    },
    drawall(n){
      //设置画布背景颜色
      this.gltext.clearColor(1.0,0.0,1.0,1.0);
      this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
      //绘制图形
      this.gltext.drawArrays(this.gltext.TRIANGLES,0,n);
    }
  }
}
</script>

<style scoped>

</style>
