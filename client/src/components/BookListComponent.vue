<script setup>
import PostService from '../PostService';
import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const bookList = ref([]);
const error = ref("");

const emit = defineEmits(['view-details']);

async function updateBookList() {
    try {
        bookList.value = await PostService.getBooks();
    } catch(err) {
        error.value = err.message;
    }
    console.log(bookList.value);
}

await updateBookList();

//Deletes a book from the list
async function deleteBook(id) {
    await PostService.deleteBook(id);
    await updateBookList()
    toast.success('Book deleted successfully!');
}

//Opens the details dialog and tells it what book to display
function openDetailsDialog(id) {
    emit('view-details', id);
}
</script>

<template>
    <div id = "book-list" class="h-100">
        <v-table color="primary" id = "book-table" class="h-100">
            <thead color="primary">
                <tr>
                    <th class="text-center">Title</th>
                    <th class="text-center">Author</th>
                    <th class="text-center">Reading Status</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book) in bookList" :key="book.title">
                    <td class="text-center">{{ book.title }}</td>
                    <td class="text-center">{{ book.author }}</td>
                    <td class="text-center">{{ book.status }}</td>
                    <td class="text-center pa-4">
                        <v-btn
                            color="blue-darken-1"
                            @click="openDetailsDialog(book._id)"
                            class="w-50"
                            min-width="100"
                            rounded="xl"
                        >
                            <i
                                class="fa fa-pencil-square-o mr-1"
                                aria-hidden="true"
                            ></i
                            >DETAILS
                        </v-btn>
                        <br />
                        <v-btn
                            color="red"
                            @click="deleteBook(book._id)"
                            class="w-50"
                            min-width="100"
                            rounded="xl"
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
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#book-list {
    background-color: white;
}
</style>
