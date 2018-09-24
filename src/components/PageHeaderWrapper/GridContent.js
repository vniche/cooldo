import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './GridContent.less';

class GridContent extends PureComponent {
  render() {
    const { children } = this.props;
    let className = `${styles.main}`;
    return <div className={className}>{children}</div>;
  }
}

export default connect(({}) => ({
}))(GridContent);
