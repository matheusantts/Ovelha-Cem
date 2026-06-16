let btnNext = document.querySelector('.netx');
let btnBack = document.querySelector('.back');

let conteiner = document.querySelector('.conteiner');
let list = document.querySelector('.conteiner .list');
let tumb = document.querySelector('.conteiner .tumb');

btnNext.onclick = () => moveItemsOnClick('next');
btnBack.onclick = () => moveItemsOnClick('back');

function moveItemsOnClick(type) {
    let listItems = document.querySelectorAll('.list .list-item');
    let tumbItems = document.querySelectorAll('.tumb .tumb-item')

    if (type === 'next') {
        list.appendChild(listItems[0])
        tumb.appendChild(tumbItems[0])
        conteiner.classList.add('next')
    } else {
        list.prepend(listItems[listItems.length -1])
        tumb.prepend(tumbItems[tumbItems.length -1])
        conteiner.classList.add('back')
    }

    setTimeout(() => {
        conteiner.classList.remove('next')
        conteiner.classList.remove('back')
    }, 3000);
}