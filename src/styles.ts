export default `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.open-stories-button {
  position: fixed;
  bottom: 80px;
  left: 30px;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  width: 100px;
  height: 100px;
  background: black;
  border-radius: 100%;
  border: solid 4px black;
  z-index: 9999;
}

.open-stories-button video {
  position: absolute;
  left: -2px;
  top: -2px;
  border-radius: 100%;
  border: solid 2px white;
}


.text-container {
  position: absolute;
  width: 136px;
  height: 136px;
  top: -22px;
  left: -22px;
}

.text-circle {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.text-circle text {
  font-family: 'Roboto', sans-serif;
  font-size: 9px;
  font-weight: 500;
}

.text-circle svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-animation-name: rotate;
  -moz-animation-name: rotate;
  -ms-animation-name: rotate;
  -o-animation-name: rotate;
  animation-name: rotate;
  -webkit-animation-duration: 10s;
  -moz-animation-duration: 10s;
  -ms-animation-duration: 10s;
  -o-animation-duration: 10s;
  animation-duration: 10s;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  -moz-animation-timing-function: linear;
  -ms-animation-timing-function: linear;
  -o-animation-timing-function: linear;
  animation-timing-function: linear;
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(360deg);
  }
}

@-ms-keyframes rotate {
  from {
    -ms-transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
  }
}

@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(360deg);
  }
}
  
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.modal-content {
  border-radius: 8px;
  position: relative;
  width: auto;
  height: auto;
  aspect-ratio: 608 / 1080;
  max-height: 90%;
  overflow: hidden;
  background: black;
  font-family: 'Roboto', sans-serif;
}

.close-modal-button {
  position: absolute;
  top: 22px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  background-color: white;
  padding: 10px;
  border-radius: 100%;
  display: flex;
  border: none;
}

.close-modal-button svg {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.close-modal-button:hover svg {
  transform: scale(1.25)
}

.video-container {
  position: relative;
  height: 100%;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.products-container {
  position: absolute;
  bottom: 100px;
  left: 20px;
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.product {
  display: flex;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.product:hover {
  transform: scale(1.1);
}

.product img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
}

.product {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.product:not(.active) {
  opacity: 50%;
}

.current-product-details {
  text-decoration: none;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  color: white;
  z-index: 3;
  min-height: 32px;
  justify-content: flex-start;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.60);
  padding: 10px;
  border-radius: 6px;
  backdrop-filter: blur(3px);
}

.current-product-details .details{
  display: flex;
  flex-direction: column;
  width: 100%;
}

.current-product-details img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  object-position: center;
}

.product-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
}

.product-price {
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
}

.backdrop {
  height: 80px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.60) 60%);
}

.progress-bars {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 0.3rem;
  z-index: 2;
}

.progress-bar {
  flex: 1;
  height: 3px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.progress {
  width: 0;
  height: 100%;
  border-radius: 10px;
  background: #fff;
}

.progress.filled {
  width: 100% !important;
}

.prev-next-container {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
}
.prev-next-container > button {
  width: 50%;
  height: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
`;
