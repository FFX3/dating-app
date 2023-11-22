import { QueryArrayResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import type { Mod } from "../../seed.ts";
import { Transaction } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { faker } from 'npm:@faker-js/faker';



async function input(_result: QueryArrayResult|undefined, transaction: Transaction){
    const result = await transaction.queryArray(`
        select distinct p.user_id
        from profiles p
        join profile_images pi
            on pi.profile_id = p.user_id
    `)

    const idsToOnboard = result.rows.flat()


    idsToOnboard.forEach((id)=>{
        console.log(id)
        transaction.queryArray(`
            update profiles
                set onboarded = true,
                name = '${faker.person.fullName({sex: 'female'})}',
                sex = 'female',
                interested_in = '{"male", "other", "female"}',
                bio = '${faker.person.bio()}',
                availability = (
                    '{[10:00,20:00]}',
                    '{[10:00,20:00]}',
                    '{[10:00,20:00]}',
                    '{[10:00,20:00]}',
                    '{[10:00,20:00]}',
                    '{[10:00,20:00]}',
                    '{[10:00,20:00]}'
                )::availability.weekly_availability
            where user_id = '${id}'
        `)
    })


    return ['']
}

export const setUpProfilesForMockup: Mod = {
    input,
}

