/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from "react";
import cx from "classnames";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import styles from "./styles";
import { CarouselModalProps } from "./type";

type TrackEvent = {
  action: string;
  category: string;
  label: string;
  value?: string | number;
  videoId?: string;
  productId?: string | null;
};

const getUserId = () => {
  let userId = localStorage.getItem("trendfit_user_id");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("trendfit_user_id", userId as string);
  }
  return userId;
};

function CarouselModal({ shadowRoot, videos }: CarouselModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSpring = useSpring(0);
  const progressWidth = useTransform(progressSpring, (value) => `${value}%`);
  const currentUserId = getUserId();

  const trackEvent = ({
    action,
    category,
    label,
    value,
    videoId,
    productId,
  }: TrackEvent) => {
    const event = {
      userId: currentUserId,
      eventType: action,
      value,
      videoId,
      label,
      productId,
    };

    fetch("https://backend.trendfit.app/log-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (typeof window.gtag !== "undefined") {
      console.log(
        `Tracking event: ${action} | ${category} | ${label} | ${value}`
      );
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    } else {
      console.warn("gtag is not defined");
    }
  };
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

    if (videos[currentVideoIndex + 1].id)
      trackEvent({
        action: "trendfit_video_change",
        category: "Trendfit Videos",
        videoId: videos[currentVideoIndex].id,
        productId: null,
        label: `Video ID: ${
          videos[currentVideoIndex].id
        } changed to Video ID: ${videos[currentVideoIndex + 1].id}`,
      });
  };

  const prevVideo = () => {
    progressSpring.jump(0);

    setCurrentVideoIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      if (prevIndex !== 0 && videos[newIndex].id) {
        trackEvent({
          action: "trendfit_video_change",
          category: "Trendfit Videos",
          videoId: videos[newIndex].id,
          productId: null,
          label: `Video ID: ${videos[prevIndex].id} changed to Video ID: ${videos[newIndex].id}`,
        });
      }
      return newIndex;
    });

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
      trackEvent({
        action: "trendfit_video_view",
        category: "Trendfit Videos",
        label: `Video ID: ${currentVideo.id} viewed`,
        value: currentVideo.id,
        videoId: currentVideo.id,
        productId: null,
      });
    }
  }, [currentVideo.id, currentVideoIndex, videos]);

  const handleOpen = () => {
    setIsOpen(true);
    trackEvent({
      action: "trendfit_modal_open",
      category: "Trendfit Modal",
      label: "Story Modal Opened",
      videoId: videos?.[0].id,
      productId: null,
    });
    trackEvent({
      action: "trendfit_video_view",
      category: "Trendfit Videos",
      label: `Video ID: ${currentVideo.id} viewed`,
      value: currentVideo.id,
      videoId: currentVideo.id,
      productId: null,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    trackEvent({
      action: "trendfit_modal_close",
      category: "Trendfit Modal",
      label: "Story Modal Closed",
      videoId: currentVideo.id, // TO DO: Que hacemos si el video es el ultimo y el usuario cerro el modal precisamente porque era el ultimo video?
      productId: null,
    });
  };

  const handleVideoEnd = () => {
    trackEvent({
      action: "trendfit_video_complete",
      category: "Trendfit Videos",
      label: `Video ID: ${currentVideo.id} completed`,
      value: currentVideo.id,
      videoId: currentVideo.id,
      productId: null,
    });
    nextVideo();
  };

  useEffect(() => {
    progressSpring.jump(0);
  }, [currentVideoIndex, progressSpring]);

  return (
    <>
      {!isOpen && (
        <button className="open-stories-button" onClick={handleOpen}>
          <video
            src={videos?.[0]?.src}
            poster={videos?.[0]?.poster}
            autoPlay
            muted
            loop
            playsInline
          />
        </button>
      )}

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
              <button className="close-modal-button" onClick={handleClose}>
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
                          index === currentVideoIndex
                            ? progressWidth
                            : index < currentVideoIndex
                            ? "100%"
                            : "0%",
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
                  onEnded={handleVideoEnd}
                  poster={currentVideo.poster}
                  onTimeUpdate={handleTimeUpdate}
                />
                {currentVideo.products.length > 1 && (
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
                        onClick={() => {
                          trackEvent({
                            action: "trendfit_product_click",
                            category: "Trendfit Products",
                            label: `Product ID: ${product.id} clicked`,
                            value: product.id,
                            productId: product.id,
                            videoId: currentVideo.id,
                          });
                        }}
                      >
                        <img src={product.image} alt={product.name} />
                      </a>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait" initial={false}>
                  <motion.a
                    key={currentProduct.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="current-product-details"
                    href={currentProduct.url}
                    target="_blank"
                    onClick={() => {
                      trackEvent({
                        action: "trendfit_product_click",
                        category: "Trendfit Products",
                        label: `Product ID: ${currentProduct.id} clicked`,
                        value: currentProduct.id,
                        productId: currentProduct.id,
                        videoId: currentVideo.id,
                      });
                    }}
                  >
                    <img src={currentProduct.image} />
                    <div className="details">
                      <span className="product-name">
                        {currentProduct.name}
                      </span>
                      <span className="product-price">
                        ${currentProduct.price} {currentProduct.currency}
                      </span>
                    </div>
                  </motion.a>
                </AnimatePresence>
                <div className="prev-next-container">
                  <button onClick={prevVideo} tabIndex={undefined} />
                  <button onClick={nextVideo} tabIndex={undefined} />
                </div>
              </div>

              {/* <div className="backdrop" /> */}
            </motion.div>
          </motion.div>,
          shadowRoot
        )}
    </>
  );
}

class trendfitStoriesWC extends HTMLElement {
  fetchData = async () => {
    const url = window.location.href;

    const response = await fetch(
      `https://backend.trendfit.app/stories-by-url?url=${encodeURIComponent(
        url
      )}`
    );
    const videos = await response.json();

    if (!videos.length) return null;
    const shadowRoot = this.shadowRoot!;
    const mountPoint = shadowRoot.querySelector("#trendfit-wc");

    console.log({ videos });
    if (mountPoint) {
      const root = createRoot(mountPoint);
      root.render(<CarouselModal shadowRoot={shadowRoot} videos={videos} />);
    }
  };

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    mountPoint.id = "trendfit-wc";
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

customElements.define("trendfit-stories-wc", trendfitStoriesWC);

document.body.appendChild(document.createElement("trendfit-stories-wc"));
