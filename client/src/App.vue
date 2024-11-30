<script setup>
/* eslint-disable vue/no-v-model-argument*/
//The above disable is becuase that rule is best practice for Vue 2, but that syntax is acceptable and recommended in the documentation for Vue 3
import PostComponent from './components/PostComponent.vue';
import PostService from './PostService';
import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

defineEmits(['close-dialog', 'add-task', 'update-task']);

const toast = useToast();
const dialog = ref(false);
const taskList = ref([]);
const addOrUpdate = ref(true);
const error = ref("");

async function updateTaskList() {
    try {
        taskList.value = await PostService.getPosts();
    } catch(err) {
        error.value = err.message;
    }
}

updateTaskList();

const taskForDialog = ref({
    _id: '',
    title: '',
    description: '',
    deadline: '',
    priority: '',
    index: -1,
});

// Closes the dialog and resets the task to display in dialog
function closeDialog() {
    dialog.value = false;
    taskForDialog.value = {
        _id: '',
        title: '',
        description: '',
        deadline: '',
        priority: '',
        index: -1,
    };
}

//Adds the task from the dialog to the list
async function addTask() {
    await updateTaskList()
    closeDialog();
    toast.success('Task added successfully!');
}


//Deletes a task from the list
async function deleteTask(index) {
    await PostService.deletePost(taskList.value[index]._id);
    await updateTaskList()
    toast.success('Task deleted successfully!');
}


//updates a task
async function updateTask() {
    await updateTaskList();
    closeDialog();
    addOrUpdate.value = true;
    toast.success('Task updated successfully!');
}

//Opens the update dialog and tells it what task to display
function openUpdateDialog(index) {
    taskForDialog.value = {
        _id: taskList.value[index]._id,
        title: taskList.value[index].title,
        description: taskList.value[index].description,
        deadline: taskList.value[index].deadline,
        priority: taskList.value[index].priority,
        isComplete: taskList.value[index].isComplete,
        index: index,
    };
    addOrUpdate.value = false;
    dialog.value = true;
}

//Returns if the given title is unique
function validateUniqueTitle(title) {
    for (let i = 0; i < taskList.value.length; i++) {
        if (taskList.value[i].title == title) {
            return false;
        }
    }
    return true;
}

//Updates the complete status of a task
async function updateIsComplete(task, event) {
    task.isComplete = event.target.checked;
    await PostService.updatePost(task);
    await updateTaskList();
}
</script>

<template>
  <div id = "app">
    <v-toolbar color="primary">
        <v-toolbar-title class="text-center">
            <i class="fa fa-bars" aria-hidden="true"></i>
            FRAMEWORKS
        </v-toolbar-title>
        <v-btn
            variant="elevated"
            color="blue-darken-1"
            class="ma-3"
            @click="
                addOrUpdate = true;
                dialog = true;
            "
        >
            <i class="fa fa-plus-circle mr-1" aria-hidden="true"></i>ADD
        </v-btn>
    </v-toolbar>
    <v-table color="primary">
        <thead color="primary">
            <tr>
                <th class="text-center">Title</th>
                <th class="text-center">Description</th>
                <th class="text-center">Deadline</th>
                <th class="text-center">Priority</th>
                <th class="text-center">Is Complete</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(task, index) in taskList" :key="task.title">
                <td class="text-center">{{ task.title }}</td>
                <td class="text-center">{{ task.description }}</td>
                <td class="text-center">
                    {{
                        task.deadline.substring(5, 7) +
                        '/' +
                        task.deadline.substring(8) +
                        '/' +
                        (task.deadline.substring(0, 4) % 100)
                    }}
                </td>
                <td class="text-center">{{ task.priority }}</td>
                <td class="text-center">
                    <v-checkbox-btn
                        :id="'checkbox' + index"
                        @change="updateIsComplete(task, $event)"
                        class="d-inline-flex align-center"
                    ></v-checkbox-btn>
                </td>
                <td class="text-center pa-4">
                    <template v-if="!task.isComplete">
                        <v-btn
                            color="blue-darken-1"
                            @click="openUpdateDialog(index)"
                            class="w-50"
                            min-width="100"
                        >
                            <i
                                class="fa fa-pencil-square-o mr-1"
                                aria-hidden="true"
                            ></i
                            >UPDATE
                        </v-btn>
                        <br />
                    </template>
                    <v-btn
                        color="red"
                        @click="deleteTask(index)"
                        class="w-50"
                        min-width="100"
                    >
                        <i
                            class="fa fa-times-circle mr-1"
                            aria-hidden="true"
                        ></i
                        >DELETE
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
      <PostComponent 
        @add-task="addTask"
        @close-dialog="closeDialog"
        @update-task="updateTask"
        :add="addOrUpdate"
        :titleValidation="validateUniqueTitle"
        v-model:dialog="dialog"
        v-model:taskModel="taskForDialog"
        />
  </div>
</template>

<style>
#app {
    background-color: #59320b;
    background-image: url("./assets/background.png");
    background-repeat: repeat;
    background-position: bottom;
    min-height: 100vh;
    margin:0;
}
#page-title {
    font-family:Georgia, 'Times New Roman', Times, serif;
}
#page-header {
    margin-bottom: 0;
}
</style>
