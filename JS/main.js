
class Show {
    constructor(id, date, city, stadium, tax, price, quantity) {
        this.id = id;
        this.date = date;
        this.city = city;
        this.stadium = stadium;
        this.tax = tax;
        this.price = price;
        this.quantity = quantity || 1;
    }
    addTickets() {
        this.quantity++;
    }
    deleteTickets() {
        this.quantity--;
    }
}
const shows = [];

fetch('JSON/concerts.json')
    .then(response => response.json())
    .then((data) => {
        console.log(data);

        for(const show of data){
            shows.push(new Show(show.id, show.date, show.city, show.stadium, show.tax, show.price, show.quantity));
        }
        console.log(shows);
        showsUI();
        

    })
    .catch((error) => {console.log(error);})

item1 = document.getElementById('item1');
item2 = document.getElementById('item2');
item3 = document.getElementById('item3');
item4 = document.getElementById('item4');

let btnSelection = document.getElementsByClassName("btnSelection");
//console.log(btnBuy);

let concerts = document.getElementById('concerts');
//console.log(concerts);

let buy = document.getElementById('buy');

let btnClear = document.getElementById('btnClear');

function showsUI() {

    for (const show of shows) {
        let li = document.createElement("li");
        li.innerHTML = `${show.date}`;
        item1.appendChild(li);
    }

    for (const show of shows) {
        let li = document.createElement("li");
        li.innerHTML = `${show.city}`;
        item2.appendChild(li);
    }

    for (const show of shows) {
        let li = document.createElement("li");
        li.innerHTML = `${(show.stadium)}`
        item3.appendChild(li);
    }

    for (const show of shows) {
        let li = document.createElement("li");
        li.innerHTML = `<button id='${show.id}' class="btnSelection btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">ON SALE</button>`;
        item4.appendChild(li);
    }
    btnDisplay();

}
        const buyShows = [];
        const shopCart = [];

        //comprueba local storage y carga los elementos de haberlos en el carro de compras
        if ("Tickets" in localStorage) {
            const savedPurchases = JSON.parse(localStorage.getItem('Tickets'));
            for (const ite of savedPurchases) {
                shopCart.push(new Show(ite.id, ite.date, ite.city, ite.stadium, ite.tax, ite.price, ite.quantity));
            }
            mostrarComprasRealizadas(shopCart);
        }

function btnDisplay(){
    for (const btn of btnSelection) {
        btn.addEventListener('click', function () {
            //  console.log(this.id);
            purchase = shows.find(show => show.id == this.id);
            concerts.innerHTML = `${(purchase.date)} ${purchase.city}
            <hr>
            <img src="img/iron-maiden_the-book-of-souls-live-chapter.jpg">
            TICKETS $ ${purchase.price} + TAX (${purchase.tax * 100}%) ${purchase.price * purchase.tax}
            <button id='${purchase.id}' class="btnBuy btn btn-info">BUY</button>`        
            mostrarMenuCompra();
            deleteMenuCompra();
        })
    }
}

function mostrarMenuCompra() {
    let btnBuy = document.getElementsByClassName('btnBuy');
    for (const btn of btnBuy) {
        btn.addEventListener('click', function () {
            let select = shopCart.find(show => show.id == this.id);
            if (select) {
                select.addTickets();
                localStorage.setItem('Tickets', JSON.stringify(shopCart));
            } else {
                select = shows.find(show => show.id == this.id);
                shopCart.push(select);
                localStorage.setItem('Tickets', JSON.stringify(shopCart));
            }
            mostrarComprasRealizadas(shopCart);
            Toastify({
                text: `Added: ${select.city} Total Tickets: ${select.quantity}`,
                duration: 2000,
                gravity: "top"
            }).showToast();
        })
    }
}

function deleteMenuCompra() {
    let btnDelete = document.getElementsByClassName('btnDelete');
    for (const btn of btnDelete) {
        btn.addEventListener('click', function () {
            let select = shopCart.find(show => show.id == this.id);
            if (select && select.quantity > 1) {
                select.deleteTickets();
                localStorage.setItem('Tickets', JSON.stringify(shopCart));
            } else if (select && select.quantity == 1) {
                shopCart.splice(shopCart.indexOf(select), 1);
                localStorage.setItem('Tickets', JSON.stringify(shopCart));
            }
            mostrarComprasRealizadas(shopCart);
            select && (
                Toastify({
                    text: `Deleted: ${select.city} Deleted Tickets: 1   `,
                    duration: 2000,
                    gravity: "bottom"
                }).showToast()
            )
        })
    }
}

function addShow() {
    let event = shopCart.find(show => show.id == this.id);
    event.addTickets();
    localStorage.setItem('Tickets', JSON.stringify(shopCart));
    mostrarComprasRealizadas(shopCart);
    Toastify({
        text: `Added: ${event.city} Total Tickets: ${event.quantity}`,
        duration: 2000,
        gravity: "top"
    }).showToast();
}

function delShow(){
    let event = shopCart.find(show => show.id == this.id);
    shopCart.splice(shopCart.indexOf(event), 1);
    localStorage.setItem('Tickets', JSON.stringify(shopCart));
    mostrarComprasRealizadas(shopCart);
    Toastify({
        text: `Deleted: ${event.city} Deleted Tickets: ${event.quantity}`,
        duration: 2000,
        gravity: "bottom"
    }).showToast()
    event.quantity=1;
}

function subShow() {
    let event = shopCart.find(show => show.id == this.id);
    if (event.quantity > 1) {
        event.deleteTickets();
        localStorage.setItem('Tickets', JSON.stringify(shopCart));
    }else if(event.quantity == 1){
        shopCart.splice(shopCart.indexOf(event), 1);
        localStorage.setItem('Tickets', JSON.stringify(shopCart));
    }
    mostrarComprasRealizadas(shopCart);
    Toastify({
        text: `Deleted: ${event.city} Deleted Tickets: 1   `,
        duration: 2000,
        gravity: "bottom"
    }).showToast()
}

btnClear.onclick = () => {
    localStorage.clear();
    shopCart.splice(0, shopCart.length);
    document.location.reload(); 
    mostrarComprasRealizadas(shopCart);
}


function mostrarComprasRealizadas(list) {
    let selectedShows = document.getElementById('selectedShows');
    selectedShows.innerHTML = "";
    for (const ite of list) {
        let l0 = document.createElement('p');
        l0.innerHTML = `${ite.quantity} tickets on ${ite.date} in ${ite.city} Total $${ite.quantity * ite.price} + taxes ${((ite.quantity * ite.price) * ite.tax).toFixed(2)}
        <a id="${ite.id}" class="btn btn-info btn-add">+</a>
        <a id="${ite.id}" class="btn btn-info btn-sub">-</a>
        <a id="${ite.id}" class="btn btn-info btn-del">X</a>`;
        selectedShows.appendChild(l0);
    }
    document.querySelectorAll('.btn-add').forEach(boton => boton.onclick = addShow);
    document.querySelectorAll('.btn-sub').forEach(boton => boton.onclick = subShow);
    document.querySelectorAll('.btn-del').forEach(boton => boton.onclick = delShow);
    const total = shopCart.reduce((acc, el) => acc + parseInt(el.price) * parseInt(el.quantity) + (parseInt(el.price) * parseInt(el.quantity)) * el.tax, 0);
   
    let l1 = document.createElement('p');
    total > 0 && (
        l1.innerHTML = `TOTAL (taxes included) ${total.toFixed(2)}`,
        selectedShows.appendChild(l1)
    )
}

buy.onclick = () => {
    shopCart.length > 0 && (
        localStorage.clear(),
        shopCart.splice(0, shopCart.length),
        mostrarComprasRealizadas(shopCart),
        Swal.fire(
            'Tickets bought',
            'Enjoy the show',
            'success'
        )
    )
}


