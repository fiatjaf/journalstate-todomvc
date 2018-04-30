/* global nunjucks */

const debounce = require('debounce')
const {compute, StateError} = require('journalstate')

const render = debounce(function () {
  error.innerHTML = ''
  try {
    let state = compute({
      init: () => ({
        todos: [],
        todos_left: 0
      }),
      reducers,
      journal: journal.value
    })

    viewBody.innerHTML = template.render(state)
  } catch (e) {
    console.error(e)
    error.innerHTML = e.message
  }
}, 500)

const template = nunjucks.compile(document.getElementById('template').innerHTML)

const view = document.getElementById('view').attachShadow({mode: 'open'})
view.innerHTML = `
  <link rel="stylesheet" href="https://cdn.rawgit.com/tastejs/todomvc-common/3b6156d9/base.css">
  <link rel="stylesheet" href="https://cdn.rawgit.com/tastejs/todomvc-app-css/22ef1be7/index.css">
`
var viewBody = document.createElement('body')
view.appendChild(viewBody)
const error = document.getElementById('error')
const journal = document.getElementById('journal').querySelector('textarea')

var today = new Date()
var defaultJournal = `${today.toISOString().split('T')[0]}
todo: Buy an ice cream
todo: Give the ice cream to my brother

`
today.setDate(today.getDate() + 1)
defaultJournal += `${today.toISOString().split('T')[0]}
done: Buy an ice cream
rename: from=Give the ice cream to my brother, to=Eat the ice cream
done: Eat the ice cream
todo: Wash my hands
`

journal.value = localStorage.getItem('journal') || defaultJournal

render()
journal.addEventListener('input', render)
journal.addEventListener('input', e => {
  localStorage.setItem('journal', e.target.value)
})

const reducers = {
  todo (state, fact) {
    let [name] = fact.args
    state.todos.push({name, completed: false})
    state.todos_left += 1
  },

  done (state, fact) {
    let [name] = fact.args

    var found = false
    state.todos.forEach(todo => {
      if (todo.name === name) {
        todo.completed = true
        state.todos_left -= 1
        found = true
      }
    })

    if (!found) {
      throw StateError(`There isn't a todo named '${name}' to be marked as completed.`)
    }
  },

  remove (state, fact) {
    let [name] = fact.args

    var found = false
    for (let i = state.todos.length - 1; i >= 0; i--) {
      let todo = state.todos[i]
      if (todo.name === name) {
        state.todos.splice(i, 1)
        found = true

        if (!todo.completed) {
          state.todos_left -= 1
        }
      }
    }

    if (!found) {
      throw StateError(`There isn't a todo named '${name}' to be removed.`)
    }
  },

  rename (state, fact) {
    let {from, to} = fact.kwargs

    var found = false
    state.todos.forEach(todo => {
      if (todo.name === from) {
        todo.name = to
        found = true
      }
    })

    if (!found) {
      throw StateError(`There isn't a todo named '${from}' to be renamed.`)
    }
  }
}
