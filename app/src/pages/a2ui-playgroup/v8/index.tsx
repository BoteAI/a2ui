import React from 'react';
import GalleryPlayground from '../shared/GalleryPlayground';
import { V8_GALLERY_ITEMS } from './gallery';

const A2UIPlaygroupV8: React.FC = () => (
  <GalleryPlayground
    pageTitle="协议 v0.8"
    protocolVersion="0.8"
    galleryItems={V8_GALLERY_ITEMS}
    customComponents={{}}
    peerPath="/a2ui-playgroup/v9"
    peerLabel="协议 0.9"
  />
);

export default A2UIPlaygroupV8;
