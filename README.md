# Clinic Information System - Patient Management Module

This project is a web application developed for the IT 305W | ADVANCED WEB APPLICATIONS course at Bulacan State University.

---

## About the Project

The Clinic Information System is designed to solve a common problem for medical clinics: the inefficient and decentralized management of patient records and appointments. This initial version focuses on the core **Patient Management Module**, which allows patients to register, log in, and book their own appointments online, while also empowering clinic staff to manage walk-in patients and view the daily appointment schedule.

The application utilizes the Create, Read, Update & Delete (CRUD) method for all data operations, with all information securely stored and managed using Firebase services as required by the project specifications.

### Key Features:

- **Patient Portal:**
  - Secure user registration with email verification and login using Firebase Authentication.
  - A personal dashboard to view profile information and appointment history.
  - A multi-step form to book new appointments for either a **New Bite Incident** or a **Follow-up/General Consultation**.
- **Staff Portal:**
  - A comprehensive dashboard displaying the list of patient appointments for the day.
  - Functionality to search for existing patients.
  - A dedicated form for staff to register walk-in patients directly.

---

## Technologies Used

This project is built using modern web technologies to ensure a responsive, efficient, and scalable application.

- **Front-End Framework:** [ReactJS](https://reactjs.org/) (with Functional Components and Hooks)
- **Styling:** [Bootstrap](https://getbootstrap.com/)
- **Icons:** [Font Awesome](https://fontawesome.com/)
- **Backend as a Service (BaaS):** [Firebase](https://firebase.google.com/)
  - **Authentication:** Firebase Authentication for user registration and login.
  - **Database:** Firebase Realtime Database to store and manage all application data.
  - **Storage:** Firebase Storage for user profile pictures.
  - **Hosting:** Firebase Hosting for final deployment.

---

## About The Team

Our team is composed of five members, each with a specific role to ensure the successful development and delivery of the project.

| Role                    | Member  | Key Responsibilities                                                                                                                                                                                                                           |
| :---------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Back-End Developer**  | Jerome  | - Develop and manage all Firebase services (Authentication, Database, Storage).<br>- Create the data structure and security rules. <br>- Build the backend logic for all features.<br>- Handle project environment setup and final deployment. |
| **Front-End Developer** | Mico    | - Develop public-facing pages (Login, Registration).<br>- Implement the staff-side dashboard and its functionalities.                                                                                                                          |
| **Front-End Developer** | Rensen  | - Develop private, authenticated patient pages (Dashboard, Appointment Forms).<br>- Implement protected routes for logged-in users.                                                                                                            |
| **UI/UX Designer**      | Francis | - Design the overall user interface and user experience.<br>- Create high-fidelity mockups and prototypes in Figma.<br>- Ensure the application design is modern, intuitive, and responsive.                                                   |
| **Quality Assurance**   | Giga    | - Develop and execute test plans based on wireframes and Figma designs.<br>- Perform functional and usability testing.<br>- Identify, document, and track bugs and errors to ensure a fully working system.                                    |

---

## Project Documentation

This section contains important guides for team members to follow.

- **[Firebase Setup Guide](./docs/FIREBASE.md)**: A complete guide on how to set up the Firebase project, including Hosting, Realtime Database, and Authentication.
- **[Team Coding Standards](./docs/STANDARDS.md)**: The official rules for file structure, naming conventions, and code style that all developers (Mico, Rensen, Jerome) must follow.

---

## Sprint Development Plan

The development is organized into sprints to ensure timely delivery of features within the project deadline of November 14.

### **Pre-Development & Design Finalization (Ends Nov 2)**

_Goal: Finalize the design and test cases so developers can start immediately._

| Task                           | Assigned To | Priority | Due Date     | Remarks  |
| :----------------------------- | :---------- | :------- | :----------- | :------- |
| **Wireframe Design**           | Jerome      | Done     | Oct 31 (Fri) | **Done** |
| **Environment Setup**          | Jerome      | Done     | Oct 31 (Fri) | **Done** |
| **Figma High-Fidelity Design** | Francis     | **High** | Nov 2 (Sun)  | Pending  |
| **QA - Test Case Creation**    | Giga        | Medium   | Nov 2 (Sun)  | Pending  |

### **Sprint 1: MVP - Core Authentication & Patient Portal (Nov 3 - Nov 8)**

_Goal: Build the end-to-end patient experience. This is the highest priority to get a working product._

| Task                                         | Assigned To | Priority | Due Date    | Remarks |
| :------------------------------------------- | :---------- | :------- | :---------- | :------ |
| **FE: Login & Registration Pages**           | Mico        | **High** | Nov 4 (Tue) | Pending |
| **BE: Firebase Auth & User DB**              | Jerome      | **High** | Nov 5 (Wed) | Pending |
| **QA: Test Authentication Flow**             | Giga        | Medium   | Nov 6 (Thu) | Pending |
| **FE: Patient Dashboard & Appointment Form** | Rensen      | **High** | Nov 7 (Fri) | Pending |
| **BE: Save & Fetch Appointment Data**        | Jerome      | **High** | Nov 8 (Sat) | Pending |
| **QA: Test Patient Appointment Flow**        | Giga        | Medium   | Nov 8 (Sat) | Pending |

### **Sprint 2: Staff Portal & Final Features (Nov 9 - Nov 14)**

_Goal: Build staff tools, integrate everything, conduct final testing, and submit._

| Task                                       | Assigned To | Priority | Due Date     | Remarks |
| :----------------------------------------- | :---------- | :------- | :----------- | :------ |
| **FE: Staff Dashboard (Appointment List)** | Mico        | **High** | Nov 10 (Mon) | Pending |
| **BE: Fetch Appointments for Staff View**  | Jerome      | **High** | Nov 10 (Mon) | Pending |
| **FE: Walk-in Patient Registration Form**  | Mico        | Medium   | Nov 11 (Tue) | Pending |
| **BE: Staff-side Patient Registration**    | Jerome      | Medium   | Nov 11 (Tue) | Pending |
| **BE: Firebase Storage for Profile Pics**  | Jerome      | Normal   | Nov 12 (Wed) | Pending |
| **QA: Full System Functional Testing**     | Giga        | **High** | Nov 13 (Thu) | Pending |
| **All Devs: Final Bug Fixing & Polish**    | All Devs    | **High** | Nov 14 (Fri) | Pending |
| **Final Project Submission**               | Jerome      | **High** | Nov 14 (Fri) | Pending |
