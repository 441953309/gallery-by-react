import React from 'react';

require('normalize.css/normalize.css');
require('/styles/App.css');

//获取图片相关的函数
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数, 将图片名信息转成图片URL路径信息
imageData = (function (imageDataArr) {
  for (var i = 0; i < imageDataArr.length; i++) {
    var imageData = imageDataArr[i];
    imageData.imageURL = require('../images/' + imageData.fileName);
    imageDataArr[i] = imageData;
  }
  return imageDataArr;
})(imageDatas);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator"/>
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
