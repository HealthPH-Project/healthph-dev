export default (input) => {
  let touchStartX, touchEndX, touchStartY, touchEndY;

  // Minimum distance to swipe
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

    // Swipe distance horizontally
    const distanceX = touchStartX - touchEndX;
    // Swipe distance vertically
    const distanceY = touchStartY - touchEndY;

    // Swiped left if distance horizontally is greater than 50
    const isLeftSwipe = distanceX > minSwipeDistance;
    // Swiped right if distance horizontally is less than -50
    const isRightSwipe = distanceX < -minSwipeDistance;

    // Swiped up if distance vertically is greater than 50
    const isUpSwipe = distanceY > minSwipeDistance;
    // Swiped down if distance vertically is less than -50
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
