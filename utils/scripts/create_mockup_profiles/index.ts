import { QueryArrayResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import type { Mod } from "../../seed.ts";
import { supabase, buildProfileImagePath } from "../../supabase.ts";
import { Transaction } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { decode } from 'npm:base64-arraybuffer'
import { readAll } from "https://deno.land/std@0.166.0/streams/conversion.ts"


// mockup pictures
const mockupPictures: unknown[] = []
const imageMockupDirPath = './scraped_images/mockup/'
for (const item of Deno.readDirSync(imageMockupDirPath + '1/')) {
    const f=await Deno.open( imageMockupDirPath + '1/'+ item.name);
    mockupPictures.push(await readAll(f))
}
for (const item of Deno.readDirSync(imageMockupDirPath + '2/')) {
    const f=await Deno.open( imageMockupDirPath + '2/'+ item.name);
    mockupPictures.push(await readAll(f))
}
for (const item of Deno.readDirSync(imageMockupDirPath + '3/')) {
    const f=await Deno.open( imageMockupDirPath + '3/'+ item.name);
    mockupPictures.push(await readAll(f))
}

function addImagesToProfileMockup(id: string, images: {id: string, file: unknown}[]){
    images.forEach(async (image)=>{
        const { error } = await supabase.storage
          .from('profiles')
          .upload(
              buildProfileImagePath(id, image.id), 
              decode(btoa(String.fromCharCode.apply(null, image.file as number[]))),
              { contentType: 'image/png' }
          )
        if(error)throw error
    })
}

async function addProfileMockupImages(ids: string[], transaction: Transaction){
    //only 3 profiles are needed
    ids = ids.slice(0,3)

    {
        const { error } = await supabase.storage.createBucket('profiles');
    }
    {
        const { error } = await supabase
          .storage
          .emptyBucket('profiles')
        if(error)throw error
    }

    const query =`
        insert into profile_images(profile_id, index) values
        ${(ids.reduce((carry, id)=>{
            carry = carry + `('${id}', 0),`
            carry = carry + `('${id}', 1),`
            return carry
        },'').slice(0, -1))}
        returning profile_id, index, id
    `

    const { rows: imageRows } = await transaction.queryArray(query)
    addImagesToProfileMockup(ids[0], [
        {
            id: imageRows[0][2],
            file: mockupPictures[0],
        },
        {
            id: imageRows[1][2],
            file: mockupPictures[1],
        }
    ])
    addImagesToProfileMockup(ids[1], [
        {
            id: imageRows[2][2],
            file: mockupPictures[2],
        },
        {
            id: imageRows[3][2],
            file: mockupPictures[3],
        }
    ])
    addImagesToProfileMockup(ids[2], [
        {
            id: imageRows[4][2],
            file: mockupPictures[4],
        },
        {
            id: imageRows[5][2],
            file: mockupPictures[5],
        }
    ])
}

async function inputMockup(_result: QueryArrayResult|undefined, transaction: Transaction){

    await addProfileMockupImages(
        (await transaction.queryArray(`select user_id from profiles;`)).rows.flat() as string[], 
        transaction
    )
    return ['bingo']
}
export const createProfileMockups: Mod = {
    input: inputMockup,
}
