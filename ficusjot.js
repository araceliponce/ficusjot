const trashIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"/></svg>`

// PREFIJOS
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const addPrefixButton = document.getElementById('addPrefixButton');
const prefixList = document.getElementById('prefixList');
const prefixInput = document.getElementById('prefixInput');

let prefixesEnLS = JSON.parse(localStorage.getItem('prefixes')) || [];

// Abrir una nueva pestaña con la búsqueda y el prefijo
// Pide permiso la primera vez
function searchWithPrefix() {
  const ulElement = document.getElementById('prefixList');
  const lis = Array.from(ulElement.getElementsByTagName('li'));
  const prefixes = lis.map(li => li.textContent).join(' ');

  const query = prefixes ? `${prefixes} ${searchInput.value}` : searchInput.value;
  const encodedQuery = encodeURIComponent(query);
  window.open(`https://www.google.com/search?q=${encodedQuery}`);
}

// Añadir prefijo a la lista y almacenar en el localStorage
function addPrefix() {
  const prefix = prefixInput.value.trim();

  if (prefix !== '') {
    const li = document.createElement('li');
    li.textContent = prefix;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = trashIcon;
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', function () {
      deletePrefix(prefix);
      prefixList.removeChild(li);
    });

    li.appendChild(deleteButton);
    prefixList.insertAdjacentElement('afterbegin', li)

    prefixInput.value = '';
    prefixesEnLS.push(prefix);
    localStorage.setItem('prefixes', JSON.stringify(prefixesEnLS));

    searchInput.focus();
  }
}

// Elimina prefijo de la lista y del LS
function deletePrefix(prefix) {
  const index = prefixesEnLS.indexOf(prefix);
  if (index > -1) {
    prefixesEnLS.splice(index, 1);
    localStorage.setItem('prefixes', JSON.stringify(prefixesEnLS));
  }
}

// Busca al presionar Enter o al hacer clic en el botón de búsqueda
searchButton.addEventListener('click', searchWithPrefix);
searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchWithPrefix();
  }
});

// Añade un prefijo al presionar el botón o la tecla Enter
addPrefixButton.addEventListener('click', addPrefix);
prefixInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    addPrefix();
  }
});

// Cargar los prefijos si hay en el LS
window.addEventListener('load', function () {
  const isDesktop = window.innerWidth > 768;
  if (isDesktop) {
    searchInput.focus();
  }

  if (prefixesEnLS.length > 0) {
    prefixesEnLS.forEach(prefix => {
      const li = document.createElement('li');
      li.textContent = prefix;

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = trashIcon;
      deleteButton.classList.add('deleteButton');
      deleteButton.addEventListener('click', function () {
        deletePrefix(prefix);
        prefixList.removeChild(li);
      });

      li.appendChild(deleteButton);
      prefixList.insertAdjacentElement('afterbegin', li)
    });
  } else {
    console.log('no hay prefijos guardados');
  }
});


// COLORES
const boxes = document.querySelectorAll('.color');

boxes.forEach(box => {
  box.addEventListener('click', () => {
    const bg = box.classList[1];
    document.body.className = bg;
    localStorage.setItem('bodyBgClass', bg);
  });
});

document.querySelector('#coloris').addEventListener('click', e => {
  Coloris({
    alpha: true,
    swatches: [
      '#264653',
      '#2a9d8f',
      '#e9c46a',
      'rgb(244,162,97)',
      '#e76f51',
      '#d62828',
      'navy',
      '#07b',
      '#0096c7',
      '#00b4d880',
      'rgba(0,119,182,0.8)'
    ],
    onChange: (color) => {
      document.body.style.setProperty("--custom-color", color);
      document.body.className = 'custom';
      localStorage.setItem('bodyBgClass', 'custom');
      localStorage.setItem('savedColoris', color);
    },
  });
});
//estilos inline tienen una prioridad mayor que body.style.backgroundColor = color
//es mejor usar un custom properties




// COPYABLE TEXTS
const copyableTexts = document.getElementById('copyable-texts');
// console.log(copyableTexts)
const texts = copyableTexts.querySelectorAll('.text');
const inputField = document.querySelector('#input-field');

const addBtn = document.getElementById('add-button');
const newTextInput = addBtn.nextElementSibling.querySelector('input');
const saveBtn = document.getElementById('save-button');



copyableTexts.addEventListener('click', function (event) {
  // Verificar si el elemento clickeado es de clase .text
  if (event.target.classList.contains('text')) {
    // Copiar el contenido del elemento clickeado al portapapeles
    const textToCopy = event.target.textContent;
    navigator.clipboard.writeText(textToCopy);

    // Mostrar un toast
    Toastify({
      text: 'texto copiado',
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      className: "toastv2"
    }).showToast();
  }
});




// Agregar texto nuevo
addBtn.addEventListener('click', () => {

  addBtn.classList.add('hidden');
  addBtn.nextElementSibling.style.display = 'flex';

  // newTextInput = addBtn.nextElementSibling.querySelector('input');
  newTextInput.focus();
  newTextInput.value = '';

});


// Guardar cambios en enter y al presionar el boton

newTextInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    newTextInput.removeEventListener('keyup', handleKeyPress);
    saveChanges();
  }
});


saveBtn.addEventListener('click', () => {
  saveChanges();
});




function handleKeyPress(event) {
  if (event.key === 'Enter') {
    saveChanges();
    newTextInput.removeEventListener('keyup', handleKeyPress); // Eliminar el event listener después de guardar
  }
}

//creamos: li.text y un boton (textItem y textTrashButton)
function saveChanges() {
  const newTextInputValue = newTextInput.value;

  if (newTextInputValue) {

    createTextItem(newTextInputValue);

    //para ocultar y mostrar el bloque hermano
    addBtn.nextElementSibling.style.display = 'none';
    addBtn.classList.remove('hidden');

    //scroll hasta el ultimo item del ul
    copyableTexts.lastChild.scrollIntoView({ behavior: 'smooth' })

  }
}


// Obtener la cadena JSON de los textos guardados
const savedTextsOnLS = localStorage.getItem('savedTexts');

// Verificar si hay textos guardados y convertir la cadena JSON a un array
let jsonTextsOnLs = [];
if (savedTextsOnLS) {
  copyableTexts.innerHTML = '';
  jsonTextsOnLs = JSON.parse(savedTextsOnLS);
} else {
  console.log('no hay textos guardados')
}

jsonTextsOnLs.forEach(savedText => {
  createTextItem(savedText)
});



// Crear los elementos de clase .text y agregarlos al contenedor correspondiente
function createTextItem(text) {
  const textItem = document.createElement('li');
  const textTrashButton = document.createElement('button');
  textTrashButton.innerHTML = trashIcon;
  console.log(textTrashButton.innerHTML)

  textItem.classList.add('text');

  //el orden sí afecta, primero añade el texto y luego el boton
  textItem.textContent = text;
  textItem.appendChild(textTrashButton);


  copyableTexts.insertAdjacentElement('beforeend', textItem);


  guardarTextosEnLS();


  //Borrar li.text al hacer clic en boton
  textTrashButton.addEventListener('click', () => {
    textItem.remove();
    guardarTextosEnLS();
  });


}



function guardarTextosEnLS() {
  //Guardamos en LS llenando un array vacio, cada texto de cada li.text
  let textsForLS = [];
  const texts = copyableTexts.querySelectorAll('.text');
  for (let i = 0; i < texts.length; i++) {
    textsForLS.push(texts[i].textContent);
  }
  localStorage.setItem('savedTexts', JSON.stringify(textsForLS));
}