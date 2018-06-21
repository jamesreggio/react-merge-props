"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeScroll = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var objectFrom = function objectFrom(keys, value) {
  return keys.reduce(function (object, key) {
    return _objectSpread({}, object, _defineProperty({}, key, value));
  });
};

var ScrollViewProps = ['DEPRECATED_sendUpdatedChildFrames', 'alwaysBounceHorizontal', 'alwaysBounceVertical', 'automaticallyAdjustContentInsets', 'bounces', 'bouncesZoom', 'canCancelContentTouches', 'centerContent', 'contentContainerStyle', 'contentInset', 'contentInsetAdjustmentBehavior', 'contentOffset', 'decelerationRate', 'directionalLockEnabled', 'endFillColor', 'horizontal', 'indicatorStyle', 'keyboardDismissMode', 'keyboardShouldPersistTaps', 'maximumZoomScale', 'minimumZoomScale', 'onContentSizeChange', 'onMomentumScrollBegin', 'onMomentumScrollEnd', 'onScroll', 'overScrollMode', 'pagingEnabled', 'pinchGestureEnabled', 'refreshControl', 'removeClippedSubviews', 'scrollEnabled', 'scrollEventThrottle', 'scrollIndicatorInsets', 'scrollPerfTag', 'scrollsToTop', 'showsHorizontalScrollIndicator', 'showsVerticalScrollIndicator', 'snapToAlignment', 'snapToInterval', 'stickyHeaderIndices', 'zoomScale'];

var ScrollViewPropMergers = _objectSpread({}, objectFrom(ScrollViewProps, takeOuter), {
  onScroll: mergeCallback,
  onScrollBeginDrag: mergeCallback,
  onScrollEndDrag: mergeCallback,
  onMomentumScrollBegin: mergeCallback,
  onMomentumScrollEnd: mergeCallback,
  onContentSizeChange: mergeCallback,
  scrollEventThrottle: Math.min,
  contentContainerStyle: mergeStyle
});

var mergeScroll = function mergeScroll(Input) {
  return transformRoot(Input, mergeProps(ScrollViewPropMergers));
};

exports.mergeScroll = mergeScroll;