import {useCallback, useRef} from 'react';

const useThrottle = (fn: any, wait: any, option = {leading: true, trailing: true}) => {
  const timerId = useRef<any>(); // track the timer
  const lastArgs = useRef<any>(); // track the args

  // create a memoized debounce
  const throttle = useCallback(
    function (...args: any[]) {
      const {trailing, leading} = option;
      // function for delayed call
      const waitFunc = () => {
        // if trailing invoke the function and start the timer again
        if (trailing && lastArgs.current) {
          //@ts-ignore
          fn.apply(this, lastArgs.current);
          lastArgs.current = null;
          timerId.current = setTimeout(waitFunc, wait);
        } else {
          // else reset the timer
          timerId.current = null;
        }
      };

      // if leading run it right away
      if (!timerId.current && leading) {
        //@ts-ignore
        fn.apply(this, args);
      }
      // else store the args
      else {
        lastArgs.current = args;
      }

      // run the delayed call
      if (!timerId.current) {
        timerId.current = setTimeout(waitFunc, wait);
      }
    },
    [fn, wait, option],
  );

  return throttle;
};

export default useThrottle;
