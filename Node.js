const fs = require("fs");
const { execSync } = require("child_process");

// Function to execute Git commands
function runCommand(command) {
    try {
        execSync(command, { stdio: "inherit" });
    } catch (error) {
        console.error(`Error executing command: ${command}\n${error}`);
    }
}

// Function to commit changes with a specific date
function gitCommit(message, commitDate) {
    const commitDateStr = commitDate.toISOString();
    process.env.GIT_AUTHOR_DATE = commitDateStr;
    process.env.GIT_COMMITTER_DATE = commitDateStr;

    runCommand("git add info.txt");
    runCommand(`git commit -m "${message}" --date="${commitDateStr}"`);
}

// Function to push commits
function gitPush() {
    runCommand("git push --force");
}

// Function to generate fake commits
function fakeCommits(startDate, endDate, minCommits, maxCommits, skipping = false, maxSkipDays = 1) {
    const filePath = "info.txt";

    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "", "utf8");
    }

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        // Randomly skip days if enabled
        if (skipping && Math.random() < 0.5) {
            const skipDays = Math.floor(Math.random() * maxSkipDays) + 1;
            console.log(`\nSkipping ${skipDays} days from ${currentDate.toDateString()}`);
            currentDate.setDate(currentDate.getDate() + skipDays);
            continue;
        }

        // Generate random number of commits for the day
        const nCommits = Math.floor(Math.random() * (maxCommits - minCommits + 1)) + minCommits;
        console.log(`\n${nCommits} commits for date: ${currentDate.toDateString()}`);

        for (let i = 1; i <= nCommits; i++) {
            const info = `Date: ${currentDate.toDateString()}, Commit #: ${i}`;
            fs.writeFileSync(filePath, info, "utf8");
            console.log(info);
            gitCommit(info, currentDate);
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Push commits
    gitPush();
}

// Set the date range
const startDate = new Date("2019-03-04");
const endDate = new Date("2020-03-28");

// Set the min and max number of commits per day
const minCommits = 1;
const maxCommits = 10;

fakeCommits(startDate, endDate, minCommits, maxCommits, true, 1);