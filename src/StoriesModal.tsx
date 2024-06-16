/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from "react";
import cx from "classnames";
import { motion, useSpring, useTransform } from "framer-motion";

import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

type CarouselModalProps = {
  shadowRoot: ShadowRoot;
};

const videos = [
  {
    id: "1",
    src: "https://cachai.s3.us-west-2.amazonaws.com/12bab565-d53f-4523-82d4-57216d1981b0-video%20%281%29.mp4",
    poster:
      "https://cachai.s3.us-west-2.amazonaws.com/poster-7c809938-6bbb-483d-a376-3aba01f91ae6-video%20%281%29.jpg",
    products: [
      {
        id: "p1",
        name: "Product 1",
        image:
          "https://caffarenacl.vtexassets.com/arquivos/ids/163283/1321_88_M1-MARZO-23-2.jpg?v=638447396086500000",
        price: "1.000,00",
        url: "https://www.instagram.com/",
      },
      {
        id: "2",
        name: "Product 2",
        image:
          "https://caffarenacl.vtexassets.com/arquivos/ids/163283/1321_88_M1-MARZO-23-2.jpg?v=638447396086500000",
        price: "2.000,00",
        url: "https://www.instagram.com/",
      },
    ],
  },
  {
    id: "2",
    src: "https://cachai.s3.us-west-2.amazonaws.com/da7ba7e8-85e3-4d94-b5d6-3b9fe6ea5d1a-IMG_9241.MOV",
    poster:
      "https://cachai.s3.us-west-2.amazonaws.com/poster-aaf58422-8df0-4de4-a803-c4010f22f6b1-IMG_9241.jpg",
    products: [
      {
        id: "p3",
        name: "Product 3",
        image:
          "https://caffarenacl.vtexassets.com/arquivos/ids/163283/1321_88_M1-MARZO-23-2.jpg?v=638447396086500000",
        price: "R$ 3.000,00",
        url: "https://www.instagram.com/",
      },
    ],
  },
];

function CarouselModal({ shadowRoot }: CarouselModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSpring = useSpring(0);
  const progressWidth = useTransform(progressSpring, (value) => `${value}%`);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleOpenModal = () => openModal();
    window.addEventListener("openStoriesModal", handleOpenModal);
    return () =>
      window.removeEventListener("openStoriesModal", handleOpenModal);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      const progress = (currentTime / duration) * 100;
      progressSpring.set(isNaN(progress) ? 0 : progress);
    }
  };

  const nextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      videoRef.current?.pause();
      progressSpring.set(0);
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
      setCurrentProductIndex(0);
    }
  };

  const currentVideo = videos[currentVideoIndex];
  const currentProduct = currentVideo.products[currentProductIndex];

  useEffect(() => {
    const nextProduct = () => {
      setCurrentProductIndex(
        (prevIndex) => (prevIndex + 1) % currentVideo.products.length
      );
    };

    const interval = setInterval(nextProduct, 3000);
    return () => clearInterval(interval);
  }, [currentVideo]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.src = videos[currentVideoIndex].src;
    }
  }, [currentVideoIndex]);

  return (
    <>
      {isOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="modal-content"
            >
              <button className="close-modal-button" onClick={closeModal}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
                </svg>
              </button>
              <div className="progress-bars">
                {videos.map((_, index) => (
                  <div key={index} className="progress-bar">
                    <motion.div
                      className={cx("progress", {
                        filled: index < currentVideoIndex,
                      })}
                      initial={{ width: 0 }}
                      style={{
                        width:
                          index === currentVideoIndex ? progressWidth : "100%",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="video-container">
                <video
                  src={currentVideo.src}
                  ref={videoRef}
                  autoPlay
                  playsInline
                  onEnded={nextVideo}
                  poster={currentVideo.poster}
                  onTimeUpdate={handleTimeUpdate}
                  style={{ width: 320, height: 576 }}
                />
                <div className="products-container">
                  {currentVideo.products.map((product, index) => (
                    <a
                      key={product.id}
                      href={product.url}
                      target="_blank"
                      className={cx(
                        "product",
                        index === currentProductIndex && "active"
                      )}
                    >
                      <img src={product.image} alt={product.name} />
                    </a>
                  ))}
                </div>
                <div className="current-product-details">
                  <span>{currentProduct.name}</span>
                  <span>{currentProduct.price}</span>
                </div>
              </div>
              <div className="backdrop" />
            </motion.div>
          </motion.div>,
          shadowRoot
        )}
    </>
  );
}

class StoriesModalWC extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    shadowRoot.appendChild(mountPoint);

    const root = createRoot(mountPoint);
    root.render(<CarouselModal shadowRoot={shadowRoot} />);

    const style = document.createElement("style");
    style.textContent = `
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
    shadowRoot.appendChild(style);
  }
}

customElements.define("cachai-stories-modal", StoriesModalWC);

document.body.appendChild(document.createElement("cachai-stories-modal"));
