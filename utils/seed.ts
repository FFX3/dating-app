import { Client, Transaction } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const env = await load();
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";

import { mod as createProfiles } from "./scripts/create_profiles/index.ts"

const DATABASE_URL = env['DATABASE_URL']

const client = new Client(DATABASE_URL)

export type Mod = {
    path: string,
    input?: (result: QueryArrayResult|undefined, transaction: Transaction)=>Promise<string[]>
}
const moduleList:Mod[] = [
    {
        path: 'clean',
    },
    {
        path: 'create_users',
    },
    createProfiles,
]

type Instruction = {
    sql: string,
    name: string,
    order: number,
}

function buildModual(path: string){
    const fullPath = "scripts/" + path
    const scripts: Instruction[] = []
    for(const dirEntry of Deno.readDirSync(fullPath)) {
        if(dirEntry.isFile && dirEntry.name.endsWith('.sql')) {
            scripts.push(
                {
                    sql: Deno.readTextFileSync(fullPath + "/" + dirEntry.name),
                    name: dirEntry.name,
                    order: parseInt(dirEntry.name.split('_')[dirEntry.name.length-1])
                }
            )
        }
    }

    scripts.sort((a,b)=>{
        return a.order < b.order ? -1 : 1
    })
    return { 
        instructions: scripts
    }
}

type IntructionsModual = {
    input?: string[]
    instructions: Instruction[]
}

async function excuteMod(module: IntructionsModual, input: string[]|undefined){
    let index = 0
    let result
    try {
        for(const script of module.instructions){
            if(script.name.startsWith('template')){
                result = await transaction.queryArray(script.sql, input)
            } else {
                result = await transaction.queryArray(script.sql)
            }
            index++
        }
    } catch(e){
        console.error(e)
    }
    console.log(result)
    return result
}

let previousResult: QueryArrayResult | undefined

const transaction = client.createTransaction("seed");
await transaction.begin()
for (const modInstruction of moduleList) {
    const mod = buildModual(modInstruction.path)
    let input
    if( modInstruction.input){
        input = await modInstruction.input(previousResult, transaction)
    }
    previousResult = await excuteMod(mod, input)
}
transaction.rollback()

