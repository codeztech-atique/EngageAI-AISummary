const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const chalk = require('chalk');


// Initialize the Bedrock Runtime client
const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function invokeJambaMini(prompt) {
    const params = {
        modelId: "ai21.j2-mid-v1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            prompt: `Please summarize the following text into key points and provide clear section headlines: ${prompt}`,
            maxTokens: 200,
            temperature: 0.7,
            topP: 1,
            stopSequences: [],
            countPenalty: { scale: 0 },
            presencePenalty: { scale: 0 },
            frequencyPenalty: { scale: 0 }
        })
    };

    try {
        const command = new InvokeModelCommand(params);
        const response = await client.send(command);

        const buffer = Buffer.from(response.body);
        const text = buffer.toString();
        const responseData = JSON.parse(text);

        // console.log("Response:", responseData);
        console.log(chalk.red("\nQuestion Asked:\n"));
        console.log(chalk.blue(responseData.prompt.text+"\n"))
        return responseData;

    } catch (error) {
        console.error("Error invoking the model:", error);
        return null;
    }
}

const caseDescription = `
Climate change refers to long-term shifts in temperatures and weather patterns, mainly due to human activities such as burning fossil fuels. 
This process leads to global warming, rising sea levels, and more extreme weather events. While some regions may experience benefits from warmer 
temperatures, the overall impact is detrimental to ecosystems and human life.
`;

invokeJambaMini(caseDescription)
    .then(response => {
        console.log(chalk.yellow("\nGenerated Summary with Headlines:\n"));
        console.log(chalk.green(response.completions[0].data.text + "\n"));
    })
    .catch(err => console.error("Invocation Error:", err));

