//顶点着色器，u_ModelMatrix表示一个4*4的矩阵，a_Position表示顶点坐标
//u_ModelMatrix * a_Position两者相乘表示变换后的坐标
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';
 
//片元着色器
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' +
  '}\n';
 
// 旋转角度(度/秒)
var ANGLE_STEP = 45.0;
 
function main() {
  // 获取canvas元素
  var canvas = document.getElementById('webgl');
 
  // 获取canvas上下文
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
 
  //	初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
 
  // 设置顶点位置
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
 
  // 设置背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  // 获取u_ModelMatrix变量的存储位置
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
 
  // 当前旋转角
  var currentAngle = 0.0;
  // 模型矩阵，matrix4对象
  var modelMatrix = new Matrix4();
 
  // 开始绘制三角形
  var tick = function() {
  	// 更新旋转角度
    currentAngle = animate(currentAngle);  
    
    // 绘制三角形
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   
    
    // 请求浏览器 tick
    requestAnimationFrame(tick, canvas); 
  };
  tick();//调用函数，形成一个调用循环
}
//设置的是点的位置
function initVertexBuffers(gl) {
  var vertices = new Float32Array ([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = 3;   // 顶点数
 
  // 创建缓冲区对象
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
 
  // 绑定缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 将数据写入缓冲区对象以供着色器使用
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
 
  // 获取attribute的位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // 将缓冲区对象分配给attribute变量，这里只有平面的顶点xy，所谓分量为2，第三四分量会默认为0.0,1.0
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
 
  // 开启attribute变量
  gl.enableVertexAttribArray(a_Position);
 
  return n;
}
/*方法说明
 *@method 绘制三角形
 *@param 
 * gl： 绘制三角形的上下文   
 * n ： 顶点个数
 * currentAngle： 当前的旋转角度
 * modelMatrix：   根据当前的旋转角度角度计算出来的旋转矩阵，储存在matrix4对象中
 * u_ModelMatrix：顶点着色器中同名的uniform变量的储存位置，modelMatrix变量将被传递到这里
 *@return 无
*/
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // 设置旋转矩阵
  modelMatrix.setRotate(currentAngle, 0, 0, 1); 
 
  // 将旋转矩阵传输给顶点着色器
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
 
  // 清除canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
 
  // 绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
 
// 记录上一次调用函数的时刻
var g_last = Date.now();
function animate(angle) {
  // 计算距离上次调用经过了多长时间
  var now = Date.now();
  
 	//得到这一次调用与上一次调用的时间间隔
  var elapsed = now - g_last;
  g_last = now;
  // 根据距离上次调用的时间，更新当前的旋转角度
  //变量gl_last和now都是Data对象now方法的返回值，单位是毫秒
  //所以我们要想按美妙来旋转多少度，我们还多除以1000
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  //返回一个始终是小于360°的角度
  return newAngle %= 360;
}
