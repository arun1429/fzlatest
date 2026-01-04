import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  I18nManager,
} from 'react-native';
import DefaultSlide from '../components/DefaultSlide';

const { width, height } = Dimensions.get('window');

const isIphoneX =
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (height === 812 || width === 812);

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android';

export default class AppSlider extends React.Component {
  static defaultProps = {
    activeDotStyle: {
      backgroundColor: 'rgba(255, 255, 255, .9)',
    },
    dotStyle: {
      backgroundColor: 'rgba(0, 0, 0, .2)',
    },
  };
  state = {
    width,
    height,
    activeIndex: 0,
  };

  goToSlide = pageNum => {
    this.setState({ activeIndex: pageNum });
    this.flatList.scrollToOffset({
      offset: this._rtlSafeIndex(pageNum) * this.state.width,
    });
  };

  // Get the list ref
  getListRef = () => this.flatList;

  _onPaginationPress = index => {
    const activeIndexBeforeChange = this.state.activeIndex;
    this.goToSlide(index);
    this.props.onSlideChange && this.props.onSlideChange(index, activeIndexBeforeChange);
  };

  _renderItem = flatListArgs => {
    const { width, height } = this.state;
    const props = { ...flatListArgs, dimensions: { width, height } };
    return (
      <View style={{ width, flex: 1 }}>
        {this.props.renderItem ? (
          this.props.renderItem(props)
        ) : (
          <DefaultSlide bottomButton={this.props.bottomButton} {...props} />
        )}
      </View>
    );
  };

  _renderButton = (name, onPress) => {
    const show = this.props[`show${name}Button`];
   
    return show ;
  };

  _renderDefaultButton = name => {
    let content = (
      <Text style={[styles.buttonText, this.props.buttonTextStyle]}>
        {this.props[`${name.toLowerCase()}Label`]}
      </Text>
    );
    if (this.props.bottomButton) {
      content = (
        <View
          style={[
            styles.bottomButton,
            (name === 'Skip' || name === 'Prev') && {
              backgroundColor: 'transparent',
            },
            this.props.buttonStyle,
          ]}
        >
          {content}
        </View>
      );
    }
    return content;
  };

  _renderPagination = () => {
    return (
      <View style={[styles.paginationContainer, this.props.paginationStyle]}>
        <View style={styles.paginationDots}>
          {this.props.slides.length > 1 &&
            this.props.slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  this._rtlSafeIndex(i) === this.state.activeIndex
                    ? this.props.activeDotStyle
                    : this.props.dotStyle,
                ]}
                onPress={() => this._onPaginationPress(i)}
              />
            ))}
        </View>
      
      </View>
    );
  };

  _rtlSafeIndex = i => (isAndroidRTL ? this.props.slides.length - 1 - i : i);

  _onMomentumScrollEnd = e => {
    const offset = e.nativeEvent.contentOffset.x;
    // Touching very very quickly and continuous brings about
    // a variation close to - but not quite - the width.
    // That's why we round the number.
    // Also, Android phones and their weird numbers
    const newIndex = this._rtlSafeIndex(Math.round(offset / this.state.width));
    if (newIndex === this.state.activeIndex) {
      // No page change, don't do anything
      return;
    }
    const lastIndex = this.state.activeIndex;
    this.setState({ activeIndex: newIndex });
    this.props.onSlideChange && this.props.onSlideChange(newIndex, lastIndex);
  };

  _onLayout = () => {
    const { width, height } = Dimensions.get('window');
    if (width !== this.state.width || height !== this.state.height) {
      // Set new width to update rendering of pages
      this.setState({ width, height });
      // Set new scroll position
      const func = () => {
        this.flatList.scrollToOffset({
          offset: this._rtlSafeIndex(this.state.activeIndex) * width,
          animated: false,
        });
      };
      Platform.OS === 'android' ? setTimeout(func, 0) : func();
    }
  };

  render() {
    // Separate props used by the component to props passed to FlatList
    const {
      hidePagination,
      activeDotStyle,
      dotStyle,
      buttonStyle,
      buttonTextStyle,
      renderItem,
      data,
      ...otherProps
    } = this.props;

    return (
      <View style={styles.flexOne}>
        <FlatList
          ref={ref => (this.flatList = ref)}
          data={this.props.slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={styles.flatList}
          renderItem={this._renderItem}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          extraData={this.state.width}
          onLayout={this._onLayout}
          {...otherProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16 + (isIphoneX ? 34 : 0),
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  leftButtonContainer: {
    position: 'absolute',
    left: 0,
  },
  rightButtonContainer: {
    position: 'absolute',
    right: 0,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
    padding: 12,
  },
});
