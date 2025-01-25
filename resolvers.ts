import { Collection, ObjectId } from "mongodb";
import type { Contact } from "./types.ts";
import { GraphQLError, responsePathAsArray } from "graphql";

export const resolvers = {

    Contact: {
        id: (parent: Contact) => {
            return parent._id.toString()
        },

        nombreCompleto: (parent: Contact) => {
            return parent.nombreCompleto
        },

        telefono: (parent: Contact) => {
            return parent.telefono
        },

        residencia: (parent: Contact) => {
            return parent.residencia
        },

        horaActual: (parent: Contact) => {
            return parent.horaActual
        }
    },

    Query: {
        contact: async (
            _: unknown,
            args: {id: string},
            ctx: {contactCollection: Collection<Contact>}
        ): Promise<Contact> => {
            const contact = await ctx.contactCollection.findOne({_id: new ObjectId(args.id)})
            if(!contact){throw new Error('No contact found. . .')}
            return contact
        }
    },

    Mutation: {
        addContact: async (
            _:unknown,
            args: {nombreCompleto: string, telefono: string},
            ctx: {contactCollection: Collection<Contact>}
        ) => {
            //const API_KEY = Deno.env.get('API_KEY')
            const API_KEY = 'API_KEY=PCEHIjecrZfpLcz0raKVJQ==mCRrSMJBwvsD1wkM'
            if(!API_KEY){ throw new Error('API key missing. . .')}

            const url1 = 'https://api.api-ninjas.com/v1/validatephone?number=' + args.telefono

            const response1 = await fetch(url1, {
                headers: {
                    "X-Api-Key": API_KEY,
                },
            })

            if(response1.status!=200) throw new GraphQLError("Error de API al validar telefono")
            const data1 = await response1.json()
            console.log(data1)
            const residencia = data1.country.toString()
            const timezone = data1.timezones[0].toString()

            const url2 = 'https://api.api-ninjas.com/v1/worldtime?timezone=' + timezone
            console.log(url2)

            const response2 = await fetch(url2, {
                headers: {
                    "X-Api-Key": API_KEY,
                },
            })

            if(response2.status!=200) throw new GraphQLError("Error de API al obtener el datetime")
            const data2 = await response2.json()
            console.log(data2)

            const horaActual = data2.datetime.toString()

            const {insertedId} = await ctx.contactCollection.insertOne({
                nombreCompleto: args.nombreCompleto,
                telefono: args.telefono,
                residencia: residencia,
                horaActual: horaActual
            })

            const contact = await ctx.contactCollection.findOne({_id: insertedId})
            return contact

        }
    }

}