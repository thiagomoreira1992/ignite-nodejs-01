import { parse } from 'csv-parse'
import fs from 'node:fs'


const tasksURL = new URL('../lista.csv', import.meta.url)

const stream = fs.createReadStream(tasksURL)


const csv = parse({
    delimiter: ',',
    fromLine: 2,
    skipEmptyLines: true
})

async function main() {
    const csvParse = stream.pipe(csv);

    for await (const line of csvParse) {
        const  [title, description]  = line

        await fetch('http://localhost:3334/tasks',{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                title, 
                description,
            })
        })

        await wait(500)
    }
}

main()

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}