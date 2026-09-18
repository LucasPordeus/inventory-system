# Auth Workflow Skill

Workflow para implementar autenticação e autorização no sistema StoCat.

## Arquitetura Atual

### Backend

- **JWT:** Tokens Bearer com HS256
- **Senhas:** bcrypt com salt separado
- **Roles:** `admin`, `user`
- **Middleware:** `authMiddleware`, `adminMiddleware`, `selfOrAdminMiddleware`

### Frontend

- **Token:** Armazenado em localStorage
- **Guard:** `authGuard` (CanActivateFn)
- **Services:** `AuthService`, `UserService`, `MenuService`

## Fluxo de Login

```
1. Frontend envia POST /api/auth/login { email, password }
2. Backend valida credenciais (bcrypt compare)
3. Backend gera JWT com { userId, email, role }
4. Backend retorna { token, user: { id, name, email, role }, screens: [...] }
5. Frontend armazena token no localStorage
6. Frontend popula menu com screens do usuário
7. Frontend navega para /products
```

## Criar Novo Endpoint Protegido

### 1. Com Auth Apenas

```javascript
// routes/exampleRoutes.js
router.get('/', authMiddleware, controller.getAll);
```

### 2. Com Auth + Admin

```javascript
router.post('/', authMiddleware, adminMiddleware, controller.create);
```

### 3. Com Auth + Self ou Admin

```javascript
router.get('/:id', authMiddleware, selfOrAdminMiddleware, controller.getById);
```

## Criar Novo Guard

```typescript
// guards/example-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const exampleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

## Criar Novo Middleware de Role

```javascript
// middlewares/roleMiddleware.js
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};

module.exports = roleMiddleware;
```

## Gerenciamento de Screens (Telas)

### Atribuir Screens a um Usuário

```javascript
// Via API
PUT /users/:id/screens
Body: { screenIds: [1, 2, 3] }
```

### Verificar Screens do Usuário

```javascript
// Backend: via token JWT
req.user.screens // Array de screen objects

// Frontend: via MenuService
menuService.getMenuItems() // Observable<MenuItem[]>
```

## Convenções

- Tokens devem ter expiração configurável
- Senhas devem ter min 8 chars, maiúscula, minúscula e número
- Rate limiting mais restritivo para endpoints de auth
- Token armazenado em localStorage (não cookies)
- Guard deve redirecionar para /login se não autenticado
- Middleware de auth deve extrair e verificar JWT
- Role deve ser verificada em middleware separado
- Screens devem ser carregadas no login e persistidas
- Logout deve limpar localStorage e redirecionar para /login

## Segurança

1. Nunca logar tokens ou senhas
2. Usar HTTPS em produção
3. JWT secret deve ser forte e em variável de ambiente
4. Tokens devem ter expiração curta (configurável)
5. Rate limiting deve ser configurado
6. CORS deve ser restritivo
7. Helmet deve estar habilitado
8. Senhas nunca retornadas em respostas da API
