import * as INTERFACE from './other-interfaces';
export interface Link {
    href: string,
    rel: string,
    method: string
}

export interface Historic{
    title: string,
    valor: number,
    descripcion: string,
    estadoLecturaId: string,
    fechaActualizacion?: string,
    user: string,
    action: string,
    concesionId: 1,
    id: 3,
    entidadId: 2,
    fechaAlta: Date,
    fechaBaja: Date,
    fechaModificacion: Date,
    usuarioCreador: string,
    usuarioModificador: string
}

export interface Reading{
    id?: number
    titulo?: string,
    valor?: number,
    descripcion: string,
    estadoLecturaId: number,
    usuarioCreador?: string
    fechaCreacion?: Date,
    activo?: boolean,
    historico?: Historic[],
    links?: Link[]
}

export interface ID_READING{
    id?: number
    titulo?: string,
    valor?: number,
    descripcion: string,
    estadoLecturaId: number,
    usuarioCreador?: string
    fechaCreacion: Date,
    activo?: boolean
}

export interface ACCOUNT{
    id: number,
    nombreUsuario: string,
    nombre?: string,
    primerApellido?: string,
    segundoApellido?: string,
    email: string,
    numeroTelefono?: number,
    idiomaPreferido: string,
    formatoFechaHora: string,
    formatoNumerico: string,
    esUsuarioLocal: string
}

