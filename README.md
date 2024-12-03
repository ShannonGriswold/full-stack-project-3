# Links

The frontend of this project is hosted at https://full-stack-project-3-swart.vercel.app/

The backend of this project can be found at https://full-stack-project-3-api.vercel.app/api/posts

# Description
This is a website to keep track of books you have read, want to read, or are currently reading. The books are stored in a database so that they will still be stored even if the tab is closed. 

The user can add a new book by clicking the add button in the upper right corner of the books list screen and then filling out the form to add the book. The books can also be deleted by clicking the delete button in the action column. Clicking the details button in the action column will show the user all of the details they inputted for that book and allow them to update the details if they click the edit button. 

The books can have different information stored about them depending on their current reading status. A book on the wishlist can have a priority set, one in progress can have the current progress set, and a completed book can have a completion date and rating. After a  reading status is selected for the book, the user will be able to fill in the status-specific fields. If a book that was completed is later changed to one that is in progress for a reread, the completed information is kept and will be shown at the bottom of the details page so that the user can see their previous rating and completion date of the book.

The book list can be filtered by the current reading status of the book by selecting a status from the drop-down and then clicking the filter button. When filtering by a status other than "All" the status column will not be shown, and a column of information from the status-specific fields will be shown instead.
