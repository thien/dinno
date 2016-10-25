## Background
_Reducing food waste through food sharing_

Every year tonnes of food go to waste in the UK. Most of the time people throw food away simply because they don’t like them, they are expired, or they bought them by mistake. There are many generous people in this world and they would love to give their unwanted food to those who need them. Easy to use software may facilitate food sharing in communities. Your task is to think of a simple IT solution that promotes food sharing in communities. A software solution that can operate on different portable devices, such as a mobile phone, iPad, Tablet, etc., is highly recommended. The software should include functionalities to allow geographically closed people to post their unwanted food, and for other people to search and find them and arrange a collection time and location. You are asked to come up with the design, implementation and testing of the software.

# Project scope
<!-- Specify the exact project scope indicating project boundaries. This can also include the purpose of the software project, its benefits and overall goals. In the case of a software product, this should contain product vision and should indicate the exact user base for the product. If you are aware of features that should go into a future version, list them here or add a new section on “Features for Future Releases” -->

Purpose of Software Project

- provide an internet based solution
	- responsive front end interface
	- secure and reliable backend compoment
- provide a user friendly interface
- allows users to post unwanted food
	- through an easy to use form

## Basic Deliverables
- provide an internet based solution
	- responsive front end interface
	- secure and reliable backend compoment
- data should be stored securely in a database management system.
- allow the user to register and access members area in order to perform the following:
	- add, edit, remove items
	- a method for members to view their past and present items
	- upload files and photos as desired
- Add a messaging functionality to promote secure communication between members.
- Search functionality based on a combination of keywords, such as item name, location,
quantity, etc.
- An interactive way for users to rearrange search result (such as sorting) without refreshing
the page.
- The software should be responsive, usable, accessible, easy to use, robust, and secure.
- The software should run on mobile devices without users making adjustments to their
devices.

## Immediate Deliverables
- Allow members to use the system (this includes managing their account and items) on various mobile devices such as mobile phones, iPad, tablet, etc.
- Further improvement to the search functionality should include but not limited to filtering and sorting results based on location, radius, item type, etc.
- A facility for users to receive notification on selected items once they are made available by other members.
- To practise good citizenship and software ethics, everything will be released under a GNU AGPLv3 free software license (Free Software Foundation 2007) and made available on a public repository such as GitLab (https://about.gitlab.com/).
- You are required to establish further deliverables and make appropriate recommendations to your client.

## Advanced Deliverables
- A functionality to allow users to scan item bar, retrieve item’s details, and store appropriate information in the database. This facility should be an alternative to users inputting item’s details to form.
- Advanced search functionality such as displaying results on an interactive map.
- Intelligent system to analyse members’ wastage and provide some recommendations for
users to reduce their food waste.
- A functionality to predict items that are most likely for a user to give them away.
- All code must be extensively and unambiguously commented with documentation files
included with the source.

## Other Deliverables
- Name your product
- Be innovative in your design
- Think of more features and agree with your client before implementing them
- Demonstrate strong evidence of group work. This is a group project!
- Demonstrate high level of professionalism when communicating with your client or demonstrating your solution.

Benefits
Overall Goals

Product Vision
Exact user base for the product.

# Features for Future Releases

# Development approach
<!--  You should briefly but clearly discuss the development approach and consider alternative approaches that you decided to ignore. You should also include the hardware, software, version control systems, testing strategy, etc., in this section. (max one pages) -->


# Hardware:
In terms of hardware, our program will be running on a server that is:
	- capable of having a dedicated connection to the internet
	- capable of handling concurrent users
	- have no ports blocked
	- running on an operating system that allows us to have full reign of the installation of software.
	- allows storage.
This hardware can be either virtually connected or, but at either case they will be provided by the client.

The program will be accessed on any device with web browser support.

# Software:
In terms of software we will be using Node.JS as our preference of backend languages, as this allows us to be expendable in terms of programming potentially useful features, such as engineering mobile apps.

Our team will have their own preference of text editors and IDE's.

Live testing will be performed on modern web browsers and the program must be able to run on at least IE 11+.

# Version Control Systems:
Our choice of a version control system is Git, where a private repository is set up on GitHub. This allows us to collaborate with ease and allows us to see who is responsible for certain sections of code on the system.

# Testing Strategy
In terms of Testing Strategy we have chosen to adopt the dynamic testing approach. White Box Testing will be the chosen method of choice; alongside testing on the fly.

# Alternatives
Alternatives to this would include the LAMP stack (Linux, Apache, MySQL, PHP). This set would be convenient to novice programmers but:
	- this set is limited in its functionality.
	- features that we wish to implement would be laborious and cumbersome to program in this stack. (Push Notification, Mobile Application Implementations)
	- Data will not be able to be pushed on the fly without potentially harming the integrity of the program, or manipulate the data in such a way that causes problems with unnecessarily causing performance issues on the server.

Another possible implementation is revolved around java web development. While this may be very robust to program in, this choice is however much slower to implement and require a lot of resources to run. It is also very difficult to find a host that will accept java applications, which leads to the case that nearly all java web programs are hosted on dedicated servers.