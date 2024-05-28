import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto"


const database = new Database

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body

            const [task] = database.select('tasks').filter(task => task.id === id)

            if(task){
                if(!task.completed_at){
                    database.update('tasks', id, {
                        ...task,
                        title, 
                        description
                    })

                    return res.writeHead(201).end()
                }

                return res.writeHead(401).end(JSON.stringify("Task alredy completed"))
            }

            return res.end()

        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const rowExists = database.delete('tasks', id)

            if (rowExists === null) {
                return res.writeHead(401).end(JSON.stringify("Task not exist"))
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const tasks = database.select('tasks')
            const task = tasks.filter(task => task.id === id)
            const { title, description, created_at } = task[0]


            if (task) {
                if(!task[0].completed_at){
                    database.update('tasks', id, {
                        id,
                        ...task[0],
                        completed_at: new Date(),

                    })
    
                    return res.writeHead(201).end()
                }

                return res.writeHead(401).end(JSON.stringify("Task alredy completed"))
            }
        }
    },
]