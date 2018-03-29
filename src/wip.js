const objectFrom = (keys, value) => keys.reduce((object, key) => ({
  ...object,
  [key]: value,
}));

const ScrollViewProps = [
  'DEPRECATED_sendUpdatedChildFrames',
  'alwaysBounceHorizontal',
  'alwaysBounceVertical',
  'automaticallyAdjustContentInsets',
  'bounces',
  'bouncesZoom',
  'canCancelContentTouches',
  'centerContent',
  'contentContainerStyle',
  'contentInset',
  'contentInsetAdjustmentBehavior',
  'contentOffset',
  'decelerationRate',
  'directionalLockEnabled',
  'endFillColor',
  'horizontal',
  'indicatorStyle',
  'keyboardDismissMode',
  'keyboardShouldPersistTaps',
  'maximumZoomScale',
  'minimumZoomScale',
  'onContentSizeChange',
  'onMomentumScrollBegin',
  'onMomentumScrollEnd',
  'onScroll',
  'overScrollMode',
  'pagingEnabled',
  'pinchGestureEnabled',
  'refreshControl',
  'removeClippedSubviews',
  'scrollEnabled',
  'scrollEventThrottle',
  'scrollIndicatorInsets',
  'scrollPerfTag',
  'scrollsToTop',
  'showsHorizontalScrollIndicator',
  'showsVerticalScrollIndicator',
  'snapToAlignment',
  'snapToInterval',
  'stickyHeaderIndices',
  'zoomScale',
];

const ScrollViewPropMergers = {
  ...objectFrom(ScrollViewProps, takeOuter),

  onScroll: mergeCallback,
  onScrollBeginDrag: mergeCallback,
  onScrollEndDrag: mergeCallback,
  onMomentumScrollBegin: mergeCallback,
  onMomentumScrollEnd: mergeCallback,
  onContentSizeChange: mergeCallback,

  scrollEventThrottle: Math.min,
  contentContainerStyle: mergeStyle,
};

export const mergeScroll = (Input) => (
  transformRoot(Input, mergeProps(ScrollViewPropMergers))
);
