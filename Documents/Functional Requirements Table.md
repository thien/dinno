# Functional Requirements

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | Content Cell  |
| Description  | Content Cell  |
| Priority  | Content Cell  |
| Dependencies  | Content Cell  |
| Expected results  | Content Cell  |
| Exception handling  | Content Cell  |


| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B2.01 - Account registration  |
| Description  | Form to submit to create an account  |
| Priority  | High  |
| Dependencies  | Database  |
| Expected results  | User will be able to create an account  |
| Exception handling  | User enters incorrect information e.g. email. User times out from website |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B2.02 - Account changes |
| Description  | Form to change details on account e.g. passwords and emails |
| Priority  | Medium |
| Dependencies  | Database  |
| Expected results  | User will be able to modify details on their account |
| Exception handling  | User enters incorrect information e.g. email. User times out from website |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B2.03 - Profile  |
| Description  | Page dedicated to show a users details  |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | A user's details will be able to be accessed conveniently.  |
| Exception handling  | Not Applicable |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.01 - Add single item to available food list |
| Description  | User can add a single Item to the database |
| Priority  | High  |
| Dependencies  | Database |
| Expected results  | User will update the database with a single item of food |
| Exception handling | |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.02 - Bulk item add |
| Description  | Add item to "basket" or available food list |
| Priority  | Medium  |
| Dependencies  | Database |
| Expected results  | User add food onto a available food list |
| Exception handling  | User times out from website |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.03 - Food checking |
| Description  | Reject foods which are out of date |
| Priority  | High  |
| Dependencies  | N/A  |
| Expected results  | Out of date food is rejected  |
| Exception handling  | User enters incorrect information e.g. email. User times out from website |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.04 - Report food |
| Description  | Function will allow users to report food which doesn't match description |
| Priority  | Low  |
| Dependencies  |  |
| Expected results  | Will notify admins, and will be marked as reported food, the user who reported the food will receive a rating on accuracy|
| Exception handling  | |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.01 - Send message |
| Description  | Send a text message from one user to another  |
| Priority  | High  |
| Dependencies  | Database, Socket  |
| Expected results  | Users will be able to communicate through the website  |
| Exception handling  | Invalid recipient/sender, Invalid message content, Connection loss |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.02 - Message History |
| Description  | Allows user to see previous messages sent to and from another user  |
| Priority  | Medium  |
| Dependencies  | Database |
| Expected results  | More reliable communication between users through the website  |
| Exception handling  | No messages found, Invalid message content |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B3.03 - Claim Food |
| Description  | Function in chat to agree to collect food. Must be sent through private message|
| Priority  | Medium |
| Dependencies  | Socket, Database  |
| Expected results  | User will be able to claim food but only when both parties agree |
| Exception handling  | |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B2.04 - Rating System  |
| Description  | Allows users to rate others in order to simulate a trust system.  |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | Users will be able to rate others.  |
| Exception handling  | User doesn't rate, Rating higher or under a range. |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.05 - Query database  |
| Description  | Sends a query to the database and returns results based on the query|
| Priority  | High |
| Dependencies  | Database  |
| Expected results  | Return a list of foods which fit the query |
| Exception handling  | User inputs a invalid word e.g. any keyword in SQL will be rejected |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.06 - Query builder |
| Description  | Function will build a query from parameter given from a user|
| Priority  | High  |
| Dependencies  |  |
| Expected results  | Function will return a query in SQL |
| Exception handling  | User uses SQL keywords|

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B4.07 - View current/past offers  |
| Description  | Allows users to see what they currently offer and what they offered in the past. |
| Priority  | High  |
| Dependencies  | Database  |
| Expected results  | Returns a list of past and current offers  |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | B5.01 - Interactive search sorting  |
| Description  | Allows for user to sort the results without having to reload the webpage |
| Priority  | High  |
| Dependencies  | Database  |
| Expected results  | User will be able to sort things easily by distance, expiry date, alphabetic etc |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | I1.01 - Intermediate search functionality  |
| Description  | Filtering on the search results based on location, radius, item type etc |
| Priority  | Medium  |
| Dependencies  | Database |
| Expected results  | Server will provide a list of foods available, presorted based on location, radius, or item type etc  |
| Exception handling  | N/A |

| Section  | Description |
| ------------- | ------------- |
| ID, type and title  | I2.01 - Notifications  |
| Description  | Users receive a notification when food they are looking for becomes available |
| Priority  | Medium  |
| Dependencies  | Database  |
| Expected results  | Users will receive a notification when food is available either by an email, or by mobile push notifications |
| Exception handling  | N/A |
