type StoryProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  url: string;
  currency: string;
  order: number;
};

export type StoryVideo = {
  id: string;
  src: string;
  poster: string;
  title: string;
  products: StoryProduct[];
};

export type CarouselModalProps = {
  shadowRoot: ShadowRoot;
  videos: StoryVideo[];
};
