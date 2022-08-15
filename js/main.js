let app =document.querySelector('.app'),
toggle = document.querySelector('.toggle'),
add = document.querySelector('.addBox .add'),
input = document.querySelector('.addBox input'),
tasks = document.querySelector('.tasks'),
leftItemscount = document.querySelector('#leftItems #num'),
allTasks= document.querySelector('#allTasks'),
activeTasks= document.querySelector('#activeTasks'),
completedTasks= document.querySelector('#completedTasks'),
clearTasks= document.querySelector('#clearTasks'),
mes= document.querySelector('#mes'),
nav = document.querySelector('.notation');

// Tasks List
let list = [];
if (localStorage.getItem('tasks')) {
  list = JSON.parse(localStorage.getItem('tasks'));
}


// Dark-light theme
let theme = localStorage.getItem('theme');

if (theme) {
  document.body.className= theme;
}

function changeLight(list) {
  for(let i of list) {
    if (i.classList.contains('show')) {
      i.classList.remove('show');
      i.classList.add('hidden');
    }else {
      i.classList.add('show');
      i.classList.remove('hidden');
    }
  }
}
function dark() {
  localStorage.setItem('theme', 'dark');
  document.body.className= '';
  document.body.classList.add('dark');
}
function light() {
  localStorage.setItem('theme', 'light');
  document.body.className= '';
  document.body.classList.add('light');
}

// Done




window.onload = () => {
  input.focus();
  gsap.to(toggle, {duration: 1, rotation: 360});
}
add.addEventListener('click', () => {
  if (input.value != '') {
    createData(input.value);
    input.value= '';
  }
});


function createData(value) {
  let ob = {
    id: Date.now(),
    txt: value,
    completed: false,
  }

  list.push(ob);
  createElements(list);
  setData(list);
}


function createElements(arr) {
  tasks.innerHTML= '';
  mes.innerHTML= '';
  arr.forEach(ob => {
    // parent Element
    let div = document.createElement('div');
    div.className= 'task';
    div.setAttribute('draggable', true);
    // check box
    let check = document.createElement('div');
    check.className= 'check';
    let radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.id = ob.id;
    if (ob.completed) {
      radio.checked = true;
      div.dataset.status= 'done';
    }
    let label = document.createElement('label');
    label.setAttribute('for', ob.id);
    // Task
    let p = document.createElement('p');
    p.className= 'txt';
    p.innerHTML= ob.txt;
    // delete button
    let Dbtn = document.createElement('img');
    Dbtn.className= 'delete';
    Dbtn.src= '../src/assets/images/icon-cross.svg';
    Dbtn.setAttribute('alt', '');
    // append
    check.append(radio, label);
    div.append(check, p, Dbtn);
    tasks.append(div);
  });
  apply(tasks.querySelectorAll('.task'));
}


function setData(arr) {
  let str = JSON.stringify(arr);
  localStorage.setItem('tasks', str);
  itemsLeft();
}


function getDate() {
  let str = localStorage.getItem('tasks');
  if (str) {
    let arr = JSON.parse(str);
    createElements(arr);
  }
}


// delete Task
function tasKill(node) {
  node.remove();
  deleteFromLocal(node.querySelector('input').id);
}
// Delete from local Storage an update data
function deleteFromLocal(id) {
  let arr1 = JSON.parse(localStorage.getItem('tasks'));
  list = arr1.filter(x => x.id != id);
  setData(list);
}


function makeItDon() {
  tasks.addEventListener('click', (e) => {
    if (e.target.nodeName == 'LABEL') {
      let id = e.target.getAttribute('for');
      list.filter(x => x.id == id)[0].completed = true;
      setData(list);
      createElements(list);
    }
  })
}


// Foot part
function itemsLeft() {
  leftItemscount.innerHTML= 0;
  let arr = JSON.parse(localStorage.getItem('tasks'));
  if (arr) {
    let count = arr.filter(x => x.completed == false).length;
    leftItemscount.innerHTML= count;
  }
}

function all() {
  let arr = JSON.parse(localStorage.getItem('tasks'));
  createElements(arr);
}

function active() {
  let arr = JSON.parse(localStorage.getItem('tasks')).filter(x => x.completed == false);
  createElements(arr);
}

function completed() {
  let arr = JSON.parse(localStorage.getItem('tasks')).filter(x => x.completed == true);
  createElements(arr);
  this.onclick = (e) => {
    if (e.target == this && arr.length == 0) {
      mes.innerHTML= 'There is no completed Items';
    }else {
      mes.innerHTML='';
    }
  }
}

function clearComplete() {
  let arr = JSON.parse(localStorage.getItem('tasks')).filter(x => x.completed == false);
  list = arr;
  setData(list);
  createElements(arr);
}
// done


//-Start- Drag and Drop 
function dragStart(e) {
  this.style.opacity= 0.4;

  srcEle = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function dragOver(e) {
  e.preventDefault();
  return false;
}

function dragEnter(_) { 
  this.classList.add('over');
}

function dragLeave(_) {
  this.classList.remove('over');
}

function drop(e) {
  e.stopPropagation();

  if (srcEle !== this) {
    srcEle.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}

function dragEnd(_) {
  this.style.opacity= 1;
  let eles = tasks.querySelectorAll('.tasks .task');
  eles.forEach(item => {
    item.classList.remove('over');
  })
  updateOrdring(eles);
}


function apply(items) {
  items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragleave', dragLeave);
    item.addEventListener('dragend', dragEnd);
    item.addEventListener('drop', drop);
  });
};

function updateOrdring(nodes) {
  let a = [];
  nodes.forEach(node => {
    a.push(node.querySelector('input').id);
  });

  let b = []
  let old = JSON.parse(localStorage.getItem('tasks'));
  for (let i in old) {
    b.push(old[i].id)
  }

  let z = []
  for (let i =0; i < old.length;i++) {
    for (let x in old) {
      if (a[i] == old[x].id) {
        z.push(old[x])
      }
    }
  }

  let orded = [...a, ...b].reduce((x, y) => x == y);
  if (!orded) {
    list = z;
    setData(list);
  }
}
//-End- Drag and Drop





// Dark-light theme
toggle.addEventListener('click', (e) => {
  theme = localStorage.getItem('theme');
  if (e.target.nodeName = 'SVG') {
    if (theme == 'light') {
      dark();
    }else {
      light();
    }
  }

  changeLight(toggle.children);
});

// Delete
tasks.onclick = (e) => {
  if (e.target.classList.contains('delete')) {
    tasKill(e.target.parentElement);
  }
}
getDate();
makeItDon();
itemsLeft();
allTasks.addEventListener('click', all);
activeTasks.addEventListener('click', active);
completedTasks.addEventListener('click', completed);
clearTasks.addEventListener('click', clearComplete);







// movable part
let x = window.matchMedia('(max-width: 767px)');
checkMedia(x);
function checkMedia(pra) {
  if(pra.matches) {
    let newParent = document.querySelector('.body');
    newParent.append(nav);
    nav.className='notation';
  }else {
    let oldFriend = document.querySelector('.foot #leftItems');
    oldFriend.after(nav);
    nav.className='';
  }
}
x.addEventListener('change', checkMedia);