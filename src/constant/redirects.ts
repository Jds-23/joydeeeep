export interface Redirect {
    id: string;
    link: string;
    loadingMessage: string;
    delay?: number; // Optional, defaults to 500ms
}

export const redirects: Redirect[] = [
    {
        id: "clubsss",
        link: "https://thoracic-cocoa-05d.notion.site/Create-A-Club-with-clubsss-03d277eb26d14180a66816f61d392c33",
        loadingMessage: "You're getting redirected to Notion Doc",
        delay: 500
    },
    {
        id: "github",
        link: "https://github.com/Jds-23",
        loadingMessage: "Taking you to GitHub profile...",
        delay: 800
    },
    {
        id: "twitter",
        link: "https://x.com/0xJoydeeeep",
        loadingMessage: "Redirecting to Twitter...",
        // Uses default 500ms delay
    }
];
