# Key
| ID | Deliverable         |
| --- | ----------------- |
| B1 | Core setup          |
| B2 | Database creation   |
| B3 | User registration   |
| B4 | Messaging           |
| B5 | Add, remove and edit food available to pick up |
| B6 | Basic database search  |
| B7 | Interactive sorting   |
| B8 | Usability/Accessibility Functions |
| I1 | Search filtering(Done before user receives results back) |
| I2 | Notifications          |

# Function Requirements

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.01 - Account registration  |
| Description  | Form to submit to create an account  |
| Priority  | High  |
| Dependencies  | Database  |
| Expected results  | User will be able to create an account  |
| Exception handling  | User enters incorrect information - reject incorrect information, ask to try again|

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.02 - Account changes |
| Description  | Form to change details on account e.g. passwords and emails |
| Priority  | Medium |
| Dependencies  | Database  |
| Expected results  | User will be able to modify details on their account |
| Exception handling  | User enters incorrect information - reject incorrect information, ask to try again|

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.03 - Profile  |
| Description  | Page dedicated to show a users details  |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | A user's details will be able to be accessed conveniently.  |
| Exception handling  | Not Applicable |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.01 - Send message |
| Description  | Send a text message from one user to another  |
| Priority  | High  |
| Dependencies  | Database, Socket  |
| Expected results  | Users will be able to communicate through the website  |
| Exception handling  | Invalid recipient/sender (ask user to try again), Invalid message content(ask user to try again), Connection loss(attempt reconnection, if it fails again terminate)|

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.02 - Message History |
| Description  | Allows user to see previous messages sent to and from another user  |
| Priority  | Medium  |
| Dependencies  | Database |
| Expected results  | More reliable communication between users through the website  |
| Exception handling  | No messages found, Invalid message content, give error message to user if either happens |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.03 - Claim Food |
| Description  | Function in chat to agree to collect food. Must be sent through private message|
| Priority  | Medium |
| Dependencies  | Socket, Database  |
| Expected results  | User will be able to claim food but only when both parties agree |
| Exception handling  | Invalid recipient/sender (ask user to try again), Connection loss(attempt reconnection, if it fails again terminate)|

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B5.01 - Add single item to available food list |
| Description  | User can add a single Item to the database |
| Priority  | High  |
| Dependencies  | Database |
| Expected results  | User will update the database with a single item of food |
| Exception handling | Connection loss with database, make user try again |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B5.02 - Bulk item add |
| Description  | Add item to "basket" or available food list |
| Priority  | Medium  |
| Dependencies  | Database |
| Expected results  | User add food onto a available food list |
| Exception handling  | Connection loss with database, make user try again |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B5.03 - Report food |
| Description  | Function will allow users to report food which doesn't match description |
| Priority  | Low  |
| Dependencies  | Database |
| Expected results  | Will notify admins, and will be marked as reported food, the user who reported the food will receive a rating on accuracy|
| Exception handling  | Connection loss with database, make user try again |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.04 - Rating System  |
| Description  | Allows users to rate others in order to simulate a trust system.  |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | Users will be able to rate others.  |
| Exception handling  | User doesn't rate, Rating higher or under a range. reject users input and try again |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B6.05 - Query database  |
| Description  | Sends a query to the database and returns results based on the query|
| Priority  | High |
| Dependencies  | Database  |
| Expected results  | Return a list of foods which fit the query |
| Exception handling  | User inputs a invalid word e.g. any keyword in SQL will be rejected |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B6.06 - Query builder |
| Description  | Function will build a query from parameter given from a user|
| Priority  | High  |
| Dependencies  | Not applicable |
| Expected results  | Function will return a query in SQL |
| Exception handling  | User inputs a invalid word e.g. any keyword in SQL will be rejected|

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B6.07 - View current/past offers  |
| Description  | Allows users to see what they currently offer and what they offered in the past. |
| Priority  | High  |
| Dependencies  | Database  |
| Expected results  | Returns a list of past and current offers  |
| Exception handling  | Connection loss with database, make user try again |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B7.01 - Interactive search sorting  |
| Description  | Allows for user to sort the results without having to reload the webpage |
| Priority  | High  |
| Dependencies  | Database  |
| Expected results  | User will be able to sort things easily by distance, expiry date, alphabetic etc |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B8.01 - Text/Image Size Adjustment |
| Description  | The ability to adjust size of text & images correcting for those with poor eyesight |
| Priority  | Medium  |
| Dependencies  | All site pages built |
| Expected results  | Text size can be increased or decreased and no errors in formatting/site layout occur |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B8.02 - Screen Reader Functions/Compatibility |
| Description  | Alt text for all images/diagrams/maps in the system so that the site can be used with a screen reader. |
| Priority  | Medium  |
| Dependencies  | All site pages built and visual resources added |
| Expected results  | Any image/map in the system should provide alt text when hovered over. |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B8.03 - Tutorial/Help Page |
| Description  | A page which runs through how to use the system and contains various FAQs. |
| Priority  | Medium  |
| Dependencies  | All site pages built. |
| Expected results  | Users should be able to load the help page. |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | I1.01 - Intermediate search functionality  |
| Description  | Filtering on the search results based on location, radius, item type etc |
| Priority  | Medium  |
| Dependencies  | Database |
| Expected results  | Server will provide a list of foods available, presorted based on location, radius, or item type etc  |
| Exception handling  | Connection loss with database, make user try again |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | I2.01 - Notifications  |
| Description  | Users receive a notification when food they are looking for becomes available |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | Users will receive a notification when food is available either by an email, or by mobile push notifications |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | I2.01 - Notifications  |
| Description  | Users receive a notification when food they are looking for becomes available |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | Users will receive a notification when food is available either by an email, or by mobile push notifications |
| Exception handling  | N/A |
