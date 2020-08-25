import { elements } from "../views/base";

export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLikes(id, title, autor, img) {
        const like = {id, title, autor, img};
        this.likes.push(like);

        /// persist data in localstorage
        this.persistData();

        return like;
    }

    deleteLikes(id) {
        const index = this.likes.findIndex(element => element.id === id);
        /// se le pasa el index (posicion) del elemento especifico para eliminar
        this.likes.splice(index, 1);

        /// persist data in localstorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(element => element.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        /// restoring likes from localStorage
        if (storage) this.likes = storage;
    }
}