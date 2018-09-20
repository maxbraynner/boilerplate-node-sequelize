import { Scope } from "../../enums/scope";

export default interface UserFilter {

    id: string
    email: string
    nome: string
    status: string
    scope: Scope

}