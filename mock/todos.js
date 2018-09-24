import moment from 'moment';
import { parse } from 'url';

let todos = [{
  id: '000000001',
  title: 'Make an awsome project',
  description: 'Donec dictum ipsum ante, quis dignissim felis tempus eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  dueDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
  done: true,
  archived: false,
},
{
  id: '000000002',
  title: 'Take some time to rest',
  description: 'Proin eget vulputate dui. Sed non consequat eros, in semper diam.',
  dueDate: moment().add(2, 'hours').format('YYYY-MM-DD'),
  done: false,
  archived: false,
},
{
  id: '000000003',
  title: 'Read the news about technology',
  description: 'Pellentesque a tellus mi. Cras et vestibulum mi.',
  dueDate: null,
  done: false,
  archived: false,
},
{
  id: '000000004',
  title: 'Analyze Z app heap usage',
  description: 'Nullam non imperdiet augue. Quisque gravida erat in ex lacinia, sit amet volutpat est convallis. Integer quis augue consequat, cursus odio ut, suscipit dui.',
  dueDate: null,
  done: false,
  archived: true,
},
{
  id: '000000005',
  title: 'Update X app docs',
  description: 'Aliquam erat volutpat. Cras commodo pellentesque felis at consequat.',
  dueDate: null,
  done: false,
  archived: false,
},
];

function getTodos(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = todos;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.done) {
    dataSource = dataSource.filter(data => {
      return data.done === (params.done === 'true');
    })
  }

  if (params.archived) {
    dataSource = dataSource.filter(data => {
      return data.archived === (params.archived === 'true');
    })
  }

  if (params.title) {
    dataSource = dataSource.filter(data => data.title.indexOf(params.title) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postTodo(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {
    method,
    title,
    description,
    dueDate,
    done,
    id
  } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      todos = todos.filter(item => id.indexOf(item.id) === -1);
      break;
    case 'update':
      todos = todos.map(item => {
        if (item.id === id) {
          Object.assign(item, {
            title,
            description,
            dueDate,
            done,
          });
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    error: false,
    pagination: {
      total: todos.length,
    },
  };

  return res.json(result);
}

function deleteTodo(req, res) {
  todos = todos.filter(item => req.params.id.indexOf(item.id) === -1);

  const result = {
    error: false,
    message: "Successfully deleted to-do"
  };

  return res.json(result);
}

function toggleTodo(req, res) {
  todos = todos.map(todo => {
    if (todo.id === req.params.id) {
      Object.assign(todo, {
        done: !todo.done,
      });
    }
    return todo;
  });

  const result = {
    error: false,
    message: "Succesfully toggled to-do"
  };

  return res.json(result);
}

function archiveTodo(req, res) {
  todos = todos.map(todo => {
    if (todo.id === req.params.id) {
      Object.assign(todo, {
        archived: !todo.archived,
      });
    }
    return todo;
  });

  const result = {
    error: false,
    message: "Successfully archived to-do"
  };

  return res.json(result);
}

export default {
  'GET /api/todos': getTodos,
  'DELETE /api/todo/:id': deleteTodo,
  'GET /api/todo/:id/toggle': toggleTodo,
  'GET /api/todo/:id/archive': archiveTodo,
};
