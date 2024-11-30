<script setup>
import PostService from '../PostService';
import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const bookList = ref([]);
const error = ref("");

const emit = defineEmits(['view-details']);

const filter = ref("All");

async function updateBookList() {
    try {
        if(filter.value == "All") {
            bookList.value = await PostService.getBooks();
        } else {
            bookList.value = await PostService.getByStatus(filter.value);
        }
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
    <div id = "book-list">
        <v-row class="mt-0" dense>
            <v-col cols="12" md="3" sm="3">
                <div class="text-subtitle-1 ml-4">Filter By Status: </div>
            </v-col>
            <v-col cols="12" sm="7" md="6">
                <v-select
                    variant="outlined"
                    :items="['All', 'Wishlist', 'In Progress', 'Completed']"
                    density="compact"
                    id="filter"
                    v-model="filter"
                    class="mb-1"
                ></v-select>
            </v-col>
            <v-col cols="12" sm="2">
                <v-btn
                    color="success"
                    variant="elevated"
                    rounded="xl"
                    v-on:click="updateBookList"
                    block
                    class="mt-1"
                >
                    Filter
                </v-btn>
            </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-table color="primary" id = "book-table">
            <thead color="primary">
                <tr>
                    <th class="text-center">Title</th>
                    <th class="text-center">Author</th>
                    <th class="text-center">Reading Status</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book) in bookList" :key="book._id">
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
