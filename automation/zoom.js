// If you are reading this, feel free to make the logic, logical
// And make sure to send it!
import Mailjs from "@cemalgnlts/mailjs";
import { createAccount } from "../functions/createAccount.js";
import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { faker } from "@faker-js/faker";

puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ACCOUNTS_FILE = join(__dirname, "..", "accounts.json");
const SETTINGS_FILE = join(__dirname, "..", "settings.json");

export const loadSettings = async () =>
    JSON.parse(await fs.readFile(SETTINGS_FILE, "utf8"));

export async function saveAccount(email, emailPass, zoomPass, firstName, lastName) {
    const account = {
        accountName: `${firstName} ${lastName}`,
        accountMail: email,
        mailPassword: emailPass,
        zoomPassword: zoomPass,
        date: new Date().toISOString(),
        working: true
    };

    let accounts = [];
    try {
        accounts = JSON.parse(await fs.readFile(ACCOUNTS_FILE, "utf8"));
    } catch { }

    accounts.push(account);
    await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
    return account;
}

export async function createZoomAccount(birthYear, password, firstName, lastName, log) {
    log("Creating temporary email...");

    const mailjs = new Mailjs();
    const { username: email, password: emailPass } = await createAccount(mailjs);

    log(`Temp email created: ${email}`);
    await mailjs.login(email, emailPass);
    log("MailJS login successful.");

    if(!firstName) firstName = faker.person.firstName();
    if(!lastName) lastName = faker.person.lastName();

    const { browser, page } = await launchZoomSignup(email, birthYear, log);
    if (!page) throw new Error("Failed to initialize Zoom signup.");

    log("Waiting for verification code...");
    const code = await waitForVerificationCode(mailjs, log);

    await completeSignup(page, code, firstName, lastName, password, log);
    await page.waitForSelector("button.to-basic-account", {
        visible: true,
        timeout: 20000
    });

    await page.click("button.to-basic-account");

    const saved = await saveAccount(email, emailPass, password, firstName, lastName);
    await browser.close();
    log("Account created successfully.");

    return saved;
}

async function launchZoomSignup(email, birthYear, log) {
    const browser = await puppeteer.launch({
        headless:  "new",
        args: ["--no-sandbox"],
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();

    log("Opening Zoom signup...");
    await page.goto("https://zoom.us/signup#/signup/email", { waitUntil: "networkidle2" });

    await declineCookies(page);

    const yearSelector = (await page.$('[id$="__BirthYear-input"]'))
        ? '[id$="__BirthYear-input"]'
        : "#year";

    await fill(page, yearSelector, birthYear, "Birth Year", log);
    await click(page, 'button.zm-button--primary', "Continue (Year)", log);

    await fill(page, "#email", email, "Email", log);
    await click(page, 'button.zm-button--primary', "Continue (Email)", log);

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    return { browser, page };
}

async function waitForVerificationCode(mailjs, log) {
    return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject("Email timeout."), 120000);

        mailjs.on("arrive", (msg) => {
            const code = msg?.intro?.match(/\b\d{6}\b/)?.[0];
            if (code) {
                clearTimeout(timeout);
                log(`Verification code: ${code}`);
                resolve(code);
            }
        });
    });
}

async function completeSignup(page, code, first, last, pass, log) {
    await fill(page, '[aria-label="Verification code"]', code, "Verification Code", log);
    await click(page, '.zm-button--primary.zm-button--large', "Verify", log);

    await fill(page, "#firstName", first, "First Name", log);
    await fill(page, "#lastName", last, "Last Name", log);
    await fill(page, '[name="password"]', pass, "Password", log);

    await click(page, 'button.zm-button--primary.zm-button--large', "Finish Signup", log);
}

async function fill(page, selector, value, name, log) {
    await page.waitForSelector(selector, { visible: true });
    await page.click(selector, { clickCount: 3 });
    await page.type(selector, String(value), { delay: 10 });
    log(`${name} entered.`);
}

async function click(page, selector, label, log) {
    try {
        await page.waitForSelector(selector, { visible: true });
        await page.click(selector);
        log(`Clicked: ${label}`);
    } catch {
        log(`Failed to click: ${label}`);
    }
}

async function clickButtonByText(page, text, log, timeout = 15000) {
    log(`Searching for button: "${text}"`);

    const start = Date.now();
    while (Date.now() - start < timeout) {
        const clicked = await page.evaluate((t) => {
            for (const span of document.querySelectorAll("span.zm-button__slot")) {
                if (span.innerText.trim() === t) {
                    const btn = span.closest("button");
                    if (btn) {
                        btn.scrollIntoView({ behavior: "auto", block: "center" });
                        btn.click();
                        return true;
                    }
                }
            }
            return false;
        }, text);

        if (clicked) {
            log(`Clicked button: "${text}"`);
            return true;
        }

        await page.waitForTimeout(300);
    }

    throw new Error(`Could not click button "${text}"`);
}


async function declineCookies(page) {
    const selector = "#onetrust-reject-all-handler";
    if (await page.$(selector)) await page.click(selector);
}
