# DevEx: A Software Development Work Simulation Platform
You have been appointed as a Junior Developer at a Startup Company! DevEx is a gamified software development work simulation platform designed to bridge the gap between the academe and tech industry by allowing aspiring software developers to experience simulated workplace scenarios related to their field in a risk-free environment.

## Authors
1. Arquillano, Izeah D.
2. Esquejo, Roxane K-Anne D.
3. Narte, Ma. Victoria C.
4. Remolacio, Alexandra Geane M.  

## Key Features  
* **Simulated Workplace Scenarios:** Catalog of scenarios with company contexts, project requirements, task assignments, and descriptions.
* **In-Browser Coding:** Much like Leetcode. For now, it only integrates C#/.NET as it is part of our course learnings.
* **Simulated Team Collaboration:** Scripted events from Project Manager, Senior Developer, and QA Tester personas, status report posting, and simulated pull request code reviews.
* **Task Evaluation & Feedback:** Automated grading against test results, correctness, code quality checks, scoring, and revision/resubmission history.
* **Learning Progress:** Dashboards summarizing completed/in-progress simulations, skill performance metrics, and completion summaries.
  
## Branch Structure
* `main`: Production-ready stable release.
* `dev`: Integration branch for ongoing sprint development.
* `feature/<initials>-<short-description>`: Task and user story branches.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
