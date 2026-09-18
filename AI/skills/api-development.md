# API Development Skill

Workflow para criar novos endpoints REST no backend do StoCat.

## Fluxo de Trabalho

### 1. Definir a Rota

Adicionar a rota em `back-end/src/routes/` seguindo o padrão existente:

```javascript
const router = require('express').Router();
const controller = require('../controllers/exampleController');
const { validate } = require('../middlewares/validationMiddleware');
const { schema } = require('../middlewares/validationSchemas');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', authMiddleware, controller.getAll);
router.post('/', authMiddleware, adminMiddleware, validate(schema.create), controller.create);

module.exports = router;
```

### 2. Criar o Schema de Validação

Adicionar schema Joi em `back-end/src/middlewares/validationSchemas.js`:

```javascript
const createExample = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
});
```

### 3. Criar o Repository

Criar arquivo em `back-end/src/repositories/`:

```javascript
const pool = require('../config/database');

class ExampleRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM examples');
    return result.rows;
  }

  async create(data) {
    const result = await pool.query(
      'INSERT INTO examples (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email]
    );
    return result.rows[0];
  }
}

module.exports = new ExampleRepository();
```

### 4. Criar o Service

Criar arquivo em `back-end/src/services/`:

```javascript
const repository = require('../repositories/exampleRepository');
const { AppError } = require('../errors/appError');

class ExampleService {
  async getAll() {
    return await repository.findAll();
  }

  async create(data) {
    // Validações de negócio
    const existing = await repository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email já cadastrado', 409);
    }
    return await repository.create(data);
  }
}

module.exports = new ExampleService();
```

### 5. Criar o Controller

Criar arquivo em `back-end/src/controllers/`:

```javascript
const service = require('../services/exampleService');

class ExampleController {
  async getAll(req, res, next) {
    try {
      const result = await service.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExampleController();
```

### 6. Registrar no App

Adicionar a rota em `back-end/src/app.js`:

```javascript
const exampleRoutes = require('./routes/exampleRoutes');
app.use('/api/examples', exampleRoutes);
```

## Convenções

- Controllers tratam erros com try/catch e forward para `next(error)`
- Services contêm lógica de negócio e usam `AppError` para erros
- Repositories contêm queries SQL puras
- Usar `asyncHandler` para handlers assíncronos
- Retornar status apropriados: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 404 (Not Found), 409 (Conflict)
- Todas as rotas devem ter auth exceto login e health
- Rotas admin devem ter `adminMiddleware`
