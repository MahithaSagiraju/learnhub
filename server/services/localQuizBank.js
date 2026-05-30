const quizBank = {
  javascript: [
    { question: 'What does `typeof null` return?', options: ['"null"', '"object"', '"undefined"', '"boolean"'], correctAnswer: 1, explanation: 'typeof null returns "object" in JavaScript — this is a known language bug from its first implementation.' },
    { question: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0, explanation: 'push() adds one or more elements to the end of an array and returns the new length.' },
    { question: 'What is the difference between `==` and `===`?', options: ['No difference', '=== checks value only', '=== checks both value and type', '== checks both value and type'], correctAnswer: 2, explanation: '=== (strict equality) checks both value and type without type coercion. == performs type coercion before comparison.' },
    { question: 'What is a closure in JavaScript?', options: ['A way to close the browser', 'A function with access to its outer scope', 'A type of loop', 'A built-in object'], correctAnswer: 1, explanation: 'A closure is a function that retains access to its lexical scope even when executed outside that scope.' },
    { question: 'What does the `map()` method return?', options: ['A new array', 'The original array modified', 'A boolean', 'A string'], correctAnswer: 0, explanation: 'map() creates a new array populated with the results of calling a provided function on every element.' },
    { question: 'What is `NaN` in JavaScript?', options: ['A string', 'A number that is not a legal number', 'An object', 'A boolean'], correctAnswer: 1, explanation: 'NaN stands for "Not a Number" and is a numeric value representing an unrepresentable or invalid number.' },
    { question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'const', 'Both let and const'], correctAnswer: 3, explanation: 'Both let and const are block-scoped. var is function-scoped, not block-scoped.' },
    { question: 'What is the event loop?', options: ['A loop that handles DOM events', 'A mechanism that handles async callbacks', 'A type of for loop', 'A browser API'], correctAnswer: 1, explanation: 'The event loop continuously checks the call stack and task queues, pushing callbacks to the stack when empty.' },
  ],
  python: [
    { question: 'What is a list comprehension?', options: ['A list of functions', 'A concise way to create lists', 'A way to understand code', 'A debugging tool'], correctAnswer: 1, explanation: 'List comprehensions provide a concise syntax for creating lists, e.g., [x**2 for x in range(10)].' },
    { question: 'What does `len()` return for a string?', options: ['Number of characters', 'Memory size', 'Number of words', 'Number of lines'], correctAnswer: 0, explanation: 'len() returns the number of items in a container. For strings, it returns the character count.' },
    { question: 'What is the difference between a list and a tuple?', options: ['Tuples are immutable, lists are mutable', 'Lists are immutable, tuples are mutable', 'No difference', 'Tuples can only contain numbers'], correctAnswer: 0, explanation: 'Tuples are immutable (cannot be changed after creation), while lists are mutable.' },
    { question: 'What does `range(5)` generate?', options: ['[1,2,3,4,5]', '[0,1,2,3,4]', '[0,1,2,3,4,5]', '[1,2,3,4]'], correctAnswer: 1, explanation: 'range(n) generates numbers from 0 to n-1. So range(5) gives 0,1,2,3,4.' },
    { question: 'What is a decorator in Python?', options: ['A design pattern', 'A function that modifies another function', 'A class method', 'A type annotation'], correctAnswer: 1, explanation: 'A decorator is a function that takes another function and extends its behavior without modifying it.' },
    { question: 'What is PEP 8?', options: ['A Python library', 'Python\'s style guide', 'A Python version', 'An IDE plugin'], correctAnswer: 1, explanation: 'PEP 8 is Python\'s official style guide, providing conventions for writing readable Python code.' },
    { question: 'How do you handle exceptions in Python?', options: ['try/except', 'try/catch', 'try/finally', 'catch/throw'], correctAnswer: 0, explanation: 'Python uses try/except blocks for exception handling, unlike JavaScript which uses try/catch.' },
  ],
  java: [
    { question: 'What is the JVM?', options: ['Java Virtual Method', 'Java Virtual Machine', 'Java Visual Manager', 'Java Version Model'], correctAnswer: 1, explanation: 'JVM (Java Virtual Machine) runs Java bytecode, providing platform independence.' },
    { question: 'What does `public static void main(String[] args)` represent?', options: ['A class constructor', 'The entry point of a Java program', 'A method overload', 'An interface definition'], correctAnswer: 1, explanation: 'The main method is the entry point of any Java application. JVM calls main() to start execution.' },
    { question: 'What is inheritance in Java?', options: ['Creating a new class from an existing class', 'Copying code from one class to another', 'Calling methods from another class', 'Importing packages'], correctAnswer: 0, explanation: 'Inheritance allows a class to inherit fields and methods from another class using the extends keyword.' },
    { question: 'What is the difference between abstract class and interface?', options: ['No difference', 'Abstract class can have concrete methods, interface cannot (before Java 8)', 'Interface can have concrete methods, abstract class cannot', 'Abstract classes cannot have methods'], correctAnswer: 1, explanation: 'Abstract classes can have both abstract and concrete methods. Before Java 8, interfaces could only have abstract methods.' },
    { question: 'What does `final` keyword do on a variable?', options: ['Makes it mutable', 'Makes it constant', 'Makes it static', 'Makes it public'], correctAnswer: 1, explanation: 'A final variable cannot be reassigned after initialization, making it a constant.' },
    { question: 'What is garbage collection in Java?', options: ['Manual memory cleanup', 'Automatic memory management', 'A method to delete files', 'A collection of garbage items'], correctAnswer: 1, explanation: 'Java\'s garbage collector automatically identifies and removes objects no longer referenced.' },
  ],
  "c++": [
    { question: 'What is a pointer in C++?', options: ['A reference to an object', 'A variable that stores a memory address', 'A type of array', 'A function parameter'], correctAnswer: 1, explanation: 'A pointer stores the memory address of another variable, enabling direct memory manipulation.' },
    { question: 'What does the `new` operator do?', options: ['Creates a new variable', 'Allocates memory on the heap', 'Allocates memory on the stack', 'Deletes a variable'], correctAnswer: 1, explanation: 'The new operator allocates memory on the heap and returns a pointer to the allocated memory.' },
    { question: 'What is operator overloading?', options: ['Using operators in expressions', 'Giving operators special meanings for user-defined types', 'Creating new operators', 'Deleting existing operators'], correctAnswer: 1, explanation: 'Operator overloading allows defining custom behavior for operators when used with user-defined types.' },
    { question: 'What is RAII?', options: ['Resource Allocation Is Immediate', 'Resource Acquisition Is Initialization', 'Random Access Iterator Implementation', 'Rapid Application Integration Interface'], correctAnswer: 1, explanation: 'RAII binds resource lifecycle to object lifetime — resources are acquired in constructor and released in destructor.' },
    { question: 'What is a virtual function?', options: ['A function that is simulated', 'A function that can be overridden in derived classes', 'A function that does nothing', 'A function that runs virtually'], correctAnswer: 1, explanation: 'Virtual functions enable runtime polymorphism by allowing derived classes to override base class methods.' },
  ],
  react: [
    { question: 'What is JSX?', options: ['A database query language', 'A syntax extension for JavaScript', 'A CSS framework', 'A build tool'], correctAnswer: 1, explanation: 'JSX is a syntax extension that lets you write HTML-like markup in JavaScript, transpiled to React.createElement calls.' },
    { question: 'What is the virtual DOM?', options: ['A DOM in a virtual machine', 'A lightweight copy of the real DOM for efficient updates', 'A browser extension', 'A debugging tool'], correctAnswer: 1, explanation: 'The virtual DOM is an in-memory representation of the real DOM. React compares it with the real DOM to apply minimal updates.' },
    { question: 'What does `useState` return?', options: ['A single value', 'An array with the state value and a setter function', 'An object with methods', 'A boolean'], correctAnswer: 1, explanation: 'useState returns an array with two elements: the current state value and a function to update it.' },
    { question: 'What is a React component?', options: ['A CSS class', 'A reusable piece of UI', 'A JavaScript file', 'An HTML template'], correctAnswer: 1, explanation: 'Components are independent, reusable pieces of UI that accept inputs (props) and return React elements.' },
    { question: 'What is the purpose of `useEffect`?', options: ['To create side effects in components', 'To fetch data synchronously', 'To style components', 'To define event handlers'], correctAnswer: 0, explanation: 'useEffect lets you perform side effects in function components, like data fetching, subscriptions, or DOM manipulation.' },
    { question: 'What are props in React?', options: ['Data stored in component state', 'Read-only inputs passed to a component', 'Local variables', 'Global variables'], correctAnswer: 1, explanation: 'Props (short for properties) are read-only inputs passed from parent to child components.' },
    { question: 'What is the key prop used for in lists?', options: ['For CSS styling', 'To help React identify changed items', 'For database keys', 'For encryption'], correctAnswer: 1, explanation: 'Keys help React identify which items in a list have changed, been added, or removed for efficient re-rendering.' },
  ],
  nodejs: [
    { question: 'What is Node.js?', options: ['A JavaScript framework', 'A JavaScript runtime built on Chrome\'s V8 engine', 'A database', 'A CSS preprocessor'], correctAnswer: 1, explanation: 'Node.js is a cross-platform JavaScript runtime that executes JavaScript outside the browser using the V8 engine.' },
    { question: 'What is npm?', options: ['Node Package Manager', 'Node Process Monitor', 'Node Performance Module', 'New Programming Method'], correctAnswer: 0, explanation: 'npm is the default package manager for Node.js, providing access to thousands of open-source packages.' },
    { question: 'What does `require()` do?', options: ['Imports modules', 'Creates files', 'Makes HTTP requests', 'Installs packages'], correctAnswer: 0, explanation: 'require() imports modules, JSON, and local files into your Node.js application (CommonJS module system).' },
    { question: 'What is the event loop in Node.js?', options: ['A browser feature', 'A mechanism processing callbacks and async operations', 'A type of loop', 'A database query'], correctAnswer: 1, explanation: 'Node.js event loop processes asynchronous callbacks, enabling non-blocking I/O operations.' },
    { question: 'What is Express.js?', options: ['A database library', 'A web framework for Node.js', 'A testing tool', 'A frontend framework'], correctAnswer: 1, explanation: 'Express.js is a minimal, flexible web application framework providing robust features for building web APIs.' },
    { question: 'What is middleware in Express?', options: ['Database connection code', 'Functions executed during the request-response cycle', 'A type of route', 'Error handling code'], correctAnswer: 1, explanation: 'Middleware functions have access to request and response objects and can modify them or end the request-response cycle.' },
  ],
  html: [
    { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 0, explanation: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages.' },
    { question: 'Which tag creates a hyperlink?', options: ['<link>', '<a>', '<href>', '<url>'], correctAnswer: 1, explanation: 'The <a> (anchor) tag creates hyperlinks. The href attribute specifies the destination URL.' },
    { question: 'What does the <head> element contain?', options: ['The page content', 'Metadata about the document', 'The footer', 'Navigation links'], correctAnswer: 1, explanation: 'The <head> element contains metadata like title, character set, styles, and scripts.' },
    { question: 'Which tag is used for an unordered list?', options: ['<ol>', '<list>', '<ul>', '<li>'], correctAnswer: 2, explanation: '<ul> defines an unordered (bulleted) list. Each list item is wrapped in <li>.' },
    { question: 'What is the purpose of the `alt` attribute in images?', options: ['To add animation', 'To provide alternative text for accessibility', 'To change image size', 'To add a border'], correctAnswer: 1, explanation: 'The alt attribute provides a text alternative for screen readers and is shown when the image fails to load.' },
  ],
  css: [
    { question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correctAnswer: 1, explanation: 'CSS (Cascading Style Sheets) describes how HTML elements are displayed on screen, paper, or other media.' },
    { question: 'Which property changes the background color?', options: ['color', 'background-color', 'bgcolor', 'background'], correctAnswer: 1, explanation: 'background-color sets the background color of an element. The shorthand background property can also set it.' },
    { question: 'What is the box model?', options: ['A physical box', 'Content, padding, border, and margin layers', 'A CSS file structure', 'A layout technique'], correctAnswer: 1, explanation: 'The CSS box model describes every element as a rectangular box with content, padding, border, and margin layers.' },
    { question: 'What does `display: flex` do?', options: ['Makes text flexible', 'Creates a flex container for layout', 'Hides the element', 'Adds flexibility to an element'], correctAnswer: 1, explanation: 'display: flex turns an element into a flex container, enabling flexible responsive layouts with flexbox.' },
    { question: 'What is the difference between class and ID selectors?', options: ['No difference', 'IDs are unique, classes can be reused', 'Classes are unique, IDs can be reused', 'IDs start with dot, classes with hash'], correctAnswer: 1, explanation: 'An ID should be unique per page (#id), while a class can be reused across multiple elements (.class).' },
  ],
  mongodb: [
    { question: 'What type of database is MongoDB?', options: ['Relational', 'NoSQL document database', 'Graph database', 'Key-value store'], correctAnswer: 1, explanation: 'MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents.' },
    { question: 'What is a collection in MongoDB?', options: ['A group of databases', 'A group of documents', 'A schema definition', 'A query result'], correctAnswer: 1, explanation: 'A collection is a grouping of MongoDB documents, analogous to a table in relational databases.' },
    { question: 'What does `find()` return?', options: ['A single document', 'A cursor to documents', 'An array of documents', 'A boolean'], correctAnswer: 1, explanation: 'find() returns a cursor that lazily iterates over matching documents. Use toArray() or forEach() to access results.' },
    { question: 'What is an ObjectId in MongoDB?', options: ['A user-defined ID', 'A 12-byte default unique identifier', 'A string ID', 'An integer ID'], correctAnswer: 1, explanation: 'ObjectId is a 12-byte BSON type used as the default _id, containing timestamp, machine ID, process ID, and counter.' },
    { question: 'What is indexing used for in MongoDB?', options: ['To organize documents', 'To speed up queries', 'To validate data', 'To encrypt data'], correctAnswer: 1, explanation: 'Indexes support efficient query execution by reducing the number of documents scanned during queries.' },
  ],
  sql: [
    { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], correctAnswer: 0, explanation: 'SQL (Structured Query Language) is the standard language for managing and querying relational databases.' },
    { question: 'Which statement retrieves data from a table?', options: ['GET', 'FETCH', 'SELECT', 'RETRIEVE'], correctAnswer: 2, explanation: 'SELECT is used to query and retrieve data from one or more database tables.' },
    { question: 'What is a primary key?', options: ['The first column in a table', 'A unique identifier for each row', 'A foreign key reference', 'An indexed column'], correctAnswer: 1, explanation: 'A primary key uniquely identifies each row in a table. It must contain unique values and cannot be NULL.' },
    { question: 'What does JOIN do?', options: ['Combines rows from two tables', 'Adds a column to a table', 'Deletes a table', 'Creates a new table'], correctAnswer: 0, explanation: 'JOIN combines rows from two or more tables based on a related column between them.' },
    { question: 'What is a foreign key?', options: ['A key to a foreign table', 'A field linking to a primary key in another table', 'A special type of index', 'A unique constraint'], correctAnswer: 1, explanation: 'A foreign key is a column that creates a link between data in two tables by referencing the primary key of another table.' },
  ],
  typescript: [
    { question: 'What is TypeScript?', options: ['A new programming language', 'A typed superset of JavaScript', 'A CSS preprocessor', 'A database language'], correctAnswer: 1, explanation: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript, adding static type checking.' },
    { question: 'What does `: string` mean in TypeScript?', options: ['A string method', 'A type annotation indicating the variable holds a string', 'A template literal', 'A string function'], correctAnswer: 1, explanation: 'Type annotations in TypeScript declare the expected type of variables, function parameters, and return values.' },
    { question: 'What is an interface in TypeScript?', options: ['A UI component', 'A structure defining the shape of an object', 'A class method', 'A type of function'], correctAnswer: 1, explanation: 'An interface defines the structure that an object must conform to, specifying property names and types.' },
    { question: 'What does the `?` after a property name mean?', options: ['The property is required', 'The property is optional', 'The property is read-only', 'The property is private'], correctAnswer: 1, explanation: 'A ? makes a property optional, meaning it may be undefined and is not required when creating the object.' },
  ],
  git: [
    { question: 'What is Git?', options: ['A GitHub feature', 'A distributed version control system', 'A code editor', 'A programming language'], correctAnswer: 1, explanation: 'Git is a distributed version control system that tracks changes in source code during software development.' },
    { question: 'What does `git commit` do?', options: ['Deletes changes', 'Saves changes to the local repository', 'Uploads to GitHub', 'Creates a new branch'], correctAnswer: 1, explanation: 'git commit records changes to the local repository with a descriptive message.' },
    { question: 'What is a branch in Git?', options: ['A split in the repository', 'A separate line of development', 'A file copy', 'A backup'], correctAnswer: 1, explanation: 'A branch is a movable pointer to a specific commit, allowing parallel development without affecting the main codebase.' },
    { question: 'What does `git merge` do?', options: ['Deletes a branch', 'Combines changes from different branches', 'Creates a new repository', 'Updates remote tracking'], correctAnswer: 1, explanation: 'git merge integrates changes from one branch into another, combining their commit histories.' },
    { question: 'What is the difference between Git and GitHub?', options: ['They are the same', 'Git is a tool, GitHub is a hosting service', 'GitHub is a tool, Git is a service', 'No difference'], correctAnswer: 1, explanation: 'Git is a version control system you run locally. GitHub is a cloud platform that hosts Git repositories.' },
  ],
  mongodb: [
    { question: 'What does MongoDB use to store data?', options: ['Tables', 'Documents (BSON)', 'Key-value pairs', 'Graphs'], correctAnswer: 1, explanation: 'MongoDB stores data as BSON documents (binary JSON), providing a flexible schema.' },
    { question: 'What is a replica set in MongoDB?', options: ['A backup strategy', 'A group of MongoDB instances maintaining the same data', 'A query type', 'An indexing method'], correctAnswer: 1, explanation: 'A replica set provides redundancy and high availability by replicating data across multiple MongoDB servers.' },
    { question: 'What is sharding in MongoDB?', options: ['Dividing data across multiple servers', 'Creating backups', 'Optimizing queries', 'Compressing data'], correctAnswer: 0, explanation: 'Sharding distributes data across multiple machines horizontally, enabling large-scale data storage.' },
  ],
  express: [
    { question: 'What is Express.js middleware?', options: ['A database layer', 'Functions that execute during request processing', 'A type of route', 'Error handling only'], correctAnswer: 1, explanation: 'Middleware functions have access to req, res, and next, and can execute code, modify req/res, or end the cycle.' },
    { question: 'How do you define a route in Express?', options: ['app.route()', 'app.get(), app.post(), etc.', 'express.route()', 'router.create()'], correctAnswer: 1, explanation: 'Express provides HTTP method-specific methods like app.get(), app.post(), app.put(), and app.delete() for routing.' },
    { question: 'What does `app.use()` do?', options: ['Installs a plugin', 'Mounts middleware at a specified path', 'Creates a server', 'Starts the application'], correctAnswer: 1, explanation: 'app.use() mounts middleware functions at a path. Without a path, it runs on every request.' },
    { question: 'What is `res.json()`?', options: ['Sends a JSON file', 'Sends a JSON response', 'Parses JSON body', 'Validates JSON'], correctAnswer: 1, explanation: 'res.json() sends a JSON response with the correct Content-Type header.' },
  ],
  "data structures": [
    { question: 'What is a stack?', options: ['A FIFO data structure', 'A LIFO data structure', 'A sorted list', 'A tree structure'], correctAnswer: 1, explanation: 'A stack follows Last-In-First-Out (LIFO) — the last element added is the first removed.' },
    { question: 'What is a queue?', options: ['A LIFO data structure', 'A FIFO data structure', 'An unordered collection', 'A graph'], correctAnswer: 1, explanation: 'A queue follows First-In-First-Out (FIFO) — the first element added is the first removed.' },
    { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1, explanation: 'Binary search has O(log n) time complexity, halving the search space with each comparison.' },
    { question: 'What is a hash table?', options: ['A sorted array', 'A data structure mapping keys to values', 'A tree structure', 'A linked list'], correctAnswer: 1, explanation: 'A hash table stores key-value pairs and uses a hash function to compute an index for fast lookups.' },
    { question: 'What is a linked list?', options: ['A contiguous array in memory', 'A sequence of nodes with references to the next node', 'A tree structure', 'A hash-based collection'], correctAnswer: 1, explanation: 'A linked list consists of nodes where each node contains data and a pointer/reference to the next node.' },
  ],
};

const fallbackTemplates = [
  {
    generate: (topic) => ({
      question: `What is ${topic} primarily used for?`,
      options: [`Building web applications`, `Data analysis and processing`, `Creating ${topic} related solutions`, `System administration`],
      correctAnswer: 2,
      explanation: `${topic} is a technology used for building solutions and applications in its domain.`
    })
  },
  {
    generate: (topic) => ({
      question: `Which of the following best describes ${topic}?`,
      options: [
        `A programming language`,
        `A software tool or framework`,
        `A ${topic} is a technology used in software development`,
        `An operating system`
      ],
      correctAnswer: 2,
      explanation: `${topic} refers to a technology or concept used in software development and computing.`
    })
  },
  {
    generate: (topic) => ({
      question: `What is a key feature of ${topic}?`,
      options: [`High performance and scalability`, `Easy to learn syntax`, `Cross-platform compatibility`, `All of the above are common features`],
      correctAnswer: 3,
      explanation: `Most technologies aim to provide performance, usability, and compatibility as key features.`
    })
  },
  {
    generate: (topic) => ({
      question: `In which context is ${topic} most commonly used?`,
      options: [`Web development`, `Mobile development`, `Data science`, `It depends on the specific technology`],
      correctAnswer: 3,
      explanation: `The usage context of ${topic} depends on what specific technology or concept it refers to.`
    })
  },
  {
    generate: (topic) => ({
      question: `What is a common alternative to ${topic}?`,
      options: [`There are many alternatives depending on use case`, `It has no alternatives`, `A completely different technology`, `An older version`],
      correctAnswer: 0,
      explanation: `Most technologies have alternatives that may be better suited for different use cases.`
    })
  },
];

export const getLocalQuiz = (topic, numQuestions = 5) => {
  const key = topic.toLowerCase().trim();
  const bankQuestions = quizBank[key];

  if (bankQuestions && bankQuestions.length >= numQuestions) {
    const shuffled = [...bankQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numQuestions);
  }

  const questions = [];
  if (bankQuestions) {
    const shuffled = [...bankQuestions].sort(() => Math.random() - 0.5);
    questions.push(...shuffled);
  }

  const templates = [...fallbackTemplates].sort(() => Math.random() - 0.5);
  for (let i = 0; i < templates.length && questions.length < numQuestions; i++) {
    const q = templates[i].generate(topic);
    if (!questions.find(ex => ex.question === q.question)) {
      questions.push(q);
    }
  }

  return questions.slice(0, numQuestions);
};
