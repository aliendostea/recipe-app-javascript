import uniqid from "uniqid";

export default class List{
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(element => element.id === id);
        ///[2,4,8] splice(1,1) --> return 4, original array is [2,8] /// devuelve el 4 del array original quitandolo de ese array // splice(1,2) las entradas (1,2) significa cuantos elementos tiene que retornar
        ///[2,4,8] slice(1,2) --> return 4, original array is [2,4,8] /// devuelve el 4 sin modificar el array original /// las entradas slice(1,3) significa de donde tiene empezar (1) y de donde termina (3)
        /// se le pasa el index (posicion) del elemento especifico para eliminar
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(element => element.id === id).count = newCount;
    }

}
