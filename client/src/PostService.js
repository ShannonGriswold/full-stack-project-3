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
            // try {
            //   resolve([{title: "hello", description: "hi", priority: "high", deadline:"hihihihhhihihihihih", isComplete: false}]);
            // } catch(err) {
            //   reject(err);
            // }
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

    //Update Post
    static updatePost(task) {
        return axios.post(`${url}${task._id}`, {
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
            isComplete: task.isComplete
        });
    }

    //Delete Post
    static deletePost(id) {
        return axios.delete(`${url}${id}`);
    }

}


export default PostService;