import React from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useThemeMediaQuery } from '@fuse/hooks';
import Content from './components/Content';

const Tasks: React.FC = () => {
  const isMobile = useThemeMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  return <FusePageCarded scroll={isMobile ? 'normal' : 'content'} content={<Content />} />;
};

export default Tasks;
