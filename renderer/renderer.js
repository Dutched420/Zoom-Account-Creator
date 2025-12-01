const logBox = document.getElementById("log");
const btn = document.getElementById("createBtn");

function log(message) {
    logBox.textContent += message + "\n";
    logBox.scrollTop = logBox.scrollHeight;
}

window.electronAPI.onAutomationLog((msg) => log(msg));

btn.addEventListener("click", async () => {
    log("Starting account creation...");

    const birthYear = document.getElementById("birthYear").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    if (!birthYear || !password) {
        return log("❌ Birth year + password are required.");
    }

    const result = await window.electronAPI.createZoomAccount({
        birthYear,
        password,
        firstName,
        lastName
    });

    log("\n🎉 Account Created Successfully:");
    log(JSON.stringify(result, null, 2));
});

async function loadAccounts() {
    const container = document.getElementById("accountsList");
    container.innerHTML = "Loading...";

    const accounts = await window.electronAPI.getAccounts();
    container.innerHTML = "";

    if (!accounts.length) {
        container.innerHTML = "<p>No accounts saved yet.</p>";
        return;
    }

    accounts.forEach((acc) => {
        const card = document.createElement("div");
        card.className = "account-card";

        card.innerHTML = `
            <strong>${acc.accountName}</strong><br>
            <small>${new Date(acc.date).toLocaleString()}</small>

            <div style="margin-top:12px;">

                <div class="copy-field" data-label="Email" data-copy="${acc.accountMail}">
                    <b>Email:</b> <span>${acc.accountMail}</span>
                </div>

                <div class="copy-field" data-label="Email Pass" data-copy="${acc.mailPassword}">
                    <b>Email Pass:</b> <span>${acc.mailPassword}</span>
                </div>

                <div class="copy-field" data-label="Account Pass" data-copy="${acc.zoomPassword}">
                    <b>Account Pass:</b> <span>${acc.zoomPassword}</span>
                </div>

            </div>

            <div class="copy-feedback" style="
                display:none;
                margin-top:8px;
                color:#4a93ff;
                font-size:13px;
            "></div>
        `;

        card.querySelectorAll(".copy-field").forEach(field => {
            field.addEventListener("click", () => {
                const value = field.dataset.copy;
                const label = field.dataset.label;

                navigator.clipboard.writeText(value);

                const feedback = card.querySelector(".copy-feedback");
                feedback.textContent = `Copied: ${label}`;
                feedback.style.display = "block";

                setTimeout(() => {
                    feedback.style.display = "none";
                }, 900);
            });
        });

        container.appendChild(card);
    });
}

document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");

        document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(item.dataset.target).classList.add("active");

        if (item.dataset.target === "saved-section") {
            loadAccounts();
        }
    });
});
