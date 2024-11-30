<script setup>
import DetailsComponent from './components/DetailsComponent.vue';
import BookListComponent from './components/BookListComponent.vue'
import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

defineEmits(['close-dialog', 'add-book', 'update-book']);

const toast = useToast();
const addOrUpdate = ref(true);
const viewList = ref(true);
const bookForDialog = ref(null);

// Closes the dialog and resets the book to display in dialog
function closeDialog() {
    viewList.value = true;
    bookForDialog.value = null;
}

//Adds the book from the dialog to the list
async function addBook() {
    closeDialog();
    toast.success('Book added successfully!');
}

//updates a book
async function updateBook() {
    closeDialog();
    addOrUpdate.value = true;
    toast.success('Book updated successfully!');
}

//Opens the update dialog and tells it what book to display
function openUpdateDialog(id) {
    bookForDialog.value = id;
    addOrUpdate.value = false;
    viewList.value = false;
}

function openAddPage() {
    bookForDialog.value = null;
    addOrUpdate.value = true;
    viewList.value = false;
}
</script>

<template>
  <div id = "app">
    <v-sheet 
        color="primary" 
        class = "pb-3 mb-3 mt-0" 
        id="page-header"
    >
        <v-row dense class="pt-6 pt-md-2">
            <v-col cols="12" md="8" offset-md="2">
                <div id="page-title" class="text-h1 text-center">
                    <img
                        class="mt-3"
                        alt="A stack of books"
                        src="./assets/books-logo.png"
                    >
                    Book Tracker
                </div>
            </v-col>
            <v-col cols="12" md="2" class="text-right" align-self="end">
                <v-btn
                    v-if="viewList"
                    variant="elevated"
                    color="blue-darken-1"
                    class="mr-3 mb-3"
                    size="large"
                    rounded="xl"
                    @click="openAddPage"
                >
                    <i class="fa fa-plus-circle mr-1" aria-hidden="true"></i>ADD
                </v-btn>
            </v-col>
        </v-row>
    </v-sheet>
    <div id = "main">
        <v-row class="mb-0">
            <v-col cols="12" lg="8" offset-lg="2" md="10" offset-md="1" class="pt-0">
                <Suspense>
                    <BookListComponent 
                        v-if="viewList"
                        @view-details="openUpdateDialog"
                    />
                    <template #fallback><div style="background-color: white;">Loading...</div></template>
                </Suspense>
                <Suspense>
                    <DetailsComponent 
                        v-if="!viewList"
                        @add-book="addBook"
                        @close-dialog="closeDialog"
                        @update-book="updateBook"
                        :add="addOrUpdate"
                        :bookID="bookForDialog"
                        />
                    <template #fallback><div style="background-color: white;">Loading...</div></template>
                </Suspense>
            </v-col>
        </v-row>
    </div>
  </div>
</template>

<style>
#app {
    background-color: #402102;
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
