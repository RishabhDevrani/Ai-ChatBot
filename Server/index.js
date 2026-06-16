let express = require('express');
let cors = require('cors');

require("dotenv").config()
let { GoogleGenerativeAI } = require("@google/generative-ai");


let app = express()
app.use(cors()) //Middleware
app.use(express.json())

let genAI = new GoogleGenerativeAI(process.env.KEY)
let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })


app.post('/ask', async (req, res) => {

    let { question } = req.body;
    // console.log(req.body);

    let data = await model.generateContent(question)
    let finalData = data.response.text();

    res.send(
        {
            _status: true,
            _message: "Content Found...",
            finalData
        }
    )
})



app.listen(process.env.PORT, () => {
    console.log("Server Start");
})