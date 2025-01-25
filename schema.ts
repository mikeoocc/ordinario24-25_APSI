export const schema = `#graphql

type Contact {
    id: ID!,
    nombreCompleto: String,
    telefono: String,
    residencia: String,
    horaActual: String
}

type Query {
    contact(id: String!): Contact
}

type Mutation {
    addContact(nombreCompleto: String!, telefono: String!): Contact
}

`