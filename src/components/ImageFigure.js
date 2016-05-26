import React from 'react';

class ImageFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const {data, arrange} = this.props;

    let styleObj = {};
    if (arrange.pos) {
      styleObj = arrange.pos;
    }

    //如果图片的旋转角度有值且不为0, 添加旋转角度
    if (arrange.rotate) {
      (['-moz-', '-ms-', '-webkit-', '']).forEach(value=> {
        styleObj[value + 'transform'] = 'rotate(' + arrange.rotate + 'deg)';
      })
    }

    if (arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={data.imageURL}
             alt={data.title}/>
        <figcaption>
          <h2 className="img-title">{data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{data.desc}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

export default ImageFigure;
