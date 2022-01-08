const express = require("express")
const puppeteer = require("puppeteer")
const asciify = require("asciify-image")
const url = require("url")

const app = express()
const port = process.env.PORT || 3000

app.get("/", async (req, res) => {
  const query = url.parse(req.url, true).query
  if (query.url) {
    console.log("Requested: " + query.url)

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      defaultViewport: { width: 1024, height: 600 },
    })

    try {
      const page = await browser.newPage()
      await page.goto(query.url)
      const screenshot = await page.screenshot({
        fullPage: query?.full ?? false,
      })
      asciify(
        screenshot,
        { fit: "box", width: query?.w ?? 50 },
        (err, converted) => {
          res.send(err || converted)
        }
      )
    } catch (err) {
      console.error(err)
      res.send("something went wrong.")
    }
    await browser.close()
  } else {
    res.send('please include a "url" query with the site you wish to see.')
  }
})

app.listen(port, () => console.log(`browscii listening on port ${port}!`))
