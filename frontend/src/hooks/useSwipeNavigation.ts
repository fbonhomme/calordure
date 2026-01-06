import { useSwipeable, SwipeableHandlers } from 'react-swipeable';

interface UseSwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled?: boolean;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
}: UseSwipeNavigationProps): SwipeableHandlers {
  return useSwipeable({
    onSwipedLeft: () => {
      if (enabled) {
        onSwipeLeft();
      }
    },
    onSwipedRight: () => {
      if (enabled) {
        onSwipeRight();
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false, // Only touch gestures, not mouse drag
    trackTouch: true,
    delta: 50, // Minimum distance for swipe (pixels)
    swipeDuration: 500, // Maximum duration for swipe (ms)
  });
}
