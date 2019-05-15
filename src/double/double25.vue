<template>
  <div class="home">
    <div>绘制一个具有交互的立方体</div>
    <canvas  ref="exampe" id="testcanvas" width="900" height="900" >
      请使用支持canvas的浏览器
    </canvas>
  </div>
</template>

<script>
//webgl工具集
import glutil from 'gl-util'
import Matrix4,{Vector3} from '../tooplib/cuon-matrix'
export default {
  name:'dobule6',
  data() {
    return {
      gltext:{},
      BGcolor:[0.0,0.0,0.0,1.0],//窗口背景颜色
      sceneMatrix: new Matrix4().setPerspective(50.0,900/900, 1.0, 100.0),//场景矩阵
      viewMatrix:new Matrix4().setLookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0),//视角矩阵
      modelMatrix:new Matrix4(),//模型变换矩阵
      NormalMatrix:new Matrix4(),//模型变换矩阵的逆转置矩阵
      LightColor:[1.0, 1.0, 1.0],    //光源颜色
      LightPosition:[4.0,3.0,13.0],  //点光源位置
      AmbientLight:[0.2,0.2,0.2],    //环境光颜色
      LightDirection:[0.5, 3.0, 4.0],//平行光入射角
      black1Angle:0.0,               //机器臂一的旋转角
      black2Angle:30.0,              //机器臂二的旋转角
      black3Angle:0.0,               //机器手掌的旋转角
      black4Angle:0.0,               //机器手指的张开角
      verticesData :new Float32Array([  //矩形定点
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
      ]),
      verticesArr:{
        stride:3,
        bufferType:'ARRAY_BUFFER',
        arr:[
          {keyword:'a_Position',size:3,type:'FLOAT',offset:0}
        ]
      },
      normalsData : new Float32Array([  //矩形法向量
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
      ]),
      normalsArr:{
        stride:3,
        bufferType:'ARRAY_BUFFER',
        arr:[
          {keyword:'a_Normal',size:3,type:'FLOAT',offset:0}
        ]
      },
      ColorsData:new Float32Array([
        1.0,0.4,0.0,1.0,0.4,0.0,1.0,0.4,0.0, 1.0,0.4,0.0,     // v0-v1-v2-v3 front
        0,0,1, 0,0,1, 0,0,1, 0,0,1,     // v0-v3-v4-v5 right
        0,0,1, 0,0,1, 0,0,1, 0,0,1,     // v0-v5-v6-v1 up
        0,0,1, 0,0,1, 0,0,1, 0,0,1,     // v1-v6-v7-v2 left
        0,0,1, 0,0,1, 0,0,1, 0,0,1,    // v7-v4-v3-v2 down
        1.0,0.4,0.0, 1.0,0.4,0.0, 1.0,0.4,0.0, 1.0,0.4,0.0, 　    // v4-v7-v6-v5 back
      ]),
      ColorsArr:{
        stride:3,
        bufferType:'ARRAY_BUFFER',
        arr:[
          {keyword:'a_Color',size:3,type:'FLOAT',offset:0}
        ]
      },
      indicesData : new Uint8Array([  //定点索引
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
      ]),
      indicesBuffer:{stride:1,bufferType:'ELEMENT_ARRAY_BUFFER',arr:[]},
      vertices_base : new Float32Array([ // 基座(10x2x10)
        5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0, 5.0, 0.0, 5.0, // v0-v1-v2-v3 front
        5.0, 2.0, 5.0, 5.0, 0.0, 5.0, 5.0, 0.0, -5.0, 5.0, 2.0, -5.0, // v0-v3-v4-v5 right
        5.0, 2.0, 5.0, 5.0, 2.0, -5.0, -5.0, 2.0, -5.0, -5.0, 2.0, 5.0, // v0-v5-v6-v1 up
        -5.0, 2.0, 5.0, -5.0, 2.0, -5.0, -5.0, 0.0, -5.0, -5.0, 0.0, 5.0, // v1-v6-v7-v2 left
        -5.0, 0.0, -5.0, 5.0, 0.0, -5.0, 5.0, 0.0, 5.0, -5.0, 0.0, 5.0, // v7-v4-v3-v2 down
        5.0, 0.0, -5.0, -5.0, 0.0, -5.0, -5.0, 2.0, -5.0, 5.0, 2.0, -5.0  // v4-v7-v6-v5 back
      ]),
      vertices_arm1 : new Float32Array([  // 第一节胳膊Arm1(3x10x3)
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
        -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
        -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
        1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5  // v4-v7-v6-v5 back
      ]),
      vertices_arm2 : new Float32Array([  // 第二节胳膊Arm2(4x10x4)
        2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0, 0.0, 2.0, 2.0, 0.0, 2.0, // v0-v1-v2-v3 front
        2.0, 10.0, 2.0, 2.0, 0.0, 2.0, 2.0, 0.0, -2.0, 2.0, 10.0, -2.0, // v0-v3-v4-v5 right
        2.0, 10.0, 2.0, 2.0, 10.0, -2.0, -2.0, 10.0, -2.0, -2.0, 10.0, 2.0, // v0-v5-v6-v1 up
        -2.0, 10.0, 2.0, -2.0, 10.0, -2.0, -2.0, 0.0, -2.0, -2.0, 0.0, 2.0, // v1-v6-v7-v2 left
        -2.0, 0.0, -2.0, 2.0, 0.0, -2.0, 2.0, 0.0, 2.0, -2.0, 0.0, 2.0, // v7-v4-v3-v2 down
        2.0, 0.0, -2.0, -2.0, 0.0, -2.0, -2.0, 10.0, -2.0, 2.0, 10.0, -2.0  // v4-v7-v6-v5 back
      ]),
      vertices_palm : new Float32Array([  // 手掌Palm(2x2x6)
        1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0, 1.0, 0.0, 3.0, // v0-v1-v2-v3 front
        1.0, 2.0, 3.0, 1.0, 0.0, 3.0, 1.0, 0.0, -3.0, 1.0, 2.0, -3.0, // v0-v3-v4-v5 right
        1.0, 2.0, 3.0, 1.0, 2.0, -3.0, -1.0, 2.0, -3.0, -1.0, 2.0, 3.0, // v0-v5-v6-v1 up
        -1.0, 2.0, 3.0, -1.0, 2.0, -3.0, -1.0, 0.0, -3.0, -1.0, 0.0, 3.0, // v1-v6-v7-v2 left
        -1.0, 0.0, -3.0, 1.0, 0.0, -3.0, 1.0, 0.0, 3.0, -1.0, 0.0, 3.0, // v7-v4-v3-v2 down
        1.0, 0.0, -3.0, -1.0, 0.0, -3.0, -1.0, 2.0, -3.0, 1.0, 2.0, -3.0  // v4-v7-v6-v5 back
      ]),
      vertices_finger : new Float32Array([  // 手指Fingers(1x2x1)
        0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 2.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 2.0, -0.5, // v0-v3-v4-v5 right
        0.5, 2.0, 0.5, 0.5, 2.0, -0.5, -0.5, 2.0, -0.5, -0.5, 2.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 2.0, 0.5, -0.5, 2.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 2.0, -0.5, 0.5, 2.0, -0.5  // v4-v7-v6-v5 back
      ])
    }
  },
  mounted() {
    let VSHADER_SOURCE = 
    `attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ModelViewMatrix;
    uniform mat4 u_ModelMatrix;
    varying vec3 v_Position;
    varying vec3 v_Normal;
    varying vec4 v_Color;
    void main(){
      gl_Position = u_ModelViewMatrix *a_Position;
      v_Position = vec3(u_ModelMatrix * a_Position);
      v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
      v_Color = a_Color;
    }`;
      // varying vec2 v_TexCoord;
      // v_TexCoord = a_TextCoord;
    let FSHADER_SOURCE = 
      // uniform sampler2D u_Sampler;
      // varying vec2 v_TexCoord;
    `precision mediump float;
      uniform vec3 u_LightColor;
      uniform vec3 u_LightPosition;
      uniform vec3 u_AmbientLight;
      varying vec3 v_Position;
      varying vec3 v_Normal;
      varying vec4 v_Color;
      void main(){
        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));
        float nDotL = max(dot(lightDirection,normal),0.0);
        vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;
        vec3 ambient = u_AmbientLight * v_Color.rgb;
      gl_FragColor = vec4(diffuse + ambient, v_Color.a);
    }`;
    this.getGLtext(VSHADER_SOURCE,FSHADER_SOURCE);
    // //从缓冲区得到点位坐标
    // this.initVertexBuffers(this.gltext,this.verticesData,this.verticesArr); 
    //从缓冲区得到点位颜色
    this.initVertexBuffers(this.gltext,this.ColorsData,this.ColorsArr); 
    //从缓冲区得到法向量
    this.initVertexBuffers(this.gltext,this.normalsData,this.normalsArr); 
    //将顶点索引数据写入缓冲区
    let datanum1 =this.initVertexBuffers(this.gltext,this.indicesData,this.indicesBuffer); 
    //设置场景点光源和环境光
    this.setlight(this.LightColor,this.LightPosition,this.AmbientLight,this.LightDirection);
    //绘制所有元素
    this.drawAllElemrnt(datanum1);
    //键盘控制方块1、2
    let that = this;
    document.onkeydown = function (event) {
      that.keychangeview(event,datanum1);
    }
  },
  methods: {
    getGLtext(VSHADER_SOURCE,FSHADER_SOURCE){
      //获取webgl上下文，注册渲染器，设置背景色，开启图像叠加
      this.gltext = glutil.context(this.$refs.exampe);
      initShaders(this.gltext,VSHADER_SOURCE,FSHADER_SOURCE);
      this.gltext.clearColor(this.BGcolor[0],this.BGcolor[1],this.BGcolor[2],this.BGcolor[3]);
      this.gltext.enable(this.gltext.DEPTH_TEST);
    },
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
    setlight(LightColor,LightPosition,AmbientLight,LightDirection){
      //设置光线颜色（白色）
      let u_LightColor = this.gltext.getUniformLocation(this.gltext.program, "u_LightColor");
      this.gltext.uniform3f(u_LightColor, LightColor[0], LightColor[1], LightColor[2]);
      // //设置光线方向（世界坐标系下的）
      // let u_LightDirection = this.gltext.getUniformLocation(this.gltext.program, "u_LightDirection");
      // let lightDirection = new Vector3(LightDirection);
      // lightDirection.normalize(); //归一化
      // this.gltext.uniform3fv(u_LightDirection, lightDirection.elements);
      //设置点光源位置
      let u_LightPosition = this.gltext.getUniformLocation(this.gltext.program, "u_LightPosition");
      this.gltext.uniform3f(u_LightPosition,LightPosition[0],LightPosition[1],LightPosition[2]);
      //设置环境光颜色
      let u_AmbientLight = this.gltext.getUniformLocation(this.gltext.program, "u_AmbientLight");
      this.gltext.uniform3f(u_AmbientLight,AmbientLight[0],AmbientLight[1],AmbientLight[2]);
    },
    setMatrix(sceneMatrix,viewMatrix,modelMatrix,newMatrix){
      if (!this.u_ModelViewMatrix) {
        this.u_ModelViewMatrix = this.gltext.getUniformLocation(this.gltext.program,"u_ModelViewMatrix");
        this.u_ModelMatrix = this.gltext.getUniformLocation(this.gltext.program,"u_ModelMatrix");
        this.u_normalMatrix = this.gltext.getUniformLocation(this.gltext.program,"u_NormalMatrix");
      }
      //复制矩阵
      let thisSceneMatrix = new Matrix4().set(sceneMatrix)
      let thisViewMatrix = new Matrix4().set(viewMatrix)
      let thisModelMatrix = new Matrix4().set(modelMatrix)
      //获取矩阵的传输通道
      let modeViewMatrix = thisSceneMatrix.multiply(thisViewMatrix.multiply(thisModelMatrix));
      this.gltext.uniformMatrix4fv(this.u_ModelViewMatrix, false, modeViewMatrix.elements);
      //设置模型矩阵
      this.gltext.uniformMatrix4fv(this.u_ModelMatrix, false, thisModelMatrix.elements);
      //设置赋值逆转置矩阵
      let normalMatrix = new Matrix4();
      normalMatrix.setInverseOf(thisModelMatrix);
      normalMatrix.transpose();
      this.gltext.uniformMatrix4fv(this.u_normalMatrix,false,normalMatrix.elements);
    },
    drawElement(num){
       //绘制
      this.gltext.drawElements(this.gltext.TRIANGLES,num,this.gltext.UNSIGNED_BYTE,0);
    },
    keychangeview(event,num){
      console.log(event.keyCode);
      
      let changewModelMatrix = new Matrix4();
      if(event.keyCode == 39){
        this.black1Angle = (this.black1Angle + 3.0) % 360;
      }else if(event.keyCode == 37){
        this.black1Angle = (this.black1Angle - 3.0) % 360;
      }else if(event.keyCode == 38){
        if (this.black2Angle < 135.0) {
          this.black2Angle += 3.0;
        }else{return}
      }else if(event.keyCode == 40){
        if (this.black2Angle >= -135.0) {
          this.black2Angle -= 3.0;
        }else{return}
      }else if(event.keyCode == 65){
        if (this.black3Angle < 80.0) {
          this.black3Angle = (this.black3Angle + 3.0) % 360;
        }
      }else if(event.keyCode == 68){
        if (this.black3Angle >= -80.0) {
          this.black3Angle = (this.black3Angle - 3.0) % 360;
        }
      }else if(event.keyCode == 83){
        if (this.black4Angle < 54.0) {
          this.black4Angle = (this.black4Angle + 3.0) % 360;
        }
      }else if(event.keyCode == 87){
        if (this.black4Angle >= -54.0) {
          this.black4Angle = (this.black4Angle - 3.0) % 360;
        }
      }else {
        return;
      };
      this.drawAllElemrnt(num)
    },
    drawAllElemrnt(num){
      //清空画面
      this.gltext.clear(this.gltext.COLOR_BUFFER_BIT | this.gltext.DEPTH_BUFFER_BIT);
      //机器臂基座
      this.initVertexBuffers(this.gltext,this.vertices_base,this.verticesArr); 
      let M_MatrixJizuo = new Matrix4().setTranslate(0.0, -12.0, 0.0);
      this.setMatrix(this.sceneMatrix,this.viewMatrix,M_MatrixJizuo);
      this.drawElement(num);
      //机器臂一
      this.initVertexBuffers(this.gltext,this.vertices_arm1,this.verticesArr); 
      this.modelMatrix.setRotate(this.black1Angle, 0.0, 1.0, 0.0);
      let M_MatrixArm1 = new Matrix4().set(this.modelMatrix);
      M_MatrixArm1.translate(0.0, -10.0, 0.0);
      this.setMatrix(this.sceneMatrix,this.viewMatrix,M_MatrixArm1);
      this.drawElement(num);
      //机器臂二
      this.initVertexBuffers(this.gltext,this.vertices_arm2,this.verticesArr); 
      this.modelMatrix.rotate(this.black2Angle, 0.0, 0.0, 1.0);
      let M_MatrixArm2 = new Matrix4().set(this.modelMatrix);
      this.setMatrix(this.sceneMatrix,this.viewMatrix,M_MatrixArm2);
      this.drawElement(num);
      //机器人手掌
      this.initVertexBuffers(this.gltext,this.vertices_palm,this.verticesArr); 
      this.modelMatrix.rotate(this.black3Angle, 0.0, 1.0, 0.0);
      let M_MatrixPalm = new Matrix4().set(this.modelMatrix);
      M_MatrixPalm.translate(0.0, 10.0, 0.0);
      this.setMatrix(this.sceneMatrix,this.viewMatrix,M_MatrixPalm);
      this.drawElement(num);
      //机器人手指一
      this.initVertexBuffers(this.gltext,this.vertices_finger,this.verticesArr); 
      let M_MatrixJoint1 = new Matrix4().set(this.modelMatrix);
      M_MatrixJoint1.translate(0.0, 12.0, 2.0);
      M_MatrixJoint1.rotate(this.black4Angle, 1.0, 0.0, 0.0);
      this.setMatrix(this.sceneMatrix,this.viewMatrix,M_MatrixJoint1);
      this.drawElement(num);
      //机器人手指二
      let M_MatrixJoint2 = new Matrix4().set(this.modelMatrix);
      M_MatrixJoint2.translate(0.0, 12.0, -2.0);
      M_MatrixJoint2.rotate(-this.black4Angle, 1.0, 0.0, 0.0);
      this.setMatrix(this.sceneMatrix,this.viewMatrix,M_MatrixJoint2);
      this.drawElement(num);
    }
  },
}
</script>

<style scoped>

</style>
