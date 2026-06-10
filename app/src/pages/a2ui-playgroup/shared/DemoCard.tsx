import React, { useEffect, useRef, useState } from 'react';
import { BookOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import {
  BaseRenderer,
  type A2UIMessage,
  type A2UIThemePreset,
} from '@bote/a2ui-render';
import type { A2UICustomComponentRegistry } from '@bote/a2ui-custom-kit';
import type { GalleryItem } from './gallery';
import { navigateTo, openGuideUrl } from './navigate';
import styles from './index.less';

export type DemoCardProps = {
  item: GalleryItem;
  index: number;
  themePreset: A2UIThemePreset;
  protocolVersion: '0.8' | '0.9';
  customComponents: A2UICustomComponentRegistry;
  previewMessages?: A2UIMessage[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: GalleryItem) => void;
  onUse: (item: GalleryItem) => void;
};

const DemoCard: React.FC<DemoCardProps> = ({
  item,
  index,
  themePreset,
  protocolVersion,
  customComponents,
  previewMessages,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onUse,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const messages = previewMessages ?? item.messages;
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <div ref={cardRef} className={styles.demoCard} onClick={() => onOpen(item)}>
      <div className={styles.demoCardPreview}>
        {visible ? (
          <div className={styles.demoCardRenderer}>
            <BaseRenderer
              messages={messages}
              protocolVersion={protocolVersion}
              customComponents={customComponents}
              themePreset={themePreset}
              onAction={() => {}}
              silentOnError
            />
          </div>
        ) : (
          <div className={styles.demoCardPlaceholder} />
        )}
      </div>

      <button
        type="button"
        className={styles.demoCardFavorite}
        aria-label={isFavorite ? '取消收藏' : '收藏'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item.id);
        }}
      >
        {isFavorite ? <StarFilled /> : <StarOutlined />}
      </button>

      <div className={styles.demoCardBody}>
        <div className={styles.demoCardIndex}>{indexLabel}</div>
        <div className={styles.demoCardTitle}>{item.label}</div>
        {item.description ? (
          <div className={styles.demoCardDesc}>{item.description}</div>
        ) : null}
        <div className={styles.demoCardFooter}>
          {item.guideUrl ? (
            <button
              type="button"
              className={styles.demoCardGuideBtn}
              onClick={(e) => {
                e.stopPropagation();
                openGuideUrl(item.guideUrl!);
              }}
            >
              <BookOutlined /> 开发指南
            </button>
          ) : (
            <span className={styles.demoCardTag}>{item.label}</span>
          )}
          <button
            type="button"
            className={styles.demoCardUseBtn}
            onClick={(e) => {
              e.stopPropagation();
              onUse(item);
            }}
          >
            使用
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;
