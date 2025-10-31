### V. Code Standards and Conventions

To ensure a clean, maintainable, and collaborative codebase, all team members (Jerome, Mico, Rensen) must adhere to the following standards:

#### **A. File Structure and Naming Conventions**

| Area                      | Rule                                                                   | Example                                                                      |
| :------------------------ | :--------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Component Directory**   | Every major component must live in its own dedicated folder.           | `components/UserCard/`                                                       |
| **Component Entry Point** | Use a clean `index.js` file for exporting the component.               | `components/UserCard/index.js` -> `export { default } from './UserCard.jsx'` |
| **General Pages**         | All pages must be grouped under the `pages/` folder.                   | `pages/Login/`, `pages/Staff/Dashboard/`                                     |
| **Page Grouping**         | Client-specific pages must go into `pages/Patient/` or `pages/Staff/`. | `pages/Patient/Dashboard.jsx`                                                |
| **Component Naming**      | **PascalCase** (Starts with a capital letter).                         | **Required:** `Navbar`, `PatientCard`. **Rejected:** `navbar`, `user-card`.  |
| **Config/Data Files**     | **Kebab-case** for file names (JS and JSON files).                     | `utils/date-formatter.js`, `data/patient-test-data.json`                     |
| **CSS Files**             | **Kebab-case** or match the component name.                            | `Navbar.css`, `patient-dashboard.css`                                        |
| **Image/Assets**          | **Kebab-case** or **snake_case**. Avoid spaces and PascalCase.         | `assets/logo-clinic.png` or `assets/logo_clinic.png`                         |

#### **B. JavaScript, React, and Component Logic**

| Rule                    | Requirement                                                                                                                            | Example                                                                                                        |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **File Extension**      | All React components must use the **`.jsx`** extension.                                                                                | `Login.jsx`, `Header.jsx`                                                                                      |
| **Prop Destructuring**  | All received props must be immediately destructured in the function signature.                                                         | `function UserCard({ userData, isLoading }) { ... }`                                                           |
| **Default Props**       | All optional props, especially functions, must have explicit default values.                                                           | `function Button({ onClick = () => {} }) { ... }`                                                              |
| **Semicolons**          | **Always use semicolons** at the end of statements for code consistency and safety.                                                    | `const x = 5;`                                                                                                 |
| **Avoid Inline Logic**  | Move complex conditional rendering, filtering, or mapping logic out of the final `return()` block and into a variable.                 | **Bad:** `{data.map(...) }` **Good:** `const renderedItems = data.map(...); return <div>{renderedItems}</div>` |
| **Key Prop**            | The `key` prop is **mandatory** for all elements generated via the `map()` function. Use a stable ID (like the Firebase document key). | `<li key={item.id}>{item.name}</li>`                                                                           |
| **Effect Dependencies** | Always specify all external variables used inside `useEffect` in the dependency array (`[]`).                                          | `useEffect(() => { loadData(userId); }, [userId]);`                                                            |

#### **C. Variable Naming Conventions**

| Type                   | Naming Convention                                           | Example                              |
| :--------------------- | :---------------------------------------------------------- | :----------------------------------- |
| **Standard Variables** | **camelCase**                                               | `const patientData`, `let firstName` |
| **React State**        | **camelCase** using `[value, setValue]`                     | `const [user, setUser]`              |
| **Boolean Flags**      | Must begin with an adjective (e.g., `is`, `has`, `should`). | `const isLoading`, `const hasError`  |
| **Global Constants**   | **SCREAMING_SNAKE_CASE** (For API URLs, MAX attempts, etc.) | `const MAX_LOGIN_ATTEMPTS = 5;`      |

#### **D. Documentation and Commits**

| Rule                | Requirement                                                                                      | Example                                                                                                                                 |
| :------------------ | :----------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Commit Messages** | Use the **Conventional Commits** format: `type(scope): description`.                             | `feat(auth): Add email verification step` <br> `fix(deploy): Resolve build directory mismatch` <br> `refactor(ui): Clean up Navbar CSS` |
| **Code Comments**   | Use clear, concise English comments for complex logic, workarounds, or state manipulation hooks. | `// WORKAROUND: Force a reload because state updates too slowly.`                                                                       |
