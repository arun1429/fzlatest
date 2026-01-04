import React, { useEffect, useState } from 'react';

const withSequentialRendering = (WrappedComponent) => {
  let queue = [];
  let isRendering = false;

  return (props) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      queue.push(() => setShouldRender(true));

      if (!isRendering) {
        isRendering = true;
        queue.shift()();
      }
    }, []);

    useEffect(() => {
      if (shouldRender) {
        isRendering = false;
        if (queue.length > 0) {
          queue.shift()();
        }
      }
    }, [shouldRender]);

    return shouldRender ? <WrappedComponent {...props} /> : null;
  };
};

export default withSequentialRendering;