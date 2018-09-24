import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Developed with',
          title: 'Developed with',
          href: 'https://vniche.github.io',
          blankTarget: true,
        },
        {
          key: 'heart',
          title: <Icon type="heart" theme="filled" style={{color: '#E60000'}} />,
          href: 'https://vniche.github.io'
        },
        {
          key: 'by Vinícius Niche',
          title: 'by Vinícius Niche',
          href: 'https://vniche.github.io',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 <a href="https://vniche.github.io/cooldo">cooldo</a>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
