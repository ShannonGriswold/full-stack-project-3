import axios from 'axios';

const url = 'http://localhost:5000/api/posts/';

class PostService {
    //Get Posts
    static getPosts() {
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

    //Create Post
    static insertPost(task) {
        return axios.post(url, {
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
            isComplete: false
        });
    }

    //Delete Post
    static deletePost(id) {
        return axios.delete(`${url}${id}`);
    }

}


export default PostService;