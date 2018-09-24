import React, { Component } from 'react';
import { connect } from 'dva';
import {
  List,
  Card,
  Button,
  Icon,
  Menu,
  Tooltip,
  Dropdown,
  Checkbox,
  Form,
} from 'antd';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow';
import TagSelect from '@/components/TagSelect';
import moment from 'moment';

import styles from './Todos.less';

const FormItem = Form.Item;

function getStatusColor(todo) {
  let due = moment(todo.dueDate);
  if (due.isValid()) {
    if (todo.done) {
      return '#1890FF';
    }
    if (due.isBefore(moment().add(1, 'days'))) {
      return 'red';
    }
    if (due.isBefore(moment().add(10, 'days'))) {
      return 'yellow';
    }
  }
  return 'rgba(0, 0, 0, 0.45)';
}

@connect(({ todos, loading }) => ({
  todos,
  loading: loading.models.todos,
}))
@Form.create({
  onValuesChange({ dispatch, todos }, _, allValues) {
    let {
      filters,
    } = todos;
    if (allValues.status.length > 0) {
      ["done", "archived"].map(status => {
        if (allValues.status.includes(status))
          filters[status] = true;
        else
          delete filters[status];
      });
    } else {
      filters = {
        done: false,
        archived: false,
      };
    }
    dispatch({
      type: 'todos/fetch',
      payload: {
        ...filters,
      },
    });
  },
})
class Todos extends Component {
  componentDidMount() {
    const { dispatch, todos } = this.props;
    const {
      filters,
    } = todos;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'todos/fetch',
        payload: filters,
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'todos/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  remove(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'todos/remove',
      payload: id,
    });
  }

  handleCheckboxChange = (id) => {
    const { dispatch, todos } = this.props;
    const {
      filters
    } = todos;
    dispatch({
      type: 'todos/toggle',
      payload: id,
      callback: () => {
        console.log(filters);
        dispatch({
          type: 'todos/fetch',
          payload: filters,
        });
      },
    });
  };

  handleArchiveClick = (id) => {
    const { dispatch, todos } = this.props;
    const {
      filters
    } = todos;
    dispatch({
      type: 'todos/archive',
      payload: id,
      callback: () => {
        dispatch({
          type: 'todos/fetch',
          payload: filters,
        });
      },
    });
  };

  render() {
    const {
      todos,
      loading,
      form,
    } = this.props;
    const {
      getFieldDecorator
    } = form;
    const {
      list,
    } = todos;
    const CardInfo = ({ todo }) => (
      <div className={styles.cardInfo}>
        <div style={{ color: getStatusColor(todo) }}>
          <Icon type="calendar" style={{ color: getStatusColor(todo) }} />
          <p>
            {moment(todo.dueDate).isValid() ? (
              moment(todo.dueDate).fromNow()
            ) : (
                "No due date"
              )}
          </p>
        </div>
      </div>
    );

    return (
      <div className={styles.todos}>
        <Card bordered={false} style={{ marginBottom: 20 }}>
          <Form layout="inline">
            <StandardFormRow title={<Icon type="filter" />} block>
              <FormItem>
                {getFieldDecorator('status')(
                  <TagSelect hideCheckAll>
                    <TagSelect.Option value="done">Done</TagSelect.Option>
                    <TagSelect.Option value="archived">Archived</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
          </Form>
        </Card>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={['', ...list]}
          renderItem={todo =>
            todo ? (
              <List.Item key={todo.id}>
                <Card hoverable className={styles.card} actions={
                  [
                    <Tooltip title="Edit">
                      <Icon type="edit" />
                    </Tooltip>,
                    <Tooltip title="Delete" onClick={() => this.remove(todo.id)}>
                      <Icon type="delete" style={{ color: '#E60000' }} />
                    </Tooltip>,
                    <Dropdown overlay={
                      <Menu>
                        <Menu.Item key="archive" onClick={() => this.handleArchiveClick(todo.id)}>
                          <span>
                            {todo.archived ? 'Unarchive' : 'Archive' }
                          </span>
                        </Menu.Item>
                      </Menu>}>
                      <Icon type="ellipsis" />
                    </Dropdown>,
                  ]}>
                  <Card.Meta
                    avatar={
                      <Checkbox className={styles.checkbox}
                        checked={todo.done}
                        onChange={() => this.handleCheckboxChange(todo.id)}
                      />
                    }
                    title={<a>{todo.title}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={2}>
                        {todo.description}
                      </Ellipsis>
                    }
                  />
                  <div className={styles.cardItemContent}>
                    <CardInfo
                      todo={todo}
                    />
                  </div>
                </Card>
              </List.Item>
            ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> New to-do
                  </Button>
                </List.Item>
              )
          }
        />
      </div>
    );
  }
}

export default Todos;
