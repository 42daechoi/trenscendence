import React, { useState, useEffect } from 'react';

const ResponsivePage = () => {
  const [scale, setScale] = useState(1);

  const adjustSize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1200) {
      setScale(1.2);
    } else {
      setScale(1);
    }
  };

  useEffect(() => {
    // 초기 로드 시 사이즈 조정
    adjustSize();

    // 윈도우 리사이즈 이벤트 감지하여 사이즈 조정
    window.addEventListener('resize', adjustSize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', adjustSize);
    };
  }, []);

  return (
    <div className="container" style={{ transform: `scale(${scale})` }}>
      {/* Your content goes here */}
    </div>
  );
};

export default ResponsivePage;