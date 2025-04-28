const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let running = true;

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
];

async function startBot() {
    let options = new chrome.Options();

    // Cấu hình Anti-Detect (phiên bản đúng cho JavaScript)
    options.addArguments(
        "--start-maximized",
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        `--user-agent=${userAgents[Math.floor(Math.random() * userAgents.length)]}`
    );

    // Cách đúng để set experimental options trong JavaScript
    options.set('excludeSwitches', ['enable-automation']);
    options.set('useAutomationExtension', false);

    options.setChromeBinaryPath("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        await driver.executeScript(`
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
            window.chrome = {runtime: {}};
        `);

        await driver.get("https://market.okvip.business/market");
        console.log("✅ Đã mở trang web!");

        function listenForInput() {
            rl.question("Nhấn 0 để dừng bot, 1 để tiếp tục: ", (answer) => {
                if (answer === "0") {
                    running = false;
                    console.log("⏹ Bot dừng lại.");
                    rl.close();
                    driver.quit();
                } else if (answer === "1") {
                    console.log("▶ Tiếp tục vòng lặp...");
                    listenForInput();
                } else {
                    console.log("❌ Lựa chọn không hợp lệ, hãy nhấn 0 hoặc 1!");
                    listenForInput();
                }
            });
        }

        listenForInput();

        while (running) {
            console.log("🔎 Kiểm tra phần tử...");

            try {
                let element = await driver.wait(
                    until.elementLocated(By.css("html > body > div:first-of-type > div:first-of-type > div:nth-of-type(2) > div:nth-of-type(3) > div:first-of-type > div:nth-of-type(2) > div:first-of-type > div:first-of-type > div:first-of-type > div:first-of-type > div:first-of-type > table:first-of-type > tbody:first-of-type > tr:first-of-type > td:nth-of-type(7) > div:first-of-type > div:first-of-type > span:first-of-type > svg:first-of-type > path:first-of-type")),
                    5000
                );

                console.log("✅ Phần tử tồn tại! Đang click...");
                await driver.executeScript(`
                    arguments[0].dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, view: window}));
                    setTimeout(() => {
                        arguments[0].dispatchEvent(new MouseEvent('mouseup', {bubbles: true, cancelable: true, view: window}));
                    }, ${Math.random() * 300 + 100});
                `, element);

                let confirmButton = await driver.wait(
                    until.elementLocated(By.css("body > div:nth-of-type(3) > div:first-of-type > div:nth-of-type(2) > div:first-of-type > div:nth-of-type(2) > div:nth-of-type(3) > button:nth-of-type(2) > span:first-of-type")),
                    5000
                );

                console.log("🖱 Click vào nút xác nhận...");
                await confirmButton.click();

            } catch (error) {
                console.log("❌ Phần tử không tồn tại! Đang reload trang...");
                await driver.navigate().refresh();
                await driver.sleep(2000 + Math.random() * 1000);
            }
        }
    } catch (error) {
        console.error("🚨 Lỗi:", error);
    }
}

startBot();