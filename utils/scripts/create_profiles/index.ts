import { QueryArrayResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import type { Mod } from "../../seed.ts";
import { supabase, buildProfileImagePath } from "../../supabase.ts";
import { Transaction } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { decode } from 'npm:base64-arraybuffer'
import { readAll } from "https://deno.land/std@0.166.0/streams/conversion.ts"


const imageDirPath = './scraped_images/downloads/'
const maleImagesDir = Deno.readDirSync(imageDirPath + 'men')
const femaleImagesDir = Deno.readDirSync(imageDirPath + 'women')

const menPictures = []
const womenPictures = []
for (const item of maleImagesDir) {
    const f=await Deno.open(imageDirPath + "/men/" + item.name);
    womenPictures.push(await readAll(f))
}

for (const item of femaleImagesDir) {
    const f=await Deno.open(imageDirPath + "/women/" + item.name);
    menPictures.push(await readAll(f))
}

//const maleImagesDir = Deno.readDirSync(imageDir + 'male')
//const femaleImagesDir = Deno.readDirSync(imageDir + 'female')

async function addProfileImages(ids: string[], transaction: Transaction){
    //TODO server should do most of this in a rpc or edge function
    const query =`
        insert into profile_images(profile_id, index) values
        ${(ids.reduce((carry, id)=>{
            carry = carry + `('${id}', 0),`
            carry = carry + `('${id}', 1),`
            return carry
        },'').slice(0, -1))}
        returning profile_id, index, id
    `
    console.log(query)
    const imageRows = await transaction.queryArray(query)
    imageRows.rows.map(async([profileId, _, id], index)=>{
        const profileImage = index % 2 == 0 ?
            womenPictures[Math.floor(Math.random() * womenPictures.length)]
            :
            menPictures[Math.floor(Math.random() * womenPictures.length)]

        {
            const { error } = await supabase
              .storage
              .emptyBucket('profiles')
            if(error)throw error
        }
        {
            const { error } = await supabase.storage
              .from('profiles')
              .upload(
                  buildProfileImagePath(profileId, id), 
                  decode(btoa(String.fromCharCode.apply(null, profileImage))),
                  { contentType: 'image/png' }
              )
            if(error)throw error
        }
    })
}

async function input(result: QueryArrayResult|undefined, transaction: Transaction){
    //expecting uuids
    const uuids = result?.rows.flat() as string[];
    if(!uuids) {
        throw('no uuids for profiles')
    }

    await addProfileImages(uuids, transaction)
    return uuids
}

export const mod: Mod = {
    path: 'create_profiles',
    input,
}
