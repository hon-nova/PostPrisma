## Intro. to Post Project

### Key Features:
#### User Authentication with Passport.js:

A. Login: Users can log in using their credentials, which are authenticated using Passport.js.

1. Create Posts: Authenticated users can create new posts with a title, description, and link.
2. View Posts: All users can view the posts, including the creator’s information.
3. Edit and Delete Posts: Users can edit or delete their own posts. This feature is only available for the creator of the post.
Comment System:

4. Add Comments: Users can add comments to posts, but they must provide content (validated by the backend). If no content is entered, an error message is shown.
Delete Comments: Users can delete comments they have created. This functionality ensures that only the comment’s creator can delete their comment.
Dynamic Error Handling:

B. Form Validation: The application checks for missing or incorrect data when submitting forms (e.g., creating posts, comments). If validation fails, an error message is displayed to the user.
C. Error Display: Error messages (e.g., empty comment content) are passed to the front end and displayed dynamically, allowing for user-friendly error handling.

