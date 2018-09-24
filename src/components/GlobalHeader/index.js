import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { logo } = this.props;
    return (
      <div className={styles.header}>
        <a href="#" onClick={this.toggle} className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
        </a>
      </div>
    );
  }
}
