// 获取聊天记录容器
const chatlogs = document.getElementById("chatlogs");

// 发送消息的函数
async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    console.log("用户输入：", userInput);  // 调试：打印用户输入的内容

    if (userInput.trim() === "") return;  // 防止空输入

    // 显示用户的消息
    const userMessage = document.createElement("div");
    userMessage.classList.add("user");
    userMessage.textContent = userInput;
    chatlogs.appendChild(userMessage);

    // 清空输入框
    document.getElementById("userInput").value = "";

    // 定义一个重试机制
    const maxRetries = 3; // 最大重试次数
    let attempt = 0;

    // API 主机和密钥
    const apiUrl = "https://yinli.one/v1/chat/completions";  // API 主机
    const apiKey = "sk-nQEhxxrh8kXRcwfFvKlqufLTL35Fsf1fkEQVnP0HpfaTGDkX";  // 替换为你的 API 密钥

    // 给模型角色设定，暗示它扮演小猫咪并加上"喵喵"
    const systemMessage = "你是一只小猫咪，每次说话后都要加上‘喵喵’。";

    // 调用中转 API 获取 AI 的回复
    while (attempt < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`  // 使用 Bearer Token 进行认证
                },
                body: JSON.stringify({
                    model: "gpt-4",  // 指定为 GPT-4 模型
                    messages: [
                        { role: "system", content: systemMessage },  // 给模型的角色设定
                        { role: "user", content: userInput }  // 用户输入的消息
                    ]
                })
            });

            // 如果请求成功
            if (response.ok) {
                const data = await response.json();
                console.log("AI 回复数据：", data);  // 打印返回的 AI 数据

                // 获取 AI 的回复并加上“喵喵”
                let aiMessage = data.choices[0].message.content.trim();
                

                // 显示 AI 的回复
                const aiMessageElement = document.createElement("div");
                aiMessageElement.classList.add("ai");
                aiMessageElement.textContent = aiMessage;
                chatlogs.appendChild(aiMessageElement);

                // 自动滚动到底部
                chatlogs.scrollTop = chatlogs.scrollHeight;

                break; // 成功后跳出循环
            } else {
                throw new Error("API 请求失败，状态码：" + response.status);
            }
        } catch (error) {
            attempt++;
            console.error(`第 ${attempt} 次请求失败：`, error);
            if (attempt === maxRetries) {
                alert("请求失败，请稍后再试。");
            } else {
                console.log("等待 2 秒后重试...");
                await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒后重试
            }
        }
    }
}
