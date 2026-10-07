export type BookStatus = 'reading' | 'read' | 'want' | 'paused';

export interface Book {
    title: string;
    author: string;
    status: BookStatus;
    link?: string;
    note?: string;
}

export const books: Book[] = [
    // Reading
    { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", status: "reading" },

    // Read
    { title: "Atomic Habits", author: "James Clear", status: "read" },
    { title: "Zero to One", author: "Peter Thiel, Blake Masters", status: "read" },
    { title: "The Phoenix Project", author: "Gene Kim, Kevin Behr, George Spafford", status: "read" },
    { title: "Dark Matter", author: "Blake Crouch", status: "read" },
    { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", status: "read" },
    { title: "The Psychology of Money", author: "Morgan Housel", status: "read" },
    { title: "The Art of Spending Money", author: "Morgan Housel", status: "read" },
    { title: "The Courage to Be Disliked", author: "Ichiro Kishimi, Fumitake Koga", status: "read" },
    { title: "Never Split the Difference", author: "Chris Voss, Tahl Raz", status: "read" },
    { title: "Influence: The Psychology of Persuasion", author: "Robert B. Cialdini", status: "read" },
    { title: "Sapiens", author: "Yuval Noah Harari", status: "read" },
    { title: "Homo Deus", author: "Yuval Noah Harari", status: "read" },

    // Want to read
    { title: "Shoe Dog", author: "Phil Knight", status: "want" },
    { title: "Rust Atomics and Locks", author: "Mara Bos", status: "want" },
    { title: "Why Nations Fail", author: "Daron Acemoglu, James A. Robinson", status: "want" },
    { title: "Recursion", author: "Blake Crouch", status: "want" },

    // Left halfway
    { title: "Poor Charlie's Almanack", author: "Charlie Munger", status: "paused" },
    { title: "The Rational Optimist", author: "Matt Ridley", status: "paused" },
    { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", status: "paused" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "paused" },
    { title: "The 48 Laws of Power", author: "Robert Greene", status: "paused" },
    { title: "The Art of Seduction", author: "Robert Greene", status: "paused" },
];
