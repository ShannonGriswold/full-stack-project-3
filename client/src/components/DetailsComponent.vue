<script setup>
import PostService from '../PostService'
import { ref, defineProps, defineEmits } from 'vue';
const bookOriginal = ref({});
const bookDisplay = ref({});
const editing = ref(false);
const notesDisplay = ref([]);

//The properties for this component
const props = defineProps({
    add: Boolean,
    bookID: String,
});

if(props.bookID != null) {
    bookOriginal.value = await PostService.getBook(props.bookID);
    console.log(bookOriginal.value);
} else {
    bookOriginal.value = {
        _id: null,
        title: '',
        author: '',
        status: '',
        series: '',
        genre: '',
        format: '',
        notes: '',
        priority: '',
        progress: '',
        rating: '',
        date: ''
    };
}

bookDisplay.value._id = bookOriginal.value._id;
bookDisplay.value.title = bookOriginal.value.title;
bookDisplay.value.author = bookOriginal.value.author;
bookDisplay.value.status = bookOriginal.value.status;
bookDisplay.value.series = bookOriginal.value.series;
bookDisplay.value.genre = bookOriginal.value.genre;
bookDisplay.value.format = bookOriginal.value.format;
bookDisplay.value.notes = bookOriginal.value.notes;
bookDisplay.value.priority = bookOriginal.value.priority;
bookDisplay.value.progress = bookOriginal.value.progress;
bookDisplay.value.rating = bookOriginal.value.rating;
bookDisplay.value.date = bookOriginal.value.date;

console.log(bookDisplay.value.notes);
notesDisplay.value = bookOriginal.value.notes.split("\n").map((note, index) => {
    return {key: index, note: note};
});
console.log(notesDisplay.value);

if(props.add) {
    editing.value = true;
} else {
    editing.value = false;
}

const emit = defineEmits(['close-dialog', 'add-book', 'update-book']);



//The error messages to be shown under the text fields
const errorMessages = ref({
    titleError: '',
    authorError: '',
    statusError: '',
});

async function createPost() {
    await PostService.insertBook(bookDisplay.value);
}

async function updatePost() {
    await PostService.updateBook(bookDisplay.value);
}

//Tell parent to close the dialog
function closeDialog() {
    emit('close-dialog');
    errorMessages.value = {
        titleError: '',
        authorError: '',
        statusError: '',
    };
}

function cancelEdit() {
    if(props.add) {
        closeDialog()
    } else {
        editing.value = false;
        bookDisplay.value._id = bookOriginal.value._id;
        bookDisplay.value.title = bookOriginal.value.title;
        bookDisplay.value.author = bookOriginal.value.author;
        bookDisplay.value.status = bookOriginal.value.status;
        bookDisplay.value.series = bookOriginal.value.series;
        bookDisplay.value.genre = bookOriginal.value.genre;
        bookDisplay.value.format = bookOriginal.value.format;
        bookDisplay.value.notes = bookOriginal.value.notes;
    }
}

//Validate if the book is filled out and tell parent to add or update
async function validateBook(adding) {
    let filledOut = true;
    //validate title
    if (!bookDisplay.value.title) {
        errorMessages.value.titleError = 'Title is Required!';
        filledOut = false;
    } else {
        errorMessages.value.titleError = '';
    }
    //validate author
    if (!bookDisplay.value.author) {
        errorMessages.value.authorError = 'Author is Required!';
        filledOut = false;
    } else {
        errorMessages.value.authorError = '';
    }
    //Validate status
    if (!bookDisplay.value.status) {
        errorMessages.value.statusError = 'Status is Required!';
        filledOut = false;
    } else {
        errorMessages.value.statusError = '';
    }
    //If properly filled out tell parent to add or update
    if (filledOut) {
        //Remove fields that are not used by that status
        if(bookDisplay.value.status == "Wishlist") {
            bookDisplay.value.progress = '';
            bookDisplay.value.rating = '';
            bookDisplay.value.date = '';
        } else if (bookDisplay.value.status == "In Progress") {
            //keep rating and date if it is a reread otherwise clear them
            if(bookOriginal.value.date || bookOriginal.value.rating) {
                bookDisplay.value.date = bookOriginal.value.date;
                bookDisplay.value.rating = bookOriginal.value.rating;
            } else {
                bookDisplay.value.rating = '';
                bookDisplay.value.date = '';
            }
            bookDisplay.value.priority = '';
        } else if (bookDisplay.value.status == "Completed") {
            bookDisplay.value.priority = '';
            bookDisplay.value.progress = '';
        }

        if (adding) {
            await createPost();
            emit('add-book');
        } else {
            await updatePost();
            emit('update-book');
        }
    }
}
</script>

<template>
    <v-sheet id = "details-view" class = "pa-5">
        <v-container>
            <v-btn
                icon="mdi:mdi-arrow-left"
                variant="elevated"
                color="grey-lighten-3"
                rounded="xl"
                @click="closeDialog"
            ></v-btn>
            <v-btn
                v-if="!editing"
                variant="elevated"
                color="light-blue-lighten-4"
                rounded="xl"
                size="large"
                @click="editing=!editing"
                class="float-sm-right"
            >
                <i
                    class="fa fa-pencil-square-o mr-1"
                    aria-hidden="true"
                ></i
                >EDIT
            </v-btn>
            <v-row dense class="mt-3">
                <v-col cols="12" sm="8" md="9">
                    <h2 v-if="props.add" class="text-h4">Add a Book</h2>
                    <h2 v-else-if="editing" class="text-h4">Edit {{ bookDisplay.title }}</h2>
                    <h2 v-else class="text-h4">{{ bookDisplay.title }}</h2>
                </v-col>
                <v-col cols="12" sm="4" md="3">
                    
                </v-col>
            </v-row>
            <v-form id="book-form" ref="form" validate-on="submit">
                <p>Id: {{ bookOriginal._id}}</p>
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold"><span v-if="editing" class="text-red">*</span>Title: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-text-field
                            v-if="editing"
                            placeholder="Title"
                            required
                            variant="outlined"
                            id="title"
                            v-model="bookDisplay.title"
                            :error-messages="errorMessages.titleError"
                        ></v-text-field>
                        <div v-else class="text-body-1">{{ bookOriginal.title }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold"><span v-if="editing" class="text-red">*</span>Author: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-text-field
                            v-if="editing"
                            placeholder="Author"
                            required
                            variant="outlined"
                            id="author"
                            v-model="bookDisplay.author"
                            :error-messages="errorMessages.authorError"
                        ></v-text-field>
                        <div v-else class="text-body-1">{{ bookOriginal.author }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold"><span v-if="editing" class="text-red">*</span>Status: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-radio-group
                            v-if="editing"
                            inline
                            color="primary"
                            id="status"
                            v-model="bookDisplay.status"
                            :error-messages="errorMessages.statusError"
                        >
                            <v-radio label="Wishlist" value="Wishlist"></v-radio>
                            <v-radio label="In Progress" value="In Progress"></v-radio>
                            <v-radio label="Completed" value="Completed"></v-radio>
                        </v-radio-group>
                        <div v-else class="text-body-1">{{ bookOriginal.status }}</div>
                    </v-col>
                </v-row>
                <v-row v-if="bookDisplay.status == 'Wishlist'">
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Priority: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-radio-group
                            v-if="editing"
                            inline
                            color="primary"
                            id="priority"
                            v-model="bookDisplay.priority"
                        >
                            <v-radio label="Low" value="Low"></v-radio>
                            <v-radio label="Medium" value="Medium"></v-radio>
                            <v-radio label="High" value="High"></v-radio>
                        </v-radio-group>
                        <div v-else class="text-body-1">{{ bookOriginal.priority }}</div>
                    </v-col>
                </v-row>
                <v-row v-if="bookDisplay.status == 'In Progress'">
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Progress: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-text-field
                            v-if="editing"
                            placeholder="Progress"
                            variant="outlined"
                            id="progress"
                            v-model="bookDisplay.progress"
                        ></v-text-field>
                        <div v-else class="text-body-1">{{ bookOriginal.progress }}</div>
                    </v-col>
                </v-row>
                <v-row v-if="bookDisplay.status == 'Completed'">
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Rating: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-select
                            v-if="editing"
                            placeholder="rating"
                            variant="outlined"
                            :items="[1, 2, 3, 4, 5]"
                            id="rating"
                            v-model="bookDisplay.rating"
                        ></v-select>
                        <div v-else class="text-body-1">{{ bookOriginal.rating }}</div>
                    </v-col>
                </v-row>
                <v-row v-if="bookDisplay.status == 'Completed'">
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Completion Date: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-text-field
                            v-if="editing"
                            variant="outlined"
                            id="date"
                            v-model="bookDisplay.date"
                            type="date"
                        ></v-text-field>
                        <div v-else-if="bookOriginal.date" class="text-body-1">{{
                        bookOriginal.date.substring(5, 7) +
                        '/' +
                        bookOriginal.date.substring(8) +
                        '/' +
                        (bookOriginal.date.substring(0, 4) % 100)
                    }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Series: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-text-field
                            v-if="editing"
                            placeholder="Series"
                            variant="outlined"
                            id="series"
                            v-model="bookDisplay.series"
                        ></v-text-field>
                        <div v-else class="text-body-1">{{ bookOriginal.series }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Genre: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-text-field
                            v-if="editing"
                            placeholder="Genre"
                            variant="outlined"
                            id="genre"
                            v-model="bookDisplay.genre"
                        ></v-text-field>
                        <div v-else class="text-body-1">{{ bookOriginal.genre }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Format: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <v-select
                            v-if="editing"
                            placeholder="format"
                            variant="outlined"
                            :items="['Paperback', 'Hardback', 'EBook', 'Web Novel', 'Audiobook', 'Comic']"
                            id="format"
                            v-model="bookDisplay.format"
                        ></v-select>
                        <div v-else class="text-body-1">{{ bookOriginal.format }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div class="text-subtitle-1 font-weight-bold">Notes: </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12">
                        <v-textarea
                            v-if="editing"
                            placeholder="Notes"
                            variant="outlined"
                            id="notes"
                            v-model="bookDisplay.notes"
                        ></v-textarea>
                        <div v-else class="text-body-1">
                            <div
                                v-for="(note) in notesDisplay"
                                :key="note.key"
                            >{{note.note}}</div>
                        </div>
                    </v-col>
                </v-row>
                <v-spacer></v-spacer>
                <v-row v-if="editing">
                    <v-col cols="6" sm="4" md="3" offset-sm="4" offset-md="6">
                        <v-btn
                            v-if="props.add"
                            variant="elevated"
                            color="primary"
                            size="large"
                            rounded="xl"
                            @click="validateBook(true)"
                            block
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
                            size="large"
                            rounded="xl"
                            @click="validateBook(false)"
                            block
                        >
                            <i
                                class="fa fa-floppy-o mr-1"
                                aria-hidden="true"
                            ></i
                            >SAVE
                        </v-btn>
                    </v-col>
                    <v-col cols="6" sm="4" md="3">
                        <v-btn
                            color="red"
                            variant="elevated"
                            size="large"
                            rounded="xl"
                            v-on:click="cancelEdit"
                            block
                        >
                            <i class="fa fa-ban mr-1" aria-hidden="true"></i
                            >CANCEL
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <div v-if="!editing">
                <div class = "text-h6" v-if="bookOriginal.status == 'In Progress' && (bookOriginal.date || bookOriginal.rating)">Completed Before with: </div>
                <v-row v-if="bookOriginal.status == 'In Progress' && bookOriginal.date">
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Completion Date: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <div class="text-body-1">{{
                        bookOriginal.date.substring(5, 7) +
                        '/' +
                        bookOriginal.date.substring(8) +
                        '/' +
                        (bookOriginal.date.substring(0, 4) % 100)
                    }}</div>
                    </v-col>
                </v-row>
                <v-row v-if="bookOriginal.status == 'In Progress' && bookOriginal.rating">
                    <v-col cols="12" sm="3" md="2">
                        <div class="text-subtitle-1 font-weight-bold">Rating: </div>
                    </v-col>
                    <v-col cols="12" sm="9" md="6">
                        <div class="text-body-1">{{ bookOriginal.rating }}</div>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </v-sheet>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
