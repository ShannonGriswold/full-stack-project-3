<script setup>
import PostService from '../PostService';
import { ref, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const bookList = ref([]);
const error = ref("");

const emit = defineEmits(['view-details']);

//This is the current value of the filter select
const filter = ref("All");
//This is the current filter being displayed
const filterDisplay = ref("All");

//Updates the list of books shown based on the filter
async function updateBookList() {
    try {
        if(filter.value == "All") {
            bookList.value = await PostService.getBooks();
        } else {
            bookList.value = await PostService.getByStatus(filter.value);
        }
        filterDisplay.value = filter.value;
    } catch(err) {
        error.value = err.message;
    }
}

//sets the initial book list shown on load
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
        <div class="text-h4 pl-4 mt-3">Currently displaying {{filterDisplay}} books</div>
        <v-spacer></v-spacer>
        <v-table id = "book-table" class="mt-3">
            <thead>
                <tr>
                    <th class="text-center">Title</th>
                    <th class="text-center">Author</th>
                    <th class="text-center" v-if="filterDisplay == 'All'">Reading Status</th>
                    <th class="text-center" v-else-if="filterDisplay=='Wishlist'">Priority</th>
                    <th class="text-center" v-else-if="filterDisplay=='In Progress'">Progress</th>
                    <th class="text-center" v-else-if="filterDisplay=='Completed'">Rating</th>
                    <th class="text-center" v-if="filterDisplay=='Completed'">Completion Date</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book) in bookList" :key="book._id">
                    <td class="text-center">{{ book.title }}</td>
                    <td class="text-center">{{ book.author }}</td>
                    <td class="text-center" v-if="filterDisplay == 'All'">{{ book.status }}</td>
                    <td class="text-center" v-else-if="filterDisplay=='Wishlist'">{{ book.priority }}</td>
                    <td class="text-center" v-else-if="filterDisplay=='In Progress'">{{ book.progress}}</td>
                    <template v-else-if="filterDisplay=='Completed'">
                        <td class="text-center">{{ book.rating }}</td>
                        <td class="text-center">
                            <div v-if="book.date">{{
                        book.date.substring(5, 7) +
                        '/' +
                        book.date.substring(8) +
                        '/' +
                        (book.date.substring(0, 4) % 100)
                    }}</div></td>
                    </template>
                    
                    <td class="text-center pa-4">
                        <v-btn
                            color="blue-darken-1"
                            @click="openDetailsDialog(book._id)"
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
thead {
    color: white;
    background-color: #1976D2;
}
</style>
