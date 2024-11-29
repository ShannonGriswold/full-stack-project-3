<script setup>
import PostService from '../PostService'
import { ref, defineModel, defineProps, defineEmits } from 'vue';
const bookModelValue = defineModel('bookModel');
const bookModel = ref({});
if(bookModelValue.value != null) {
    bookModel.value = await PostService.getBook(bookModelValue.value);
    console.log(bookModel.value);
} else {
    bookModel.value = {
        _id: null,
        title: '',
        author: '',
        status: '',
        series: '',
        genre: '',
        format: '',
        notes: '',
    };
}
// watch(bookModelValue, async (newValue) => {
//     if(newValue != null) {
//         bookModel.value = await PostService.getBook(newValue);
//         console.log(bookModel.value);
//     } else {
//         bookModel.value = {
//             _id: null,
//             title: '',
//             author: '',
//             status: '',
//             series: '',
//             genre: '',
//             format: '',
//             notes: '',
//         };
//     }
// });
// const dialog = defineModel('dialog');
const emit = defineEmits(['close-dialog', 'add-book', 'update-book']);

//The properties for this component
const props = defineProps({
    add: Boolean,
    titleValidation: Function,
});

//The error messages to be shown under the text fields
const errorMessages = ref({
    titleError: '',
    authorError: '',
    statusError: '',
});

async function createPost() {
    await PostService.insertBook(bookModel.value);
}

async function updatePost() {
    await PostService.updateBook(bookModel.value);
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

//Validate if the book is filled out and tell parent to add or update
async function validateBook(adding) {
    let filledOut = true;
    //If adding a new book need to validate title
    if (adding) {
        if (!bookModel.value.title) {
            errorMessages.value.titleError = 'Title is Required!';
            filledOut = false;
        // } else if (!props.titleValidation(bookModel.value.title)) {
        //     errorMessages.value.titleError = 'Title needs to be unique!';
        //     filledOut = false;
        } else {
            errorMessages.value.titleError = '';
        }
    }
    //validate author
    if (!bookModel.value.author) {
        errorMessages.value.authorError = 'Author is Required!';
        filledOut = false;
    } else {
        errorMessages.value.authorError = '';
    }
    //Validate status
    if (!bookModel.value.status) {
        errorMessages.value.statusError = 'Status is Required!';
        filledOut = false;
    } else {
        errorMessages.value.statusError = '';
    }
    //If properly filled out tell parent to add or update
    if (filledOut) {
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
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title v-if="props.add">
                        <i
                            class="fa fa-plus-circle mr-1"
                            aria-hidden="true"
                        ></i>
                        Add Book
                    </v-toolbar-title>
                    <v-toolbar-title v-else>
                        <i class="fa fa-edit mr-1" aria-hidden="true"></i>
                        Edit Book
                    </v-toolbar-title>
                </v-toolbar>
                <v-form id="book-form" ref="form" validate-on="submit">
                    <v-card-text>
                        <p>Id: {{bookModel._id}}</p>
                        <v-text-field
                            label="Title"
                            required
                            variant="outlined"
                            id="title"
                            v-model="bookModel.title"
                            :error-messages="errorMessages.titleError"
                            class="mb-3"
                        ></v-text-field>
                        <v-text-field
                            label="Author"
                            required
                            variant="outlined"
                            id="author"
                            v-model="bookModel.author"
                            :error-messages="errorMessages.authorError"
                            class="mb-3"
                        ></v-text-field>
                        <p class="ml-2">Status</p>
                        <v-radio-group
                            inline
                            color="primary"
                            id="status"
                            v-model="bookModel.status"
                            :error-messages="errorMessages.statusError"
                            class="mb-3"
                        >
                            <v-radio label="Wishlist" value="Wishlist"></v-radio>
                            <v-radio label="In Progress" value="In Progress"></v-radio>
                            <v-radio label="Completed" value="Completed"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            label="Series"
                            variant="outlined"
                            id="series"
                            v-model="bookModel.series"
                            class="mb-3"
                        ></v-text-field>
                        <v-text-field
                            label="Genre"
                            variant="outlined"
                            id="genre"
                            v-model="bookModel.genre"
                            class="mb-3"
                        ></v-text-field>
                        <v-select
                            label="format"
                            variant="outlined"
                            :items="['Paperback', 'Hardback', 'EBook', 'Web Novel', 'Audiobook', 'Comic']"
                            id="format"
                            v-model="bookModel.format"
                            class="mb-3"
                        ></v-select>
                        <v-textarea
                            label="Notes"
                            variant="outlined"
                            id="notes"
                            v-model="bookModel.notes"
                            class="mb-3"
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="props.add"
                            variant="elevated"
                            color="primary"
                            class="w-33"
                            @click="validateBook(true)"
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
                            @click="validateBook(false)"
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
