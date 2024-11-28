<script setup>
import PostService from '../PostService'
import { ref, defineModel, defineProps, defineEmits } from 'vue';

// const posts = ref([]);


// try {
//     posts.value = await PostService.getPosts();
// } catch(err) {
    
// }

const taskModel = defineModel('taskModel');
const dialog = defineModel('dialog');
const emit = defineEmits(['close-dialog', 'add-task', 'update-task']);

//The properties for this component
const props = defineProps({
    add: Boolean,
    titleValidation: Function,
});

//The error messages to be shown under the text fields
const errorMessages = ref({
    titleError: '',
    descriptionError: '',
    deadlineError: '',
    priorityError: '',
});

    
// async function createPost() {
//     await PostService.insertPost(taskModel);
//     posts.value = await PostService.getPosts();
// }
// async function deletePost(id) {
//     await PostService.deletePost(id);
//     posts.value = await PostService.getPosts();
// }

async function createPost() {
    await PostService.insertPost(taskModel);
}

//Tell parent to close the dialog
function closeDialog() {
    emit('close-dialog');
    errorMessages.value = {
        titleError: '',
        descriptionError: '',
        deadlineError: '',
        priorityError: '',
    };
}

//Validate if the task is filled out and tell parent to add or update
function validateTask(adding) {
    let filledOut = true;
    //If adding a new task need to validate title
    if (adding) {
        if (!taskModel.value.title) {
            errorMessages.value.titleError = 'Title is Required!';
            filledOut = false;
        } else if (!props.titleValidation(taskModel.value.title)) {
            errorMessages.value.titleError = 'Title needs to be unique!';
            filledOut = false;
        } else {
            errorMessages.value.titleError = '';
        }
    }
    //validate description
    if (!taskModel.value.description) {
        errorMessages.value.descriptionError = 'Description is Required!';
        filledOut = false;
    } else {
        errorMessages.value.descriptionError = '';
    }
    //Validate deadline
    if (!taskModel.value.deadline) {
        errorMessages.value.deadlineError = 'Deadline is Required!';
        filledOut = false;
    } else {
        errorMessages.value.deadlineError = '';
    }
    //Validate priority
    if (!taskModel.value.priority) {
        errorMessages.value.priorityError = 'Priority is Required!';
        filledOut = false;
    } else {
        errorMessages.value.priorityError = '';
    }
    //If properly filled out tell parent to add or update
    if (filledOut) {
        if (adding) {
            createPost();
            emit('add-task');
        } else {
            emit('update-task');
        }
    }
}
</script>

<template>
    <!--<div class = "container">
        <h1>Latest Posts</h1>
        <div class = "create-post">
            <label for="create-post">Say Something...</label>
            <input type="text" id = "create-post" v-model="text" placeholder="Create a post">
            <button v-on:click="createPost">Post!</button>
        </div>
        <hr>
        <p class = "error" v-if="error">{{ error }}</p>
        <div 
            class = "post"
            v-for="(post, index) in posts"
            v-bind:item="post"
            v-bind:index="index"
            v-bind:key="post._id"
            v-on:dblclick="deletePost(post._id)"
        >
            {{`${post.createdAt.getDate()}/${post.createdAt.getMonth()}/${post.createdAt.getFullYear()}`}}
            <p class = "text">{{post.text}}</p>
        </div>
    </div>-->




    <v-dialog max-width="400" v-model="dialog">
        <template v-slot:default>
            <v-card v-click-outside="closeDialog">
                <v-toolbar color="primary">
                    <v-toolbar-title v-if="add">
                        <i
                            class="fa fa-plus-circle mr-1"
                            aria-hidden="true"
                        ></i>
                        Add Task
                    </v-toolbar-title>
                    <v-toolbar-title v-else>
                        <i class="fa fa-edit mr-1" aria-hidden="true"></i>
                        Edit Task
                    </v-toolbar-title>
                </v-toolbar>
                <v-form id="task-form" ref="form" validate-on="submit">
                    <v-card-text>
                        <v-text-field
                            label="Title"
                            required
                            variant="outlined"
                            id="title"
                            v-if="add"
                            v-model="taskModel.title"
                            :error-messages="errorMessages.titleError"
                            class="mb-3"
                        ></v-text-field>
                        <v-text-field
                            label="Description"
                            required
                            variant="outlined"
                            id="description"
                            v-model="taskModel.description"
                            :error-messages="errorMessages.descriptionError"
                            class="mb-3"
                        ></v-text-field>
                        <v-text-field
                            label="Deadline"
                            required
                            variant="outlined"
                            id="deadline"
                            type="date"
                            persistent-placeholder
                            v-model="taskModel.deadline"
                            :error-messages="errorMessages.deadlineError"
                            class="mb-3"
                        ></v-text-field>
                        <p class="ml-2">Priority</p>
                        <v-radio-group
                            inline
                            color="primary"
                            id="priority"
                            v-model="taskModel.priority"
                            :error-messages="errorMessages.priorityError"
                            class="mb-3"
                        >
                            <v-radio label="Low" value="low"></v-radio>
                            <v-radio label="Med" value="med"></v-radio>
                            <v-radio label="High" value="high"></v-radio>
                        </v-radio-group>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="add"
                            variant="elevated"
                            color="primary"
                            class="w-33"
                            @click="validateTask(true)"
                            min-width="100"
                        >
                            <i
                                class="fa fa-plus-circle mr-1"
                                aria-hidden="true"
                            ></i
                            >ADD
                        </v-btn>
                        <v-btn
                            v-else
                            variant="elevated"
                            color="primary"
                            class="w-33"
                            @click="validateTask(false)"
                            min-width="100"
                        >
                            <i
                                class="fa fa-pencil-square-o mr-1"
                                aria-hidden="true"
                            ></i
                            >EDIT
                        </v-btn>

                        <v-btn
                            color="red"
                            variant="elevated"
                            v-on:click="closeDialog"
                            class="w-33"
                            min-width="100"
                        >
                            <i class="fa fa-ban mr-1" aria-hidden="true"></i
                            >CANCEL
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
