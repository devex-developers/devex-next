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
| Branch Type | Naming Convention | Example | Description |
| :--- | :--- | :--- | :--- |
| **Main** | `main` | `main` | Production-ready stable release. |
| **Development** | `dev` | `dev` | Integration branch for ongoing sprint development. |
| **Feature** | `feat/DEVEX-##-feature-name` | `feat/DEVEX-74-add-auth` | New features or user stories. |
| **Bugfix** | `bugfix/DEVEX-##-issue-name` | `bugfix/DEVEX-82-fix-footer` | Bug and defect fixes. |
| **Hotfix** | `hotfix/DEVEX-##-critical-fix` | `hotfix/DEVEX-91-fix-login` | Critical production or blocking fixes. |

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


## Development Workflow

All work is tracked via **Jira DEVEX** work item keys so designs, branches, commits, and pull requests stay automatically linked across tools.

### 1. Pick and Claim a Work Item in Jira
1. Open the active sprint board, assign an item to yourself, and move your assigned work item (e.g `DEVEX-##`) from **To Do** to **In Progress**.
2. Copy the exact Jira work item key (e.g., `DEVEX-74`).

### 2. Design Handoff in Figma (UI / `needs-design` labels)
1. Name Figma pages, sections, or frames using the Jira work item key prefix:
   
   *Example:* `[DEVEX-74] Registration, Login & Profile UI`
2. Paste the Figma frame or URL into the Jira work item's **Design** section.

### 3. Branching and Git Workflow
All feature and fix branches must branch off **`dev`** and target **`dev`** via Pull Request. Direct pushes to `main` and `dev` are restricted.

1. **Sync `dev` locally before starting a new task:**
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. **Create a branch formatted as `<type>/DEVEX-##-<short-name>`:**
   * `feat/DEVEX-##-feature-name` — New features or user stories
   * `bugfix/DEVEX-##-issue-name` — Bug fixes
   * `hotfix/DEVEX-##-critical-fix` — Critical emergency fixes
   * `chore/DEVEX-##-short-description` — Config, seeding, docs, or refactoring
   * `test/DEVEX-##-short-description` — Integration or QA tests

   *Example:*
   ```bash
   git checkout -b feat/DEVEX-74-add-auth
   ```

### 4. Committing & Pushing Changes
Include the exact Jira work item key (`DEVEX-##`) in every commit message so that it is automatically attached to the ticket.

**Common Types:**
* `feat`: New feature or user story
* `fix`: Bug fix
* `docs`: Documentation only changes
* `style`: Formatting, missing semicolons, etc.
* `refactor`: Refactoring code without adding a feature or fixing a bug
* `test`: Adding or updating tests
* `chore`: Build tasks, package updates, dev configurations

```bash
git add .
git commit -m "feat(auth): DEVEX-74 configure JWT session token validation"
git push -u origin feat/DEVEX-74-add-auth
```

### 5. Pull Request & Review (`-> dev`)
1. Open a Pull Request on GitHub merging your branch into **`dev`**.
2. Format the **PR Title** with the Jira key:
   ```text
   feat(auth): DEVEX-74 add secure authentication and session tokens
   ```
3. In the PR description:
   * Reference the Jira work item key (`DEVEX-74`).
   * Attach the corresponding Figma frame link if UI changes are included.
   * Summarize what was tested locally.
4. Move the Jira work item to **In Review** (and to **Done** once reviewed and merged into `dev`).

---

## Quick Naming Reference

| Tool | Format | Example (`DEVEX-74`) |
| :--- | :--- | :--- |
| **Jira Work Item** | `DEVEX-##` + Clean action summary | `DEVEX-74` — *Register, log in, and customize profile* |
| **Figma Frame** | `[DEVEX-##] <Screen / Flow Name>` | `[DEVEX-74] Registration, Login & Profile UI` |
| **GitHub Branch** | `<type>/DEVEX-##-<kebab-slug>` | `feat/DEVEX-74-add-auth` or `bugfix/DEVEX-82-fix-footer` |
| **GitHub Commit** | `<type>(<scope>): DEVEX-## <imperative summary>` | `feat(auth): DEVEX-74 add user registration endpoint` |
| **GitHub PR Title** | `<type>(<scope>): DEVEX-## <work-item-summary>` | `feat(auth): DEVEX-74 register, log in, and customize profile` |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
