/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from "react";
import cx from "classnames";
import { motion, useSpring, useTransform } from "framer-motion";

import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import styles from "./styles";
import { CarouselModalProps } from "./type";

function CarouselModal({ shadowRoot, videos }: CarouselModalProps) {
  console.log("IM A MODAL");
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSpring = useSpring(0);
  const progressWidth = useTransform(progressSpring, (value) => `${value}%`);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      const progress = (currentTime / duration) * 100;
      progressSpring.set(isNaN(progress) ? 0 : progress);
    }
  };

  const nextVideo = () => {
    progressSpring.jump(0);
    setCurrentVideoIndex((prevIndex) =>
      Math.min(prevIndex + 1, videos.length - 1)
    );
    setCurrentProductIndex(0);
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
      videoRef.current.src = videos[currentVideoIndex].src;
      videoRef.current.currentTime = 0;
    }
  }, [currentVideoIndex]);

  return (
    <>
      <button className="open-stories-button" onClick={() => setIsOpen(true)}>
        Abrir
      </button>
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
              <button
                className="close-modal-button"
                onClick={() => setIsOpen(false)}
              >
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

class CachaiStoriesWC extends HTMLElement {
  fetchData = async () => {
    // const url = window.location.href;

    const response = await fetch(
      `http://localhost:5000/stories-by-url?url=https://www.google.com`
    );
    const videos = await response.json();

    console.log({ videos });
    if (!videos.length) return null;
    const shadowRoot = this.shadowRoot!;
    const mountPoint = shadowRoot.querySelector("#cachai-wc");
    if (mountPoint) {
      const root = createRoot(mountPoint);
      console.log("renderizando modal");
      root.render(<CarouselModal shadowRoot={shadowRoot} videos={videos} />);
    }
  };

  connectedCallback() {
    console.log("CONECTANDO");
    const shadowRoot = this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    mountPoint.id = "cachai-wc";
    shadowRoot.appendChild(mountPoint);

    const style = document.createElement("style");
    style.textContent = styles;

    shadowRoot.appendChild(style);

    this.fetchData();

    const handlePathChange = () => {
      this.fetchData();
    };

    window.addEventListener("popstate", handlePathChange);
    window.addEventListener("pushstate", handlePathChange);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.fetchData);
    window.removeEventListener("pushstate", this.fetchData);
  }
}

customElements.define("cachai-stories-wc", CachaiStoriesWC);

document.body.appendChild(document.createElement("cachai-stories-wc"));
