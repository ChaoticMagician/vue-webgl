<template>
  <div class="home">
    <div>添加两张图片纹理</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
    <img ref="img" crossorigin="Anonymous" :src='pictur'>
    <img ref="img" crossorigin="Anonymous" :src='pictur1'>
  </div>
</template>

<script>
//webgl工具集
import pictur from '../assets/12.jpg'
import pictur1 from '../assets/mengban.jpg'
import glutil from 'gl-util'
export default {
  name:'dobule6',
  data() {
    return {
      gltext:{},
      verticesData:new Float32Array([
        -0.5, 0.5,  -0.3,  1.7,
        -0.5, -0.5,  -0.3, -0.2,
        0.5, 0.5,  1.7,  1.7,
        0.5, -0.5,  1.7,  -0.2,
      ]),
      attributeArr:[
        {keyword:'a_Position',size:2,type:'FLOAT',stride:4,offset:0},
        {keyword:'a_TexCoord',size:2,type:'FLOAT',stride:4,offset:2}
      ],
      pointnum:0,
      texture:{},
      texture1:{},
      pictur,
      pictur1
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    `attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main(){
      gl_Position = a_Position;
      v_TexCoord = a_TexCoord;
    }`;
    let FSHADER_SOURCE = 
    `precision mediump float;
    uniform sampler2D u_Sampler;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main(){
      vec4 color = texture2D(u_Sampler, v_TexCoord);
      vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
      gl_FragColor = color * color1;
    }`;
    this.gltext = glutil.context(this.$refs.exampe);
    initShaders(this.gltext,VSHADER_SOURCE,FSHADER_SOURCE);
    //从缓冲区得到点位坐标和顶点对照
    this.pointnum =this.initVertexBuffers(this.gltext,this.verticesData,this.attributeArr);  
    //引入图片，设置纹理对象
    let that = this;
    this.texture = this.gltext.createTexture();//创建纹理
    this.texture1 = this.gltext.createTexture();//创建纹理
    //获取u_Sampler的存储位置
    this.u_Sampler = this.gltext.getUniformLocation(this.gltext.program,"u_Sampler");
    this.u_Sampler1 = this.gltext.getUniformLocation(this.gltext.program,"u_Sampler1");
    let image = new Image();
    let image1 = new Image();
    image.crossOrigin = "Anonymous";
    //判断是否图片都加载完成的数组
    var iflogok  = [false,false];
    image.onload = function () {
      that.loadTexture(that.gltext,that.pointnum,that.texture,that.u_Sampler,image,0,iflogok);
    };
    image1.onload = function () {
      that.loadTexture(that.gltext,that.pointnum,that.texture1,that.u_Sampler1,image1,1,iflogok);
    };
    image.src = pictur;
    image1.src = pictur1;
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
    loadTexture(gl,n,texture,u_Sampler,image,thisnum,ifLogArr) {
      //对纹理图像进行y轴反转
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
      //开启0号纹理单元
      gl.activeTexture(gl['TEXTURE'+thisnum]);
      ifLogArr[thisnum] = true;
      //向target绑定纹理对象
      gl.bindTexture(gl.TEXTURE_2D,texture);
      //配置纹理参数
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      //配置纹理图像
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      //将0号纹理传递给着色器
      gl.uniform1i(u_Sampler,thisnum);
      //计算是否所有纹理加载完成
      if (ifLogArr.every(value=>{
        console.log(value);
        return value
      })) {
        //绘制
        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
      }
    }
  }
}
</script>

<style scoped>

</style>
