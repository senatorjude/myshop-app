let db = new Dexie('ShoppingApp')
db.version(1).stores({ items: '++id, ItemName,price,quantity,isPurchased' })

let form = document.querySelector('.form')
let allItems = document.querySelector('.items')
// let itemsFromDataBase = await db.items.toArray()

let displayItemsFunction = async () => {
    let itemsFromDataBase = await db.items.toArray()
     
    allItems.innerHTML = itemsFromDataBase.map  ( item =>
    `<div class="item-container">

    <div class="pcont ${item.isPurchased ?'isPurChased':""}">

    <div>
       <input type="checkbox" class="checkbox" onchange="toggle(event,${item.id})">
     </div>

    <div>
       <p class="item-name">${item.itemName}</p>
       <p class="total-single-price">$${item.price} x ${item.quantity}</p>
    =</div>

    <div class="btn-con">
       <button class="cancel" onclick="deleteAndAlerts(${item.id})">X</button>
       <button class="edit-btn" onclick="editItem(event, ${item.id}, '${item.itemName}', ${item.price}, ${item.quantity})">Edit</button>
    </div>
    </div>

    

    
    
    </div>
    `).join('') 



    let totalItem = itemsFromDataBase.map((item) => {
        return item.price * item.quantity
      })
  
      let allTotal = totalItem.reduce( (a,b) => a + b,0)

      document.querySelector('.total').innerHTML ="Total Price: $" + allTotal

      

}


let editItem = async (event,itemId,name,itemPrice,itemQuantity) => {
  
    let edit = document.querySelector('.formToEdit')
    let editForm = document.querySelector('.edit-form-container')
    let editName = document.querySelector('.edit-item-name')
    let editItemPrice = document.querySelector('.edit-item-price')
    let editItemQuantity = document.querySelector('.edit-item-quantity')
    let cancelButton = document.querySelector('.cancel-edit')



    event.target.setAttribute('id', itemId)

    if(event.target.id == itemId){
        editForm.style.display = "block"

        editName.value = name
        editItemPrice.value = itemPrice
        editItemQuantity.value = itemQuantity
        
  
        await displayItemsFunction()
        // console.log(db)
    

    }


    cancelButton.addEventListener('click', () => {
        editForm.style.display = 'none'
    })
   
    edit.addEventListener('submit', async (e) => {
        e.preventDefault()



       await db.items.update(itemId, 
        {itemName: editName.value,
        price:editItemPrice.value,
        quantity:editItemQuantity.value
        })
       edit.reset()


       await displayItemsFunction()

       editForm.style.display = 'none'

       

    })

    // await displayItemsFunction()
}
 
let deleteAndAlerts = async (id) => {
    let cont = document.querySelector('.delete-all-alert')

         cont.innerHTML = `<div class="delete-item">
                <h2 class="headerx" style="color:red">X</h2>
                <p>Are you sure you want to delete this item?</p>
                <button class="yesBtn" onclick="deleteItem(${id})">Yes</button>
                <button class="no-btn" onclick="hideClear()">No</button>
            </div>
    `
    cont.style.display = 'block'


    await displayItemsFunction()

}


    let clearAlItems = async() => {
        let cont = document.querySelector('.delete-all-alert')
        cont.style.display = 'block'
    
             cont.innerHTML = `<div class="delete-item">
                    <h2 class="headerx" style="color:red">X</h2>
                    <p>Are you sure you want to clear all items?</p>
                    <button class="yesBtn" onclick="clearNow()">Yes</button>
                    <button class="no-btn" onclick="hideClear()">No</button>
                </div>
        `
        // await db.items.clear()
        await displayItemsFunction()
    } 
    let clearNow = async () => {
        await db.items.clear()
        document.querySelector('.delete-all-alert').style.display = 'none'
        await displayItemsFunction()
    }

    let clearAll = document.querySelector('.clear-all').onclick = clearAlItems
    let hideClear = () => {
       document.querySelector('.delete-all-alert').style.display = "none"

    }


window.onload = displayItemsFunction

let toggle = async (event, id) => {
     await db.items.update(id, {isPurchased: !!event.target.checked})
     
     await displayItemsFunction()
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()


    let name = document.querySelector('.item-name').value
    let price = document.querySelector('.item-price').value
    let quantity = document.querySelector('.item-quantity').value

    

    await db.items.add({ itemName: name, price: price, quantity: quantity })

    await displayItemsFunction()


})


function hideAndCloseItem(){
    let showButton = document.querySelector('.display-items')
    let hideButton = document.querySelector('.hide-items')
    let formCont = document.querySelector('.item-form')
    let totalItem = document.querySelector('.total-price')

    showButton.addEventListener('click', () => {
        allItems.style.display = 'block'
        showButton.style.display ='none'
        totalItem.style.display = 'block'
        hideButton.style.display = 'block'
        formCont.style.display = 'none'

    })

    hideButton.addEventListener('click', () => {
        allItems.style.display = 'none'
        showButton.style.display = 'block'
        totalItem.style.display = 'none'
        hideButton.style.display = 'none'
        formCont.style.display = 'block'
    })

    

}
hideAndCloseItem()


let deleteItem = async (id) => {
    await db.items.delete(id)
    document.querySelector('.delete-all-alert').style.display = 'none'
   await displayItemsFunction()

}
