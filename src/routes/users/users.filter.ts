import { Scope } from "../../enums/Scope";

export default interface UserFilter {

    id: string
    email: string
    nome: string
    status: string
    scope: Scope

}