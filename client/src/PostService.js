import axios from 'axios';

const url = 'https://full-stack-project-3-api.vercel.app/api/posts/';

class PostService {
    //Get all Books
    static getBooks() {
        return new Promise((resolve, reject) => {
            axios.get(url).then((res) => {
                const data = res.data
                resolve(
                    data.map(post => ({
                    ...post,
                    }))
                )
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    //Get one book by id
    static getBook(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}${id}`).then((res) => {
                const data = res.data
                resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    //Get Books with a certain status
    static getByStatus(filter) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/status/${filter}`).then((res) => {
                const data = res.data
                resolve(
                    data.map(post => ({
                    ...post,
                    }))
                )
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    //Create Book
    static insertBook(book) {
        return axios.post(url, {
            title: book.title,
            author: book.author,
            status: book.status,
            series: book.series,
            genre: book.genre,
            format: book.format,
            notes: book.notes,
            priority: book.priority,
            progress: book.progress,
            rating: book.rating,
            date: book.date,
        });
    }

    //Update Book
    static updateBook(book) {
        return axios.post(`${url}${book._id}`, {
            title: book.title,
            author: book.author,
            status: book.status,
            series: book.series,
            genre: book.genre,
            format: book.format,
            notes: book.notes,
            priority: book.priority,
            progress: book.progress,
            rating: book.rating,
            date: book.date,
        });
    }

    //Delete Book
    static deleteBook(id) {
        return axios.delete(`${url}${id}`);
    }

}


export default PostService;