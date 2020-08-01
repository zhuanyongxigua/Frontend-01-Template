import { createElement, Text, Wrapper } from './createElement';
import { CarouselView } from './carouselView';

import carouselCss from './carousel.css';

export class Carousel {
  constructor(config) {

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
    return <CarouselView>
      {this.data.map(record => <img src={record}/>)}
    </CarouselView>
  }
}