<script setup>
/* eslint-disable vue/no-v-model-argument*/
//import PostComponent from './components/PostComponent.vue';
/* eslint-disable */

import PostService from './PostService';
/* eslint-enable */

import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

defineEmits(['close-dialog', 'add-task', 'update-task']);

const toast = useToast();
const dialog = ref(false);
const taskList = ref([]);
const addOrUpdate = ref(true);
const error = ref("");

try {
    console.log("retreiving tasks");
    //taskList.value = await PostService.getPosts();
    console.log("retrieved tasks");
    console.log(taskList.value);
} catch(err) {
    error.value = err.message;
}

const taskForDialog = ref({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    index: -1,
});

//Closes the dialog and resets the task to display in dialog
function closeDialog() {
    dialog.value = false;
    taskForDialog.value = {
        title: '',
        description: '',
        deadline: '',
        priority: '',
        index: -1,
    };
}

//Adds the task from the dialog to the list
/* eslint-disable */

async function addTask() {
    // let newTask = {
    //     title: taskForDialog.value.title,
    //     description: taskForDialog.value.description,
    //     deadline: taskForDialog.value.deadline,
    //     priority: taskForDialog.value.priority,
    //     complete: ref(false),
    // };
    // taskList.value.push(newTask);
    // try {
    //     taskList.value = await PostService.getPosts();
    // } catch(err) {
    //     error.value = err.message;
    // }
    closeDialog();
    toast.success('Task added successfully!');
}
/* eslint-enable */


//Deletes a task from the list
/* eslint-disable */

async function deleteTask(index) {
    // taskList.value.splice(index, 1);
    // await PostService.deletePost(taskList[index]._id);
    // try {
    //     taskList.value = await PostService.getPosts();
    // } catch(err) {
    //     error.value = err.message;
    // }
    toast.success('Task deleted successfully!');
}


//updates a task
function updateTask() {
    taskList.value[taskForDialog.value.index].description =
        taskForDialog.value.description;
    taskList.value[taskForDialog.value.index].deadline =
        taskForDialog.value.deadline;
    taskList.value[taskForDialog.value.index].priority =
        taskForDialog.value.priority;
    addOrUpdate.value = true;
    closeDialog();
    toast.success('Task updated successfully!');
}
/* eslint-enable */

//Opens the update dialog and tells it what task to display
/* eslint-disable */
function openUpdateDialog(index) {
    // taskForDialog.value = {
    //     title: taskList.value[index].title,
    //     description: taskList.value[index].description,
    //     deadline: taskList.value[index].deadline,
    //     priority: taskList.value[index].priority,
    //     index: index,
    // };
    // addOrUpdate.value = false;
    // dialog.value = true;

}
/* eslint-enable */

//Returns if the given title is unique
/* eslint-disable */

function validateUniqueTitle(title) {
    for (let i = 0; i < taskList.value.length; i++) {
        if (taskList.value[i].title == title) {
            return false;
        }
    }
    return true;
}
/* eslint-enable */


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
            <!--<tr v-for="(task, index) in taskList" :key="task.title">
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
                        v-model="task.complete"
                        class="d-inline-flex align-center"
                    ></v-checkbox-btn>
                </td>
                <td class="text-center pa-4">
                    <template v-if="!task.complete">
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
            </tr>-->
        </tbody>
    </v-table>
    <!--<Suspense> -->
      <!--<PostComponent 
        @add-task="addTask"
        @close-dialog="closeDialog"
        @update-task="updateTask"
        :add="addOrUpdate"
        :titleValidation="validateUniqueTitle"
        v-model:dialog="dialog"
        v-model:taskModel="taskForDialog"
        />-->
    <!--</Suspense>-->
  </div>
</template>

<style>

</style>
