let myList
let listName

function createAppTitle(title) {
  let appTitle = document.createElement('h2')
  appTitle.innerHTML = title
  return appTitle
}

function createTodoItemForm() {
  let form = document.createElement('form')
  let input = document.createElement('input')
  let buttonWrapper = document.createElement('div')
  let button = document.createElement('button')

  form.classList.add('input-group', 'mb-3')
  input.classList.add('form-control')
  input.placeholder = 'Введите название нового дела'
  buttonWrapper.classList.add('input-group-append')
  button.classList.add('btn', 'btn-primary')
  button.textContent = 'Добавить дело'
  button.disabled = true

  let disableButton = function() {
    if (input.value.length > 0) {
      button.disabled = false
    } else {
      button.disabled = true
    }
  }

  input.addEventListener('input', disableButton)

  buttonWrapper.append(button)
  form.append(input)
  form.append(buttonWrapper)

  return {
    form,
    input,
    button,
    disableButton
  }
}

function createTodoList() {
  let list = document.createElement('ul')
  list.classList.add('list-group')
  return list
}

function createTodoItem(name) {
  let item = document.createElement('li')
  let buttonGroup = document.createElement('div')
  let doneButton = document.createElement('button')
  let deleteButton = document.createElement('button')

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
  item.textContent = name

  buttonGroup.classList.add('btn-group', 'btn-group-sm')
  doneButton.classList.add('btn', 'btn-success')
  doneButton.textContent = 'Готово'
  deleteButton.classList.add('btn', 'btn-danger')
  deleteButton.textContent = 'Удалить'

  buttonGroup.append(doneButton)
  buttonGroup.append(deleteButton)
  item.append(buttonGroup)

  return {
    item,
    doneButton,
    deleteButton
  }
}

function createTodoApp(container, title = 'Список дел', array, listArrayName) {
  let todoAppTitle = createAppTitle(title)
  let todoItemForm = createTodoItemForm()
  let todoList = createTodoList()

  myList = array

  listName = listArrayName

  let localStorageData = localStorage.getItem(listName)

  if (localStorageData) {
    myList = JSON.parse(localStorageData)
  }

  saveList()

  for (let i of myList){
    let todoItem = createTodoItem(i.name)

    todoItem.item.id = i.id

    if(i.done == true) {
      todoItem.item.classList.add('list-group-item-success')
    } else {
      todoItem.item.classList.remove('list-group-item-success')
    }

    todoItem.doneButton.addEventListener('click', function(){
      todoItem.item.classList.toggle('list-group-item-success')

      let pos = myList.findIndex(i => i.id == todoItem.item.id);

      if (todoItem.item.classList.contains('list-group-item-success')) {
        myList[pos].done = true
      } else {
        myList[pos].done = false
      }

      saveList()

    })
    todoItem.deleteButton.addEventListener('click', function(){
      if (confirm('Вы уверены,')) {
        todoItem.item.remove()
        let pos = myList.findIndex(i => i.id == todoItem.item.id);
        myList.splice([pos], 1)
        saveList()
      }
    })
    todoList.append(todoItem.item)
  }

  container.append(todoAppTitle)
  container.append(todoItemForm.form)
  container.append(todoList)

  todoItemForm.form.addEventListener('submit', function(e){
    e.preventDefault()
    let todoItem = createTodoItem(todoItemForm.input.value)

    if(!todoItemForm.input.value) {
      return
    }

    todoItem.doneButton.addEventListener('click', function (){
      todoItem.item.classList.toggle('list-group-item-success')

      let pos = myList.findIndex(i => i.id == todoItem.item.id);

      if (todoItem.item.classList.contains('list-group-item-success')) {
        myList[pos].done = true
      } else {
        myList[pos].done = false
      }

      saveList()

    })
    todoItem.deleteButton.addEventListener('click', function(){
      if (confirm('Вы уверены,')) {
        todoItem.item.remove()
        let pos = myList.findIndex(i => i.id == todoItem.item.id);
        myList.splice([pos], 1)
        saveList()
      }
    })
    let newID = createID(myList)
    myList.push({
      id: newID,
      name: todoItemForm.input.value,
      done: false
    })
    saveList()

    todoItem.item.id = newID

    todoList.append(todoItem.item)
    todoItemForm.input.value = ''
    todoItemForm.disableButton()
  })

  function createID(myList) {
    let maxID = 0

    for (const item of myList) {
      if (item.id > maxID) maxID = item.id
    }
    return maxID + 1
  }
}

function saveList(){
  localStorage.setItem(listName, JSON.stringify(myList))
}
