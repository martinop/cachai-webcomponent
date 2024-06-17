export default `
.open-stories-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  z-index: 1000;
}

.modal-content {
  border-radius: 8px;
  position: relative;
  width: 320px; /* Set a fixed width */
  height: 576px; /* Set a fixed height */
  max-height: 90%;
  overflow: hidden;
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
  bottom: 40px;
  left: 10px;
  display: flex;
  flex-direction: column;
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
  width: 64px;
  height: 64px;
  object-fit: cover;
  object-position: center;
  border-radius: 2px;
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
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  color: white;
  z-index: 3;
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
`;
