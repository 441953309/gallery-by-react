import React from 'react';
import ReactDOM from 'react-dom';
import ImageFigure from './ImageFigure';

require('normalize.css/normalize.css');
require('styles/main.scss');

//获取图片相关的函数
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数, 将图片名信息转成图片URL路径信息
imageDatas = (function (imageDataArr) {
  for (var i = 0; i < imageDataArr.length; i++) {
    var imageData = imageDataArr[i];
    imageData.imageURL = require('../images/' + imageData.fileName);
    imageDataArr[i] = imageData;
  }
  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgArrangeArr: [
        /*{
         pos: {left: 0, right: 0},
         rotate: 0,         //旋转角度
         isInverse: false,  //图片正反面
         isCenter: false    //图片是否居中
         }*/
      ],
      centerPos: {left: 0, top: 0},
      hPosRange: {leftSecX: [0, 0], rightSecX: [0, 0], y: [0, 0]},
      vPosRange: {x: [0, 0], topY: [0, 0]}
    }
  }

  //组建加载以后, 为每张图片计算其位置的范围
  componentDidMount() {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.state.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左侧,右侧区域图片排布位置的取值范围
    this.state.hPosRange.leftSecX[0] = -halfImgW;
    this.state.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.hPosRange.y[0] = -halfImgH;
    this.state.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.state.vPosRange.topY[0] = -halfImgH;
    this.state.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.state.vPosRange.x[0] = halfStageW - imgW;
    this.state.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  //获取区间内的一个随机值
  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  //获取0-30°之间的一个任意正负值
  get30DegRandom() {
    return Math.random() > 0.5 ? '' : '-' + Math.ceil(Math.random() * 30);
  }

  /**
   * 反转图片
   * @param index 输入当前执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   */
  inverse(index) {
    return ()=> {
      var {imgArrangeArr} = this.state;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      this.setState({
        imgArrangeArr: imgArrangeArr
      })
    }
  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布那个图片
   */
  rearrange(centerIndex) {
    var {imgArrangeArr, centerPos, hPosRange, vPosRange} = this.state;

    var hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgArrangeTopArr,
      topImgNmu = Math.floor(Math.random() * 2), //取一个或者不取
      topImgSpliceIndex,

      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

    //首先居中centerIndex的图片
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNmu))
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNmu);

    //布局位于上侧的图片
    imgArrangeTopArr.forEach((value, index)=> {
      imgArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    });

    //布局左右两侧的图片
    for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;
      //前半部分布局左边, 后半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    }

    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }

    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }

  center(index) {
    return ()=> {
      this.rearrange(index);
    }
  }

  render() {
    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach((value, index) => {
      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {left: 0, top: 0},
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImageFigure key={index} ref={'imgFigure'+index}
                                   data={value}
                                   arrange={this.state.imgArrangeArr[index]}
                                   inverse={this.inverse(index)}
                                   center={this.center(index)}/>);
    })

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
