import { useState } from "react";

export default (input) => {
  let touchStartX, touchEndX, touchStartY, touchEndY;

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEndX = 0; // otherwise the swipe is fired even with usual touch events
    touchStartX = e.targetTouches[0].clientX;

    touchEndY = 0; // otherwise the swipe is fired even with usual touch events
    touchStartY = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e) => {
    touchEndX = e.targetTouches[0].clientX;
    touchEndY = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;


    if (isLeftSwipe && input.directions.includes("left")) {
      input.onSwipedLeft();
    }

    if (isRightSwipe && input.directions.includes("right")) {
      input.onSwipedRight();
    }

    if (isUpSwipe && input.directions.includes("up")) {
      input.onSwipedUp();
    }

    if (isDownSwipe && input.directions.includes("down")) {
      input.onSwipedDown();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
