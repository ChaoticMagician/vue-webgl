<template>
  <div class="home">
    <div>着色器，图片映射</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
    <img ref="img" :src="pictur" />
    <button @click="onloadsucc"  >onload</button>
  </div>
</template>

<script>
import pictur from '../assets/12.jpg'
import glutil from 'gl-util'
export default {
  name:'texture2',
  data() {
    return {
      gltext:{},
      verticesColors:new Float32Array([
        -0.5, 0.5,  0.0,  1.0,
        -0.5, -0.5,  0.0,  0.0,
        0.5, 0.5,  1.0,  1.0,
        0.5, -0.5,  1.0,  0.0,
      ]),
      pointnum:4,
      a_Position:{ad:'adf'},
      a_TexCoord:{aasdfd:'adadff'},
      u_Sampler:{},
      attributeArr:[
        {keyword:'a_Position',size:2,type:'FLOAT',stride:4,offset:0},
        {keyword:'a_TexCoord',size:2,type:'FLOAT',stride:4,offset:2}
      ],
      texture1:{},
      picture:null,
      pictur
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+
    'attribute vec2 a_TexCoord;\n'+
    'varying vec2 v_TexCoord ;\n' +
    'void main() {\n'+
    ' gl_Position = a_Position;\n'+
    ' v_TexCoord = a_TexCoord;\n'+
    '}\n';
    let FSHADER_SOURCE = 
    'precision mediump float;\n'+
    'uniform sampler2D u_Sampler;\n'+
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
    '}\n';
    if(!this.$refs.exampe){
      console.log('canvas元素错误'+this.$refs.exampe);
      return;
    };
    this.gltext = glutil.context(this.$refs.exampe);
    if (!initShaders(this.gltext,VSHADER_SOURCE,FSHADER_SOURCE)) {
      return
    }
    //创建纹理对象
    this.texture1 = this.gltext.createTexture();
    this.u_Sampler = this.gltext.getUniformLocation(this.gltext.program,'u_Sampler');
    let picture = new Image;
    //注册图像加载事件
    // let that = this;
    // picture.onload = function () {
    //   that.loadTexture(that.gltext,that.pointnum,that.texture1,that.u_Sampler,picture);
    //         console.log(that.gltext,that.pointnum,that.texture1,that.u_Sampler,picture);
    // };
    // picture.src = pictur;
    // console.log(picture);

    // this.initVertexBuffers(this.gltext,this.verticesColors,3,this.attributeArr);
    // this.gltext.clearColor(0.0, 0.0, 0.0, 1.0);
    // this.gltext.clear(this.gltext.COLOR_BUFFER_BIT);
    // this.gltext.drawArrays(this.gltext.TRIANGLES,0,this.pointnum);
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
    },
    loadTexture(gl, n, texture, u_Sampler,image){
      //1.对纹理图像进行Y轴反转
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      //2.开启0号纹理单元
      gl.activeTexture(gl.TEXTURE0);
      //3.向target绑定纹理对象
      gl.bindTexture(gl.TEXTURE_2D, texture);
      //4.配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAPMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

      //5.配置纹理图像
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      //6.将0号纹理图像传递给着色器
      gl.uniform1i(u_Sampler, 0);
      // 清空 <canvas>
      gl.clear(gl.COLOR_BUFFER_BIT);
      //绘制矩形
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    },
    onloadsucc(){
      console.log('1234',this.$refs.img);
      this.loadTexture(this.gltext,this.pointnum,this.u_Sampler,this.$refs.img)
    }
  }
}
</script>
