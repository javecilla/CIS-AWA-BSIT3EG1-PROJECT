# Clinic Information System - Patient Management Module

This project is a web application developed for the IT 305W | ADVANCED WEB APPLICATIONS course at Bulacan State University. [cite: 15, 44]

---

## About the Project

The Clinic Information System is designed to solve a common problem for medical clinics: the inefficient and decentralized management of patient records and appointments. [cite: 21] This initial version focuses on the core **Patient Management Module**, which allows patients to register, log in, and book their own appointments online, while also empowering clinic staff to manage walk-in patients and view the daily appointment schedule.

The application utilizes the Create, Read, Update & Delete (CRUD) method for all data operations, with all information securely stored and managed using Firebase services as required by the project specifications. [cite: 20]

### Key Features:

- **Patient Portal:**
  - Secure user registration with email verification and login using Firebase Authentication. [cite: 33]
  - A personal dashboard to view profile information and appointment history.
  - A multi-step form to book new appointments for either a **New Bite Incident** or a **Follow-up/General Consultation**.
- **Staff Portal:**
  - A comprehensive dashboard displaying the list of patient appointments for the day.
  - Functionality to search for existing patients.
  - A dedicated form for staff to register walk-in patients directly.

---

## Technologies Used

This project is built using modern web technologies to ensure a responsive, efficient, and scalable application.

- **Front-End Framework:** [ReactJS](https://reactjs.org/) (with Functional Components and Hooks) [cite: 32]
- **Styling:** [Bootstrap](https://getbootstrap.com/)
- **Icons:** [Font Awesome](https://fontawesome.com/)
- **Backend as a Service (BaaS):** [Firebase](https://firebase.google.com/)
  - **Authentication:** Firebase Authentication for user registration and login. [cite: 33]
  - **Database:** Firebase Realtime Database to store and manage all application data. [cite: 35]
  - **Storage:** Firebase Storage for user profile pictures. [cite: 37]
  - **Hosting:** Firebase Hosting for final deployment. [cite: 38]

---

## About The Team

Our team is composed of five members, each with a specific role to ensure the successful development and delivery of the project. [cite: 18]

| Role                    | Member  | Key Responsibilities                                                                                                                                                                                                                                     |
| :---------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Back-End Developer**  | Jerome  | - Develop and manage all Firebase services (Authentication, Database, Storage).<br>- Create the data structure and security rules. [cite: 36]<br>- Build the backend logic for all features.<br>- Handle project environment setup and final deployment. |
| **Front-End Developer** | Mico    | - Develop public-facing pages (Login, Registration).<br>- Implement the staff-side dashboard and its functionalities.                                                                                                                                    |
| **Front-End Developer** | Rensen  | - Develop private, authenticated patient pages (Dashboard, Appointment Forms).<br>- Implement protected routes for logged-in users. [cite: 34]                                                                                                           |
| **UI/UX Designer**      | Francis | - Design the overall user interface and user experience.<br>- Create high-fidelity mockups and prototypes in Figma.<br>- Ensure the application design is modern, intuitive, and responsive. [cite: 2]                                                   |
| **Quality Assurance**   | Giga    | - Develop and execute test plans based on wireframes and Figma designs.<br>- Perform functional and usability testing.<br>- Identify, document, and track bugs and errors to ensure a fully working system. [cite: 40]                                   |

---

## Sprint Development Plan

The development is organized into sprints to ensure timely delivery of features.

### **Pre-Development (Due by Nov 2)**

| Task                                 | Assigned To | Status      | Due Date |
| :----------------------------------- | :---------- | :---------- | :------- |
| **Wireframe Design**                 | Jerome      | In Progress | Oct 31   |
| **Environment Setup**                | Jerome      | In Progress | Oct 31   |
| **QA - Test Case Basis (Wireframe)** | Giga        | Pending     | Nov 1    |
| **Figma High-Fidelity Design**       | Francis     | Pending     | Nov 2    |
| **QA - Test Case Basis (Figma)**     | Giga        | Pending     | Nov 2    |

### **Sprint 1: Core Authentication & Foundation (Nov 3 - Nov 7)**

_Goal: Establish the basic user registration and login functionality and set up authenticated pages._

| Task                                          | Assigned To | Status  | Due Date |
| :-------------------------------------------- | :---------- | :------ | :------- |
| **FE: Login Page UI & Validation**            | Mico        | Pending | Nov 3    |
| **FE: Registration Page UI & Validation**     | Mico        | Pending | Nov 4    |
| **BE: Login with Firebase Auth**              | Jerome      | Pending | Nov 4    |
| **BE: Registration with Firebase DB**         | Jerome      | Pending | Nov 5    |
| **FE: Staff Authenticated Dashboard Shell**   | Rensen      | Pending | Nov 6    |
| **FE: Patient Authenticated Dashboard Shell** | Rensen      | Pending | Nov 7    |

### **Sprint 2: Patient Portal Features (Nov 8 - Nov 14)**

_Goal: Build out the core functionalities for the logged-in patient._

| Task                                    | Assigned To | Status  | Due Date |
| :-------------------------------------- | :---------- | :------ | :------- |
| **FE: Patient Dashboard UI**            | Rensen      | Pending | Nov 10   |
| **BE: Fetch Patient Profile Data**      | Jerome      | Pending | Nov 10   |
| **FE: Appointment Form (New Incident)** | Rensen      | Pending | Nov 12   |
| **BE: Save New Incident Appointment**   | Jerome      | Pending | Nov 13   |
| **FE: Appointment History Table**       | Rensen      | Pending | Nov 14   |
| **BE: Fetch Appointment History**       | Jerome      | Pending | Nov 14   |

### **Sprint 3: Staff Portal Features (Nov 15 - Nov 21)**

_Goal: Develop the essential tools for clinic staff to manage patients._

| Task                                          | Assigned To | Status  | Due Date |
| :-------------------------------------------- | :---------- | :------ | :------- |
| **FE: Staff Dashboard UI (Appointment List)** | Mico        | Pending | Nov 17   |
| **BE: Fetch Daily Appointments**              | Jerome      | Pending | Nov 17   |
| **FE: Walk-in Registration Form (Full)**      | Mico        | Pending | Nov 19   |
| **BE: Staff-side Patient Registration**       | Jerome      | Pending | Nov 20   |
| **FE: Patient Search Functionality**          | Mico        | Pending | Nov 21   |
| **BE: Search Patient Endpoint**               | Jerome      | Pending | Nov 21   |

### **Sprint 4: Refinement, QA & Deployment (Nov 22 - Nov 28)**

_Goal: Integrate final designs, add remaining features, conduct thorough testing, and deploy._

| Task                                      | Assigned To  | Status  | Due Date |
| :---------------------------------------- | :----------- | :------ | :------- |
| **FE: Implement Figma Designs**           | Mico, Rensen | Pending | Nov 24   |
| **BE: Firebase Storage for Profile Pics** | Jerome       | Pending | Nov 24   |
| **QA: Full System Functional Testing**    | Giga         | Pending | Nov 26   |
| **Dev: Bug Fixing & Final Revisions**     | All Devs     | Pending | Nov 27   |
| **Deployment to Firebase Hosting**        | Jerome       | Pending | Nov 28   |
