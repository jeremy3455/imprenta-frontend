# Reglas del proyecto (Frontend - Angular)

## Documentación de código

Todo método, función, propiedad pública o componente nuevo (o modificado) debe llevar un comentario explicando su propósito, **antes** de hacer commit.

### Estilo de comentarios (JSDoc)

Usar el formato JSDoc estándar de TypeScript/Angular:

```typescript
/**
 * Obtiene la lista de usuarios activos desde el backend.
 * @param page - Número de página a consultar (inicia en 1)
 * @param pageSize - Cantidad de registros por página
 * @returns Observable con la lista paginada de usuarios
 */
getActiveUsers(page: number, pageSize: number): Observable<UserPage> {
  return this.http.get<UserPage>(`${this.apiUrl}/users/active`, {
    params: { page, pageSize }
  });
}
```

### Qué debe llevar comentario

- **Servicios** (`*.service.ts`): cada método público debe documentar qué hace, parámetros y qué retorna.
- **Componentes** (`*.component.ts`): documentar el propósito general del componente arriba de la clase, y cada método del ciclo de vida o evento (`onSubmit`, `ngOnInit`, etc.) con una línea breve si su lógica no es obvia.
- **Guards, interceptors, pipes, directivas**: documentar su propósito y comportamiento.
- **Modelos/interfaces** (`*.model.ts`): comentar cada propiedad si su nombre no es autoexplicativo.
- **Métodos privados**: comentar solo si la lógica es compleja o no es evidente a simple vista.

### Qué NO hacer

- No dejar código sin comentar antes de hacer commit.
- No usar comentarios obvios o redundantes (ej. `// suma a más b` sobre `a + b`).
- No comentar código muerto/comentado como solución — eliminarlo en vez de dejarlo comentado.

## Convenciones generales

- Comentarios en español.
- Seguir el estilo de Angular (Angular Style Guide) para nombres de archivos, carpetas y estructura.
- Mantener los componentes pequeños y enfocados (single responsibility).

## Antes de hacer commit / push

1. Verificar que todo método/función nuevo o modificado tenga su comentario JSDoc correspondiente.
2. Si encuentras código sin comentar en archivos que estás tocando, agrégalo.
3. Escribir mensajes de commit claros, describiendo qué se cambió y por qué (no solo "fix" o "update").
4. Ejecutar `ng lint` (si está configurado) antes de subir cambios.
