import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

type ContainerProps = {
  loading: boolean,
  type: 'circle' | 'bar' | 'clock',
  title: String,
  value: String | number
}

export function AnimatedCard(props: ContainerProps) {
  return (
    <div className="flex-1 p-6 min-w-fit rounded-lg bg-white flex items-center gap-4 shadow">
      {props.loading ? <>
        <Skeleton height={48} width={48} />
        <div className="flex gap-4 flex-col flex-1">
          <Skeleton height={20} width='100%' />
          <Skeleton height={20} width='100%' />
        </div>
      </> : <>
        <Animated type={props.type} />
        <div className="flex flex-1 flex-col gap-2">
          <h5 className='text-lg font-bold text-gray-500'>
            {props.title}
          </h5>
          <p className='text-base font-medium text-gray-700'>
            {props.value}
          </p>
        </div>
      </>
      }
    </div>
  )
}

type AnimatedProps = {
  type: 'circle' | 'bar' | 'clock'
}

const Animated = ({ type }: AnimatedProps) => {

  const circlePathVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1 },
  };

  const hourControl = useAnimation();
  const minuteControl = useAnimation();

  useEffect(() => {
    const animateClock = async () => {
      hourControl.start({ rotate: 185, transition: { duration: 1.25 } });
      minuteControl.start({ rotate: 45, transition: { duration: 1.25 } });
    };

    animateClock();
  }, []);

  if (type == 'circle') {
    return (
      <div className="w-28 h-28">
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <motion.path
            d="M 50,50 m 0,-45 a 45,45 0 1,1 0,90 a 45,45 0 1,1 0,-90"
            fill="transparent"
            stroke="rgb(14 165 233)"
            strokeWidth="10"
            strokeLinecap="round"
            initial="hidden"
            animate="visible"
            variants={circlePathVariants}
            transition={{ duration: 1.25 }}
          />
        </svg>
      </div>
    )
  } else if (type == 'bar') {
    return (
      <div className="w-28 h-28">
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <motion.rect
            x="10"
            y="40"
            width="20"
            height="70"
            fill="rgb(14 165 233)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.675 }}
          />
          <motion.rect
            x="40"
            y="5"
            width="20"
            height="110"
            fill="rgb(2 132 199)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.rect
            x="70"
            y="40"
            width="20"
            height="70"
            fill="rgb(3 105 161)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.25 }}
          />
        </svg>
      </div>
    )
  } else {
    return (
      <div className="w-28 h-28 relative">
        <motion.div
          className="absolute w-full h-full rounded-full bg-sky-500 border-4 border-gray-300 overflow-hidden"
          style={{ originX: 'center', originY: 'center' }}
        >
          <motion.div
            style={{
              width: '2px',
              height: '30%',
              background: 'white',
              position: 'absolute',
              left: 'calc(50% - 1px)',
              top: 'calc(50% - 30%)',
              originX: '50%',
              originY: '100%',
              transformOrigin: '50% 100%',
              rotate: 0,
              zIndex: 2,
            }}
            animate={hourControl}
            initial={false}
          />
          <motion.div
            style={{
              width: '2px',
              height: '40%',
              background: 'white',
              position: 'absolute',
              left: 'calc(50% - 1px)',
              top: 'calc(50% - 40%)',
              originX: '50%',
              originY: '100%',
              transformOrigin: '50% 100%',
              rotate: 0,
              zIndex: 3,
            }}
            animate={minuteControl}
            initial={false}
          />
        </motion.div>
      </div>
    )
  }
}