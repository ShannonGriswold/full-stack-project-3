<script setup>
/* eslint-disable vue/no-v-model-argument*/
//The above disable is becuase that rule is best practice for Vue 2, but that syntax is acceptable and recommended in the documentation for Vue 3
import PostComponent from './components/PostComponent.vue';
import PostService from './PostService';
import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

defineEmits(['close-dialog', 'add-book', 'update-book']);

const toast = useToast();
const dialog = ref(false);
const bookList = ref([]);
const addOrUpdate = ref(true);
const error = ref("");

async function updateBookList() {
    try {
        bookList.value = await PostService.getBooks();
    } catch(err) {
        error.value = err.message;
    }
    console.log(bookList.value);
}

updateBookList();

const bookForDialog = ref(null);

// Closes the dialog and resets the book to display in dialog
function closeDialog() {
    dialog.value = false;
    bookForDialog.value = null;
}

//Adds the book from the dialog to the list
async function addBook() {
    await updateBookList()
    closeDialog();
    toast.success('Book added successfully!');
}


//Deletes a book from the list
async function deleteBook(id) {
    await PostService.deleteBook(id);
    await updateBookList()
    toast.success('Book deleted successfully!');
}


//updates a book
async function updateBook() {
    await updateBookList();
    closeDialog();
    addOrUpdate.value = true;
    toast.success('Book updated successfully!');
}

//Opens the update dialog and tells it what book to display
function openUpdateDialog(id) {
    // bookForDialog.value = {
    //     _id: bookList.value[index]._id,
    //     title: bookList.value[index].title,
    //     author: bookList.value[index].author,
    //     status: bookList.value[index].status,
    //     series: bookList.value[index].series,
    //     genre: bookList.value[index].genre,
    //     format: bookList.value[index].format,
    //     notes: bookList.value[index].notes,
    //     index: index,
    // };
    bookForDialog.value = id;
    addOrUpdate.value = false;
    dialog.value = true;
}

//Returns if the given title is unique
function validateUniqueTitle(title) {
    for (let i = 0; i < bookList.value.length; i++) {
        if (bookList.value[i].title == title) {
            return false;
        }
    }
    return true;
}

//Updates the complete status of a book
// async function updateIsComplete(book, event) {
//     book.isComplete = event.target.checked;
//     await PostService.updateBook(book);
//     await updateBookList();
// }
</script>

<template>
  <div id = "app">
    <v-toolbar color="primary">
        <v-toolbar-title class="text-center">
            <i class="fa fa-book" aria-hidden="true"></i>
            Book Tracker
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
                <th class="text-center">Author</th>
                <th class="text-center">Reading Status</th>
                <th class="text-center">Series</th>
                <th class="text-center">Genre</th>
                <th class="text-center">Format</th>
                <th class="text-center">Notes</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(book) in bookList" :key="book.title">
                <td class="text-center">{{ book.title }}</td>
                <td class="text-center">{{ book.author }}</td>
                <td class="text-center">{{ book.status }}</td>
                <td class="text-center">{{ book.series }}</td>
                <td class="text-center">{{ book.genre }}</td>
                <td class="text-center">{{ book.format }}</td>
                <td class="text-center">{{ book.notes }}</td>
                <td class="text-center pa-4">
                    <v-btn
                        color="blue-darken-1"
                        @click="openUpdateDialog(book._id)"
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
                    <v-btn
                        color="red"
                        @click="deleteBook(book._id)"
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
        @add-book="addBook"
        @close-dialog="closeDialog"
        @update-book="updateBook"
        :add="addOrUpdate"
        :titleValidation="validateUniqueTitle"
        v-model:dialog="dialog"
        v-model:bookModel="bookForDialog"
        />
  </div>
</template>

<style>

</style>
