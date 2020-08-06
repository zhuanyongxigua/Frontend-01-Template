import { createElement, Text, Wrapper } from './createElement';
import { CarouselView } from './carouselView';

import carouselCss from './carousel.css';

export class Carousel {
  constructor(config) {
    this.carouseView = null;
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
  render() {
    this.carouseView = <CarouselView>
      {this.data.map(record => <img src={record}/>)}
    </CarouselView>
    return <div>
      {this.carouseView}
      <button onClick={() => this.carouseView.stop()}>stop</button>
      <button onClick={() => this.carouseView.restart()}>restart</button>
    </div>
  }
}